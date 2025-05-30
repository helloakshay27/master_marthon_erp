// Define the baseURL directly in the code
const baseURL = "https://marathon.lockated.com/";

// Retrieve the token dynamically from session storage
let token = ""; // Default to an empty string
if (typeof window !== "undefined" && sessionStorage.getItem("token")) {
  token = sessionStorage.getItem("token");
}

// Retrieve the role dynamically from session storage
let role = ""; // Default to an empty string
if (typeof window !== "undefined" && sessionStorage.getItem("role")) {
  role = sessionStorage.getItem("role");
}
const baseURL1 = "https://marathon.lockated.com/";

// Export the baseURL, token, and role
export { baseURL,baseURL1, token, role };
