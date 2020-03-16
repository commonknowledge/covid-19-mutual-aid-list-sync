const { chunkForAirtable } = require("../airtable");

describe("chunkForAirtable()", () => {
  test("splits into groups of 10", () => {
    const groupsForAirtable = new Array(25).fill({
      fields: {
        Name: "Group Name",
        Location: "Group Location",
        "Facebook Group": "https://example.com",
        "Included in Covid-19 Mutual Aid - UK": true
      }
    });

    const [firstChunk, secondChunk, thirdChunk] = chunkForAirtable(
      groupsForAirtable
    );

    expect(firstChunk).toHaveLength(10);
    expect(secondChunk).toHaveLength(10);
    expect(thirdChunk).toHaveLength(5);
  });
});
