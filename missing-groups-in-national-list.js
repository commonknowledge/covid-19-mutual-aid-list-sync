const fs = require("fs");
const fetch = require("node-fetch");
const neatCsv = require("neat-csv");
const { map, chunk } = require("lodash/fp");

const { base, getGroupsFromAirtable } = require("./src/airtable");
const { normaliseUrl } = require("./src/urls");

const NATIONAL_LIST =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTvSFFG0ByJlzWLBVZ_-sYdhGLvMCCrbb_Fe9sA9LZ_Y_BFoq1BVEFGLf4t--pJ8gg73o0ULvqYlqdk/pub?gid=1451634215&single=true&output=csv";

const chunkForAirtable = chunk(10);

const removeSearchFromUrls = map(normaliseUrl);

(async () => {
  const groupsFromAirtable = await getGroupsFromAirtable();

  const response = await fetch(NATIONAL_LIST);
  const contents = await response.text();

  const parsedCsv = await neatCsv(contents);

  const groupsFromCsv = parsedCsv.map(line => {
    return {
      name: line["Group name"],
      location: line.Location,
      url: normaliseUrl(
        line["Facebook group/website (Link/URL) Please only provide one link"]
      )
    };
  });
  const notFoundInGroupsList = [];

  groupsFromAirtable.forEach(groupFromAirtable => {
    if (!groupsFromCsv.find(group => group.url === groupFromAirtable.url)) {
      notFoundInGroupsList.push(groupFromAirtable);
    }
  });

  console.log(
    `${notFoundInGroupsList.length} groups not found in national groups list found in Airtable list`
  );

  const notFoundInAirtableList = [];

  groupsFromCsv.forEach(groupFromCsv => {
    if (!groupsFromAirtable.find(group => group.url === groupFromCsv.url)) {
      notFoundInAirtableList.push(groupFromCsv);
    }
  });

  console.log(`${groupsFromCsv.length} found in national group list`);
  console.log(`${groupsFromAirtable.length} in Airtable`);
  console.log(
    `${notFoundInAirtableList.length} groups not found in Airtable list but in national groups list`
  );

  const asAirtableArray = notFoundInAirtableList.map(group => ({
    fields: {
      Name: group.name.trim(),
      Location: group.location,
      "Facebook Group": group.url,
      "Included in Covid-19 Mutual Aid - UK": true
    }
  }));

  const chunkedForAirtable = chunkForAirtable(asAirtableArray);

  chunkedForAirtable.forEach(async chunk => {
    const results = await base("COVID-19 UK Mutual Aid Groups").create(chunk);
    console.log(`Wrote ${results.length} records to Airtable`);
  });
})();
