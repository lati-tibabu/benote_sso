import ssoService from "./index.cjs";

export const generateToken = (...args) => ssoService.generateToken(...args);
export default ssoService;
