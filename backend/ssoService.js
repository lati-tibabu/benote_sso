const jwt = require("jsonwebtoken");

/**
 * SSOService provides methods to generate secure SSO tokens 
 * for external integrations (OpenERP/Odoo, etc.)
 */
class SSOService {
  /**
   * Generates a signed JWT for external system SSO
   * @param {Object} user - The user object containing id, email, name, role
   * @param {Array} accessControls - Array of access control objects or names
   * @param {string} audience - The target system identifier (e.g., 'odoo')
   * @param {string} secret - Secret key for signing the token
   * @param {string} issuer - Issuer identifier (default: 'benote-auth')
   * @returns {string} Signed JWT token
   */
  generateToken(user, accessControls = [], audience, secret, issuer = "benote-auth") {
    const accessRights = Array.isArray(accessControls) 
      ? accessControls.map((ac) => (typeof ac === 'string' ? ac : ac.name))
      : [];

    return jwt.sign(
      {
        sub: user.id || user.sub,
        email: user.email,
        name: user.name,
        roles: user.role,
        access_rights: accessRights,
        iss: issuer,
        aud: audience,
      },
      secret,
      { expiresIn: "24h" }
    );
  }
}

module.exports = new SSOService();
