import { createContext, useState, useEffect } from "react";
import { lgApi } from "../__modules__";
import { addCache } from "../utils/users/cache";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import axios from "axios";

const AuthContext = createContext();

export default AuthContext;

const AuthProvider = ({ children }) => {
  // Refresh token
  let [refreshToken, setRefreshToken] = useState("");

  // Access token
  const [accessToken, setAccessToken] = useState(false);

  const location = useLocation();

  // Edit or follow btn
  const [editOrFollowBtn, setEditOrFollowBtn] = useState("Edit profile");
  // Edit or follow htmlClass
  const [editOrFollowClass, setEditOrFollowClass] = useState(
    "ml-5 btn btn-sm btn-outline-info"
  );

  // Follow or Unfollow btn
  const [followOrUnfollow, setFollowOrUnfollow] = useState("Follow");
  // Follow or Unfollow htmlClass
  const [followClass, setFollowClass] = useState("ml-5 btn btn-primary");
  const cancelToken = axios.CancelToken.source();

  /**
   * Retrieve active token that stored in cache storage
   */
  const retrieveAccessToken = async () => {
    await caches.open("access_token").then(async (cache) => {
      await cache
        .match("/access_token")
        .then(async (token) => {
          if (token !== undefined) {
            await token.json().then((accessToken) => {
              setAccessToken(accessToken);
            });
          } else {
            return false;
          }
        })
        .catch((err) => {
          console.log("Access token not found", err);
        });
    });
  };

  /**
   * Is access token is expired, retrieve refresh token
   */
  const updateToken = async () => {
    // Refreshing tokens: access and refresh in 5 minute (300000 ms) invervals
    const interval = setInterval(async () => {
      await caches.open("refresh_token").then(async (cache) => {
        try {
          await cache.match("/refresh_token").then(async (token) => {
            token.json().then(async (refresh) => {
              setRefreshToken(refresh);

              // Refresh token
              await lgApi("accounts/refresh-token/", {
                method: "post",
                data: { refresh: refresh },
              })
                .then(({ data }) => {
                  // Add refresh and access tokens in cache
                  addCache(
                    "refresh_token",
                    "http://localhost:3000/refresh_token",
                    data.refresh
                  );
                  addCache(
                    "access_token",
                    "http://localhost:3000/access_token",
                    data.access
                  );
                })
                .catch((err) => {
                  console.error("Error to refresh token", err.response.data);
                });
            });
          });
        } catch (err) {
          console.error(err);
        }
      });
    }, 300000);

    return interval;
  };

  // Refreshing token effect
  useEffect(() => {
    const interval = updateToken();

    return async () => {
      cancelToken.cancel();
      clearInterval(interval);
    };
  }, []);

  // Data provided
  let contextData = {
    // Expired access token function
    updateToken,
    // Retrieve access token
    retrieveAccessToken,
    // Access token
    accessToken,
    // Set refresh token
    setRefreshToken,
    // Edit or follow btn state
    editOrFollowBtn,
    setEditOrFollowBtn,
    // Edit or follow class state
    editOrFollowClass,
    setEditOrFollowClass,
    // Follow or unfollow btn state
    followOrUnfollow,
    setFollowOrUnfollow,
    // Follow or unfollow class state
    followClass,
    setFollowClass,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export { AuthProvider };
