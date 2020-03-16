const {
  toFacebookDesktop,
  normaliseUrl,
  toWWWFacebook,
  cleanUrl
} = require("../urls");

describe("normaliseUrl()", () => {
  test("works", () => {
    expect(normaliseUrl("www.example.com/#blah?hello=world")).toEqual(
      "https://www.example.com"
    );
  });
});

describe("cleanUrl()", () => {
  test("adds protocol", () => {
    expect(cleanUrl("example.com")).toEqual("https://example.com");
  });

  test("forces HTTPS", () => {
    expect(cleanUrl("http://example.com")).toEqual("https://example.com");
  });

  test("strips hash", () => {
    expect(cleanUrl("https://example.com#something")).toEqual(
      "https://example.com"
    );
  });

  test("keeps WWW", () => {
    expect(cleanUrl("https://www.example.com")).toEqual(
      "https://www.example.com"
    );
  });

  test("removes all query parameters", () => {
    expect(
      cleanUrl(
        "https://m.facebook.com/groups/493435171331301?ref=m_notif&notif_t=feedback_reaction_generic"
      )
    ).toEqual("https://m.facebook.com/groups/493435171331301");
  });

  test("removes trailing slash", () => {
    expect(cleanUrl("https://www.facebook.com/groups/citymutualaid/")).toEqual(
      "https://www.facebook.com/groups/citymutualaid"
    );
  });
});

describe("toFacebookDesktop()", () => {
  test("changes mobile to desktop Facebook URL", () => {
    const testUrl = "https://m.facebook.com/groups/493435171331301";

    expect(toFacebookDesktop(testUrl)).toEqual(
      "https://www.facebook.com/groups/493435171331301"
    );
  });

  test("leaves desktop Facebook URL unchanged", () => {
    const facebookUrl = "https://www.facebook.com/groups/1369318873253390/";

    expect(toFacebookDesktop(facebookUrl)).toEqual(facebookUrl);
  });

  test("leaves non-Facebook URL unchanged", () => {
    const otherUrl = "https://www.example.com";

    expect(toFacebookDesktop(otherUrl)).toEqual(otherUrl);
  });
});

describe("toWWWFacebook", () => {
  test("adds www to non-www Facebook URL", () => {
    const facebookUrl =
      "https://facebook.com/groups/235679997602200/?ref=share";

    expect(toWWWFacebook(facebookUrl)).toEqual(
      "https://www.facebook.com/groups/235679997602200/?ref=share"
    );
  });

  test("keeps www Facebook URL as is", () => {
    const facebookUrl =
      "https://www.facebook.com/groups/235679997602200/?ref=share";

    expect(toWWWFacebook(facebookUrl)).toEqual(
      "https://www.facebook.com/groups/235679997602200/?ref=share"
    );
  });

  test("keeps non-Facebook URL as is", () => {
    const otherUrl = "https://www.example.com";

    expect(toWWWFacebook(otherUrl)).toEqual(otherUrl);
  });
});
