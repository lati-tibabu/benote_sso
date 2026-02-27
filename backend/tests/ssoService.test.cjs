const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const ssoService = require("../ssoService");

test("generateToken creates a verifiable token with expected claims", () => {
  delete process.env.SSO_TOKEN_TTL_SECONDS;

  const token = ssoService.generateToken(
    { id: 42, email: "user@example.com", name: "User", role: "member" },
    ["read", { name: "write" }],
    "external-platform",
    "secret",
    "benote-auth"
  );

  const payload = jwt.verify(token, "secret", {
    audience: "external-platform",
    issuer: "benote-auth",
    algorithms: ["HS256"],
  });

  assert.equal(payload.sub, "42");
  assert.equal(payload.email, "user@example.com");
  assert.deepEqual(payload.access_rights, ["read", "write"]);
  assert.ok(payload.jti);
});

test("generateToken throws on invalid required inputs", () => {
  assert.throws(() => ssoService.generateToken(null, [], "aud", "secret"), /Valid user object/);
  assert.throws(
    () => ssoService.generateToken({ id: 1 }, [], "", "secret"),
    /SSO audience is required/
  );
  assert.throws(
    () => ssoService.generateToken({ id: 1 }, [], "aud", ""),
    /SSO signing secret is required/
  );
  assert.throws(
    () => ssoService.generateToken({ email: "x@y.com" }, [], "aud", "secret"),
    /User id\/sub is required/
  );
});

test("generateToken uses env/default TTL and allows overrides", () => {
  process.env.SSO_TOKEN_TTL_SECONDS = "120";

  const envToken = ssoService.generateToken({ id: 1 }, [], "aud", "secret");
  const envPayload = jwt.decode(envToken);
  assert.ok(envPayload.exp - envPayload.iat <= 120);
  assert.ok(envPayload.exp - envPayload.iat > 0);

  const customToken = ssoService.generateToken({ id: 1 }, [], "aud", "secret", "benote-auth", {
    expiresIn: 30,
  });
  const customPayload = jwt.decode(customToken);
  assert.ok(customPayload.exp - customPayload.iat <= 30);
  assert.ok(customPayload.exp - customPayload.iat > 0);

  delete process.env.SSO_TOKEN_TTL_SECONDS;
});
