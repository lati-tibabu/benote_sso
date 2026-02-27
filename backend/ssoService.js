const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");

/**
 * SSOService provides methods to generate secure SSO tokens 
 * for external platform integrations.
 */
class SSOService {
  /**
   * Generates a signed JWT for external system SSO
   * @param {Object} user - The user object containing id, email, name, role
   * @param {Array} accessControls - Array of access control objects or names
   * @param {string} audience - The target system identifier
   * @param {string} secret - Secret key for signing the token
   * @param {string} issuer - Issuer identifier (default: 'benote-auth')
   * @returns {string} Signed JWT token
   */
  generateToken(
    user,
    accessControls = [],
    audience,
    secret,
    issuer = "benote-auth",
    options = {}
  ) {
    if (!secret || typeof secret !== "string") {
      throw new Error("SSO signing secret is required");
    }
    if (!audience || typeof audience !== "string") {
      throw new Error("SSO audience is required");
    }
    if (!user || typeof user !== "object") {
      throw new Error("Valid user object is required");
    }

    const subject = user?.id || user?.sub;
    if (!subject) {
      throw new Error("User id/sub is required to generate an SSO token");
    }

    const accessRights = Array.isArray(accessControls)
      ? accessControls
          .map((ac) => (typeof ac === "string" ? ac : ac?.name))
          .filter(Boolean)
      : [];

    const roles = Array.isArray(user?.roles) ? user.roles : user?.role;
    const envTtl = Number(process.env.SSO_TOKEN_TTL_SECONDS);
    const expiresIn =
      options.expiresIn || (Number.isFinite(envTtl) && envTtl > 0 ? envTtl : 300);

    return jwt.sign(
      {
        email: user?.email,
        name: user?.name,
        roles,
        access_rights: accessRights,
      },
      secret,
      {
        algorithm: "HS256",
        issuer,
        audience,
        subject: String(subject),
        jwtid: randomUUID(),
        expiresIn,
      }
    );
  }
}

module.exports = new SSOService();
