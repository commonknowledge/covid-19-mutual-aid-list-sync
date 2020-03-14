const fetch = require("node-fetch");
const url = require("url");
const cheerio = require("cheerio");
const _ = require("lodash/fp");
const normalizeUrlL = require("normalize-url");

const base = require("airtable").base("appo0BT91w2rrr856");

const FREEDOM_LIST =
  "https://freedomnews.org.uk/covid-19-uk-mutual-aid-groups-a-list/";

const nationalLinks = [
  "https://www.facebook.com/queercare/",
  "https://docs.google.com/forms/d/e/1FAIpQLSd8BIwaHX7x9oOuOHcPVT3H-xq91dCFyo09tVANoxnm4CrsYg/viewform",
  "https://www.facebook.com/CovidAidUK/",
  "https://www.swarmcollective.org/",
  "https://www.swarmcollective.org/donate",
  "https://maydayrooms.org/",
  "https://dundeeanarchistbookfair.org/",
  "https://queercare.network/covid-19/"
];

const chunkForAirtable = _.chunk(10);

const dropNational = _.remove(href => nationalLinks.includes(href));

const toFacebookDesktop = href =>
  href.replace("https://m.facebook.com/", "https://www.facebook.com/");

const toWWWFacebook = href =>
  href.replace("https://facebook.com/", "https://www.facebook.com/");

const normaliseUrl = href => {
  return toWWWFacebook(
    toFacebookDesktop(
      normalizeUrlL(href, {
        forceHttps: true,
        stripHash: true,
        stripWWW: false,
        removeQueryParameters: [/(.*?)/],
        removeTrailingSlash: true
      })
    )
  );
};

const removeSearchFromUrl = _.map(normaliseUrl);

async function getFreedomLinks() {
  const response = await fetch(FREEDOM_LIST);
  const text = await response.text();
  const $ = cheerio.load(text);

  const $links = $(".entry-content ul a");

  const rawLinks = [];
  $links.each((index, link) => {
    rawLinks.push($(link).attr("href"));
  });

  return dropNational(removeSearchFromUrl(rawLinks));
}

(async () => {
  const freedomLinks = await getFreedomLinks();

  const groupsFromAirtable = [];

  await base("COVID-19 UK Mutual Aid Groups")
    .select({
      view: "All Groups"
    })
    .eachPage((records, fetchNextPage) => {
      records.forEach(function(record) {
        const facebookGroup = record.get("Facebook Group");
        groupsFromAirtable.push({
          id: record.id,
          url: normaliseUrl(record.get("Facebook Group")),
          name: record.get("Name"),
          location: record.get("Location")
        });
      });
      fetchNextPage();
    });

  const notFoundInFreedomList = [];
  const inFreedomList = [];

  groupsFromAirtable.forEach(group => {
    if (!freedomLinks.includes(group.url)) {
      notFoundInFreedomList.push(group);
      return;
    }
    inFreedomList.push(group);
  });

  console.log(`Freedom list has ${freedomLinks.length} groups`);
  console.log(`${groupsFromAirtable.length} groups in Airtable`);
  console.log(`${notFoundInFreedomList.length} not found in Freedom list`);
  console.log("Updating Freedom syncing");

  // Ones missing from main list but in Freedom list

  const chunkedForAirtableMissing = chunkForAirtable(
    notFoundInFreedomList.map(group => ({
      id: group.id,
      fields: {
        "Including On Freedom List": false
      }
    }))
  );

  chunkedForAirtableMissing.forEach(async chunk => {
    const results = await base("COVID-19 UK Mutual Aid Groups").update(chunk);
  });

  const chunkedForAirtablePresent = chunkForAirtable(
    inFreedomList.map(group => ({
      id: group.id,
      fields: {
        "Including On Freedom List": true
      }
    }))
  );

  chunkedForAirtablePresent.forEach(async chunk => {
    const results = await base("COVID-19 UK Mutual Aid Groups").update(chunk);
  });
})();
