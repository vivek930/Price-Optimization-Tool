import axios from "axios";

// Set the base URL for API requests - MUST match exactly with CORS origins
const API_BASE = process.env.REACT_APP_API || "http://localhost:8000";

// Create an Axios instance with a default configuration
export const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Essential for cookies
  timeout: 10000, // 10 second timeout for all requests
});

// Token management utilities - now primarily for user info storage
const clearAuthData = () => {
  localStorage.removeItem("role");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_name");
};

// Store user info (not tokens) in localStorage for easy access
const setUserInfo = (userInfo) => {
  localStorage.setItem("role", userInfo.role);
  localStorage.setItem("user_id", userInfo.user_id.toString());
  localStorage.setItem("user_name", userInfo.user_name);
};

// Check if user is likely authenticated (has user info stored)
const hasUserInfo = () => {
  return localStorage.getItem("role") && localStorage.getItem("user_id");
};

// Request interceptor: Debug cookies being sent
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// State for handling token refresh
let isRefreshing = false;
let failedRefreshCount = 0;
let refreshQueue = [];

const MAX_REFRESH_RETRIES = 2;
const REFRESH_TIMEOUT = 5000;

// Process queued requests after refresh finishes
function processRefreshQueue(error, success = false) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(success);
    }
  });
  refreshQueue = [];
}

// Clean logout - clear data and redirect
function performLogout(reason = "Authentication failed") {
  clearAuthData();

  // Only redirect if not already on login page
  if (window.location.pathname !== "/") {
    window.location.replace("/");
  }
}

// Response interceptor: handles responses and errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Check for Set-Cookie headers (though they won't be visible to JS)
    if (response.headers["set-cookie"]) {
      console.log(`Set-Cookie headers found:`, response.headers["set-cookie"]);
    } else {
      console.log(
        `No Set-Cookie headers visible (expected for HTTP-only cookies)`
      );
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If no user info stored, logout immediately
      if (!hasUserInfo()) {
        performLogout("No authentication information");
        return Promise.reject(error);
      }

      // If already exceeded max retries, logout
      if (failedRefreshCount >= MAX_REFRESH_RETRIES) {
        performLogout(`Max refresh retries (${MAX_REFRESH_RETRIES}) exceeded`);
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (success) => {
              if (success) {
                resolve(axiosInstance(originalRequest));
              } else {
                reject(error);
              }
            },
            reject: (err) => reject(err),
          });
        });
      }

      // Mark request as retried and start refresh process
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint - cookies are sent automatically
        const refreshResponse = await axios.post(
          `${API_BASE}/auth/refresh`,
          {}, // Empty body since refresh token is in cookie
          {
            timeout: REFRESH_TIMEOUT,
            withCredentials: true, // Include cookies
            headers: { "Content-Type": "application/json" },
          }
        );

        // Update user info if provided in response
        if (refreshResponse.data) {
          setUserInfo(refreshResponse.data);
        }

        // Reset failure count on successful refresh
        failedRefreshCount = 0;
        isRefreshing = false;

        // Process all queued requests
        processRefreshQueue(null, true);

        // Retry the original request (new tokens are now in cookies)
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        failedRefreshCount++;

        // Process queue with error
        processRefreshQueue(refreshError);

        // If refresh failed due to 401/403, logout immediately
        if (
          refreshError.response?.status === 401 ||
          refreshError.response?.status === 403
        ) {
          performLogout("Refresh token invalid or expired");
          return Promise.reject(refreshError);
        }

        // If exceeded max retries, logout
        if (failedRefreshCount >= MAX_REFRESH_RETRIES) {
          performLogout(`Refresh failed ${failedRefreshCount} times`);
          return Promise.reject(refreshError);
        }

        // Otherwise, reject with original error
        return Promise.reject(error);
      }
    }

    // For non-401 errors, just pass them through
    return Promise.reject(error);
  }
);

// Export utility functions for components to use
export { clearAuthData, setUserInfo, hasUserInfo };
