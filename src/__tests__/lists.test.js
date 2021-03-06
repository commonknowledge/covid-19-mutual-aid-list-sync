const { findMissingGroups } = require("../lists");

describe("findMissingGroups()", () => {
  test("lists when equal have no missing groups", () => {
    const firstGroupList = [
      {
        name: "Group A",
        location: "Town A",
        url: "https://www.facebook.com/groups/1369318873253390"
      }
    ];

    const secondGroupList = [
      {
        name: "Group A",
        location: "Town A",
        url: "https://www.facebook.com/groups/1369318873253390"
      }
    ];

    expect(findMissingGroups(firstGroupList, secondGroupList)).toEqual([]);
  });

  test("only URLS count as difference", () => {
    const firstGroupList = [
      {
        name: "Group A",
        location: "Town A",
        url: "https://www.facebook.com/groups/1369318873253390"
      }
    ];

    const secondGroupList = [
      {
        name: "Group A but different name",
        location: "Town A",
        url: "https://www.facebook.com/groups/1369318873253390"
      },
      {
        name: "Group A",
        location: "Town A but described differently",
        url: "https://www.facebook.com/groups/1369318873253390"
      }
    ];

    expect(findMissingGroups(firstGroupList, secondGroupList)).toEqual([]);
  });

  test("groups from first group list not in second list are found", () => {
    const groupA = {
      name: "Group A",
      location: "Town A",
      url: "https://www.facebook.com/groups/0000"
    };
    const groupB = {
      name: "Group B",
      location: "Town B",
      url: "https://www.facebook.com/groups/0001"
    };
    const groupC = {
      name: "Group C",
      location: "Town C",
      url: "https://www.facebook.com/groups/0002"
    };

    const firstGroupList = [groupA, groupB, groupC];

    const secondGroupList = [groupA, groupC];

    const missingFromSecondList = findMissingGroups(
      firstGroupList,
      secondGroupList
    );
    expect(missingFromSecondList).toEqual([groupB]);
  });

  test("groups from second list missing in first are ignored", () => {
    const groupA = {
      name: "Group A",
      location: "Town A",
      url: "https://www.facebook.com/groups/0000"
    };
    const groupB = {
      name: "Group B",
      location: "Town B",
      url: "https://www.facebook.com/groups/0001"
    };

    const firstGroupList = [groupA];

    const secondGroupList = [groupA, groupB];

    const missingFromSecondList = findMissingGroups(
      firstGroupList,
      secondGroupList
    );
    expect(missingFromSecondList).toEqual([]);
  });
});
