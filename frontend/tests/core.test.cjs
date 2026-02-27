const test = require("node:test");
const assert = require("node:assert/strict");
const { triggerSSO, createSSOClient } = require("../core.cjs");

function setupDom() {
  const appended = [];
  const doc = {
    body: {
      appendChild: (el) => {
        appended.push(el);
      },
    },
    createElement: (tag) => {
      const element = {
        tagName: tag.toUpperCase(),
        style: {},
        children: [],
        appendChild(child) {
          this.children.push(child);
        },
        remove() {},
      };
      if (tag === "form") {
        element.submitCalled = false;
        element.submit = function () {
          this.submitCalled = true;
        };
      }
      return element;
    },
  };
  return { doc, appended };
}

test("triggerSSO posts token using hidden form", async () => {
  const originalFetch = global.fetch;
  const originalDocument = global.document;

  const { doc, appended } = setupDom();
  global.document = doc;
  global.fetch = async () => ({
    ok: true,
    json: async () => ({ token: "jwt-token" }),
  });

  try {
    await triggerSSO("https://api.example.com/sso", "https://target.example.com", "auth-token");

    assert.equal(appended.length, 1);
    const form = appended[0];
    assert.equal(form.method, "POST");
    assert.equal(form.action, "https://target.example.com/auth/sso/callback");
    assert.equal(form.submitCalled, true);
    assert.equal(form.children[0].name, "access_token");
    assert.equal(form.children[0].value, "jwt-token");
  } finally {
    global.fetch = originalFetch;
    global.document = originalDocument;
  }
});

test("triggerSSO validates auth token and target origin", async () => {
  const originalFetch = global.fetch;
  const originalDocument = global.document;
  const { doc } = setupDom();
  global.document = doc;
  global.fetch = async () => ({ ok: true, json: async () => ({ token: "x" }) });

  try {
    await assert.rejects(
      () => triggerSSO("https://api.example.com/sso", "https://target.example.com", ""),
      /authToken is required/
    );
    await assert.rejects(
      () =>
        triggerSSO("https://api.example.com/sso", "https://target.example.com", "auth", {
          allowedTargetOrigins: ["https://another.example.com"],
        }),
      /origin is not allowed/
    );
  } finally {
    global.fetch = originalFetch;
    global.document = originalDocument;
  }
});

test("createSSOClient applies defaults", async () => {
  const originalFetch = global.fetch;
  const originalDocument = global.document;

  const { doc, appended } = setupDom();
  global.document = doc;
  global.fetch = async () => ({
    ok: true,
    json: async () => ({ token: "jwt-token" }),
  });

  try {
    const client = createSSOClient({
      apiEndpoint: "https://api.example.com/sso",
      targetBaseUrl: "https://target.example.com",
      authToken: "auth-token",
    });

    await client.triggerSSO();
    assert.equal(appended.length, 1);
    assert.equal(appended[0].submitCalled, true);
  } finally {
    global.fetch = originalFetch;
    global.document = originalDocument;
  }
});
