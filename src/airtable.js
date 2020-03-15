const base = require("airtable").base("appo0BT91w2rrr856");

const { normaliseUrl } = require("./urls");

async function getGroupsFromAirtable() {
  const groupsFromAirtable = [];
  await base("COVID-19 UK Mutual Aid Groups")
    .select({
      view: "All Groups"
    })
    .eachPage((records, fetchNextPage) => {
      records.forEach(record => {
        groupsFromAirtable.push({
          id: record.id,
          name: record.get("Name"),
          location: record.get("Location"),
          url: normaliseUrl(record.get("Facebook Group"))
        });
      });
      fetchNextPage();
    });

  return groupsFromAirtable;
}

module.exports = {
  base,
  getGroupsFromAirtable
};
