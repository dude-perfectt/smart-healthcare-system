import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { setNavigate } from "../services/navigateUtil";
import { getDoctorByEmail, getPatientByEmail } from "../services/service";

// Helper function to safely get item from localStorage
const safeGetItem = (key: string): string | null => {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === "undefined" || item === "null") {
      return null;
    }
    return item;
  } catch (e) {
    return null;
  }
};

// Helper function to safely parse JSON
const safeJsonParse = (value: string | null): any => {
  if (!value || value === "undefined" || value === "null") {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};

const AuthProvider = ({ children }: any) => {
  // State to manage user, auth details, token, and user role from local storage.
  const [user, setUser] = useState(safeGetItem("user"));
  const [auth, setAuth] = useState<any>(safeGetItem("auth"));
  const [token, setToken] = useState(safeGetItem("jwt"));
  const [userRole, setUserRole] = useState(safeGetItem("userRole"));
  const navigate = useNavigate();

  // Fetch user details if token and auth exist or token changes.
  // Role is read from localStorage (not state) because setState is async
  // and userRole state may not be updated yet when this effect fires.
  useEffect(() => {
    if (token && auth) {
      const parsedAuth = typeof auth === "string" ? safeJsonParse(auth) : auth;
      const role = safeGetItem("userRole"); // read from localStorage, not state
      if (parsedAuth?.email && role) {
        fetchUser(parsedAuth.email, role);
      }
    }
  }, [token]);

  // Set global navigation utility whenever navigate changes.
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  // Fetch user details based on role and save it to state and local storage for further use.
  // Role is passed as a parameter to avoid stale closure issue with userRole state.
  const fetchUser = async (email: string, role: string) => {
    try {
      if (role === "ROLE_DOCTOR") {
        const res = await getDoctorByEmail(email);
        setUser(res?.data?.data);
        localStorage.setItem("user", JSON.stringify(res?.data?.data));
        navigate("/");
      } else if (role === "ROLE_PATIENT") {
        const res = await getPatientByEmail(email);
        setUser(res?.data?.data);
        localStorage.setItem("user", JSON.stringify(res?.data?.data));
        navigate("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Login function to set user session states, store in localStorage and navigate to home screen.
  // localStorage is set BEFORE setState so that when setToken triggers the useEffect,
  // the role is already available in localStorage for fetchUser to read.
  const login = (res: any) => {
    localStorage.setItem("jwt", res.token);           // set FIRST
    localStorage.setItem("auth", JSON.stringify(res));
    localStorage.setItem("userRole", res.roles[0]);
    setUserRole(res.roles[0]);
    setAuth(res);
    setToken(res.token); // triggers useEffect which calls fetchUser once
    if (res.roles[0] === "ROLE_ADMIN") navigate("/");
    // fetchUser is NOT called here — useEffect handles it to avoid double calls
  };

  // Logout function to update states and delete details stored in localStorage
  const logout = () => {
    setToken(null);
    setUser(null);
    setUserRole(null);
    localStorage.removeItem("jwt");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user: typeof user === "string" ? safeJsonParse(user) : user,
        token,
        currentRole: userRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;