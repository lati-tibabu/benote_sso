/**
 * Hook to handle the Benote SSO flow.
 * It fetches a token from the Benote backend and POSTs it to the target system.
 */
export const useSSO = () => {
    const validateUrl = (value, label) => {
        let parsed;
        try {
            parsed = new URL(value);
        } catch (error) {
            throw new Error(`${label} must be a valid URL`);
        }

        if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
            throw new Error(`${label} must use http or https`);
        }

        return parsed;
    };

    /**
     * Triggers the SSO redirect via a hidden form POST
     * @param {string} apiEndpoint - The Benote backend URL to get the token
     * @param {string} targetBaseUrl - The base URL of the target system
     * @param {string} authToken - The current Benote session token
     */
    const triggerSSO = async (apiEndpoint, targetBaseUrl, authToken, options = {}) => {
        if (!authToken || typeof authToken !== "string") {
            throw new Error("authToken is required");
        }

        const parsedApiEndpoint = validateUrl(apiEndpoint, "apiEndpoint");
        const parsedTargetBaseUrl = validateUrl(targetBaseUrl, "targetBaseUrl");
        const timeoutMs = Number.isFinite(options.timeoutMs) ? options.timeoutMs : 10000;
        const allowedOrigins = Array.isArray(options.allowedTargetOrigins)
            ? options.allowedTargetOrigins
            : [];

        if (allowedOrigins.length > 0 && !allowedOrigins.includes(parsedTargetBaseUrl.origin)) {
            throw new Error("targetBaseUrl origin is not allowed");
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await fetch(parsedApiEndpoint.toString(), {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${authToken}`
                },
                signal: controller.signal,
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Failed to fetch SSO token");
            }

            const { token } = await response.json();
            if (!token || typeof token !== "string") {
                throw new Error("Backend response did not include a valid token");
            }

            // Create a hidden form to perform a POST binding SSO
            const form = document.createElement("form");
            form.method = "POST";
            form.action = new URL("/auth/sso/callback", parsedTargetBaseUrl).toString();
            form.style.display = "none";

            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "access_token"; // Standard parameter name expected by receiver
            input.value = token;
            
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
            setTimeout(() => {
                form.remove();
            }, 0);
        } catch (error) {
            console.error("SSO Redirection Error:", error);
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    };

    return { triggerSSO };
};
