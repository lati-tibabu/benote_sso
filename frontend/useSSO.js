/**
 * Hook to handle the OpenERP/Odoo SSO flow.
 * It fetches a token from the Benote backend and POSTs it to the target system.
 */
export const useSSO = () => {
    /**
     * Triggers the SSO redirect via a hidden form POST
     * @param {string} apiEndpoint - The Benote backend URL to get the token (e.g., /api/auth/sso/odoo)
     * @param {string} targetBaseUrl - The base URL of the target system (e.g., Odoo URL)
     * @param {string} authToken - The current Benote session token
     */
    const triggerSSO = async (apiEndpoint, targetBaseUrl, authToken) => {
        try {
            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
            });

            if (!response.ok) throw new Error("Failed to fetch SSO token");

            const { token } = await response.json();

            // Create a hidden form to perform a POST binding SSO
            const form = document.createElement("form");
            form.method = "POST";
            form.action = `${targetBaseUrl}/auth/sso/callback`;

            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "access_token"; // Standard parameter name expected by receiver
            input.value = token;
            
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            console.error("SSO Redirection Error:", error);
            throw error;
        }
    };

    return { triggerSSO };
};
