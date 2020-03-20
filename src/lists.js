const { differenceBy } = require("lodash");

const differenceByUrl = (firstGroupList, secondGroupList) =>
  differenceBy(firstGroupList, secondGroupList, "url");

const findMissingGroups = (firstGroupList, secondGroupList) =>
  differenceByUrl(firstGroupList, secondGroupList);

module.exports = {
  findMissingGroups
};
