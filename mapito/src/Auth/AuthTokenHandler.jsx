import React, { useEffect, useState } from "react";

const AuthTokenHandler = ({ children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      params.delete("token");
      const newUrl =
        window.location.pathname + (params.toString() ? "?" + params.toString() : "");
      window.history.replaceState({}, "", newUrl);
    }
    setReady(true);
  }, []);

  if (!ready) return null; 

  return children;
};

export default AuthTokenHandler;