const fetch = require("node-fetch");
const url = require("url");
const cheerio = require("cheerio");
const _ = require("lodash/fp");
const normalizeUrlL = require("normalize-url");

const { filter } = require("lodash/fp");

const {
  toFacebookDesktop,
  toWWWFacebook,
  normaliseUrl
} = require("./src/urls.js");
const {
  getGroupsFromAirtable,
  chunkForAirtable,
  airtableDatabase
} = require("./src/airtable");
const { findMissingGroups } = require("./src/lists");

const FREEDOM_LIST =
  "https://freedomnews.org.uk/covid-19-uk-mutual-aid-groups-a-list/";

const removeSearchFromUrl = _.map(normaliseUrl);

async function getFreedomLinks() {
  const response = await fetch(FREEDOM_LIST);
  const text = await response.text();
  const $ = cheerio.load(text);

  const $links = $(".entry-content ul a");

  const rawLinks = [];
  $links.each((_, link) => {
    rawLinks.push($(link).attr("href"));
  });

  // Ugly but last 10 URLs are national level
  return removeSearchFromUrl(rawLinks).slice(0, -10);
}

(async () => {
  const freedomLinks = await getFreedomLinks();

  const groupsFromFreedom = freedomLinks.map(link => ({
    url: link
  }));
  const groupsFromAirtable = await getGroupsFromAirtable();

  const notFoundInFreedomListButInAirtable = findMissingGroups(
    groupsFromAirtable,
    groupsFromFreedom
  );

  const notFoundInAirtableButInFreedomList = findMissingGroups(
    groupsFromFreedom,
    groupsFromAirtable
  );

  const groupsInFreedomListAndInAirtable = filter(
    group => groupsFromFreedom.find(x => group.url === x.url),
    groupsFromAirtable
  );

  console.log(`Freedom list has ${groupsFromFreedom.length} groups`);
  console.log(`${groupsFromAirtable.length} groups in Airtable`);
  console.log(
    `${notFoundInFreedomListButInAirtable.length} not found in Freedom list`
  );

  console.log("Updating Freedom syncing");

  const chunkedForAirtableMissing = chunkForAirtable(
    notFoundInFreedomListButInAirtable.map(group => ({
      id: group.id,
      fields: {
        "Including On Freedom List": false
      }
    }))
  );

  chunkedForAirtableMissing.forEach(async chunk => {
    const results = await airtableDatabase(
      "COVID-19 UK Mutual Aid Groups"
    ).update(chunk);
  });

  const chunkedForAirtableInFreedomList = chunkForAirtable(
    groupsInFreedomListAndInAirtable.map(group => ({
      id: group.id,
      fields: {
        "Including On Freedom List": true
      }
    }))
  );

  chunkedForAirtableInFreedomList.forEach(async chunk => {
    const results = await airtableDatabase(
      "COVID-19 UK Mutual Aid Groups"
    ).update(chunk);
  });

  if (notFoundInAirtableButInFreedomList.length > 0) {
    console.log(notFoundInAirtableButInFreedomList);
  }
})();
