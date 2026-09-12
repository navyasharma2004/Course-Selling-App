import { createContext, useContext, useState } from "react";

// We support two separate sessions — a "user" session and an "admin" session —
// because the backend issues separate JWTs (JWT_USER_SECRET vs JWT_ADMIN_SECRET)
// and checks them with separate middleware. Both can technically be logged in
// at once, in two different tabs, but the UI only shows one role at a time
// based on which token is active.

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken"));

  function loginUser(token) {
    localStorage.setItem("userToken", token);
    setUserToken(token);
  }

  function loginAdmin(token) {
    localStorage.setItem("adminToken", token);
    setAdminToken(token);
  }

  function logoutUser() {
    localStorage.removeItem("userToken");
    setUserToken(null);
  }

  function logoutAdmin() {
    localStorage.removeItem("adminToken");
    setAdminToken(null);
  }

  return (
    <AuthContext.Provider
      value={{ userToken, adminToken, loginUser, loginAdmin, logoutUser, logoutAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
