const normalizeUrlLibrary = require("normalize-url");

const cleanUrl = url =>
  normalizeUrlLibrary(url, {
    forceHttps: true,
    stripHash: true,
    stripWWW: false,
    removeQueryParameters: [/(.*?)/],
    removeTrailingSlash: true
  });

const normaliseUrl = href => {
  return toWWWFacebook(toFacebookDesktop(cleanUrl));
};

const toFacebookDesktop = href =>
  href.replace("https://m.facebook.com/", "https://www.facebook.com/");

const toWWWFacebook = href =>
  href.replace("https://facebook.com/", "https://www.facebook.com/");

module.exports = {
  cleanUrl,
  normaliseUrl,
  toFacebookDesktop,
  toWWWFacebook
};
