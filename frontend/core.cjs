function validateUrl(value, label) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch (error) {
    throw new Error(label + " must be a valid URL");
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(label + " must use http or https");
  }

  return parsed;
}

async function triggerSSO(apiEndpoint, targetBaseUrl, authToken, options) {
  const opts = options || {};
  if (!authToken || typeof authToken !== "string") {
    throw new Error("authToken is required");
  }
  if (typeof fetch !== "function") {
    throw new Error("global fetch is required");
  }
  if (typeof document === "undefined" || !document.createElement) {
    throw new Error("document is required in the current runtime");
  }

  const parsedApiEndpoint = validateUrl(apiEndpoint, "apiEndpoint");
  const parsedTargetBaseUrl = validateUrl(targetBaseUrl, "targetBaseUrl");
  const timeoutMs = Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : 10000;
  const allowedOrigins = Array.isArray(opts.allowedTargetOrigins) ? opts.allowedTargetOrigins : [];

  if (allowedOrigins.length > 0 && !allowedOrigins.includes(parsedTargetBaseUrl.origin)) {
    throw new Error("targetBaseUrl origin is not allowed");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(function () {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(parsedApiEndpoint.toString(), {
      method: "POST",
      headers: { Authorization: "Bearer " + authToken },
      signal: controller.signal,
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Failed to fetch SSO token");
    }

    const body = await response.json();
    const token = body && body.token;
    if (!token || typeof token !== "string") {
      throw new Error("Backend response did not include a valid token");
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = new URL("/auth/sso/callback", parsedTargetBaseUrl).toString();
    form.style.display = "none";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "access_token";
    input.value = token;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    setTimeout(function () {
      form.remove();
    }, 0);
  } catch (error) {
    console.error("SSO Redirection Error:", error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function createSSOClient(defaults) {
  const config = defaults || {};
  return {
    triggerSSO: function (apiEndpoint, targetBaseUrl, authToken, options) {
      return triggerSSO(
        apiEndpoint || config.apiEndpoint,
        targetBaseUrl || config.targetBaseUrl,
        authToken || config.authToken,
        Object.assign({}, config.options || {}, options || {})
      );
    },
  };
}

function useSSO() {
  return { triggerSSO: triggerSSO };
}

module.exports = {
  triggerSSO,
  createSSOClient,
  useSSO,
};
