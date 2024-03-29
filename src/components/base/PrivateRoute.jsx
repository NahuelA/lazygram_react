import React, { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const PrivateRoute = () => {
  const { retrieveAccessToken, accessToken } = useContext(AuthContext);

  useEffect(() => {
    retrieveAccessToken();
  }, [accessToken]);

  return accessToken ? <Outlet /> : <Navigate to={"/login"} />;
};
export { PrivateRoute };
