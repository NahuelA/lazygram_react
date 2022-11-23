import React, { useContext, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const PrivateRoute = () => {
  const { retrieveAccessToken, accessToken } = useContext(AuthContext);

  useEffect(() => {
    retrieveAccessToken();
    console.log("Effect", accessToken);
  }, [accessToken]);

  return accessToken ? <Outlet /> : <Navigate to={"/login"} />;
};
export { PrivateRoute };
