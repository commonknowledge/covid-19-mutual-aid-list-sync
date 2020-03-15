const normalizeUrlLibrary = require("normalize-url");

const normaliseUrl = href => {
  return toWWWFacebook(
    toFacebookDesktop(
      normalizeUrlLibrary(href, {
        forceHttps: true,
        stripHash: true,
        stripWWW: false,
        removeQueryParameters: [/(.*?)/],
        removeTrailingSlash: true
      })
    )
  );
};

const toFacebookDesktop = href =>
  href.replace("https://m.facebook.com/", "https://www.facebook.com/");

const toWWWFacebook = href =>
  href.replace("https://facebook.com/", "https://www.facebook.com/");

module.exports = {
  normaliseUrl,
  toFacebookDesktop,
  toWWWFacebook
};
