const { differenceBy } = require("lodash/fp");

const differenceByUrl = differenceBy("url");

const findMissingGroups = (firstGroupList, secondGroupList) =>
  differenceByUrl(firstGroupList, secondGroupList);

module.exports = {
  findMissingGroups
};
