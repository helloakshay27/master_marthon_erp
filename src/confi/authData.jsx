import React, { useEffect, useState } from "react";

function AuthData() {
  const [authData, setAuthData] = useState({ token: null, role: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAuthData = async () => {
    try {
      setLoading(true);

      // Check if role exists in sessionStorage to avoid unnecessary API call
      const storedRole = sessionStorage.getItem("role");
      console.log(storedRole);
      if (storedRole) {
        setAuthData({ role: storedRole });
        setLoading(false);
        return;
      }

      // Fetch from the API
      const response = await fetch(
        "https://vendors.lockated.com/rfq/users/user_role?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078411"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch authentication data");
      }

      const data = await response.json();
      const { role } = data;

      // Store in sessionStorage
      sessionStorage.setItem("role", role);

      // Update state
      setAuthData({ role });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthData();
  }, []);

  return (
    <div>
      <h1>Authentication Data</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        authData.role && (
          <>
            {/* Uncomment the following line to display the token */}
            {/* <p>Token: {authData.token}</p> */}
            <p>Role: {authData.role}</p>
          </>
        )
      )}
    </div>
  );
}

export default AuthData;
