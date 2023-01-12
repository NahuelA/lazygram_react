import "../../css/Main.css";
import React, { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { lgApi } from "../../__modules__";

import {
  BsHouse,
  BsBoxArrowRight,
  BsPersonCircle,
  BsChatLeft,
  BsInstagram,
  BsSearch,
  BsPlusCircle,
  BsFillWalletFill,
} from "react-icons/bs";
import { Link } from "react-router-dom";

function HeadMenu() {
  // Set all profiles that do match.
  const [profiles, setProfiles] = useState([]);

  // If does not match any profile, update this state, else return empty string.
  const [notProfile, setNotProfile] = useState("");
  const { accessToken, setAccessToken } = useContext(AuthContext);
  const httpMedia = "http://localhost:8000/media/";
  let profilePicture; // Profile with a null profile picture: set an empty profile picture by default.
  let profileDoesNotMatch = (
    <p className="border border-2 p-2 fs-6 text-secondary">{notProfile}</p>
  );

  return (
    <div className="container-header">
      <header className="header rounded-pill">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <div className="container-logo-link grid">
              <BsInstagram className="icon-gral" />
              <h1 className="fs-title">Lazygram</h1>
            </div>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                {/* Search */}
                <li className="nav-item">
                  <span className="nav-link container-icons-link">
                    <BsSearch className="icon-gral" />
                  </span>
                </li>

                {/* Input search */}
                <li className="nav-item">
                  <div className="grid-search position-relative">
                    <input
                      className="form-control font"
                      id="search-input"
                      placeholder="Search profile"
                      autoComplete="off"
                      onChange={async (e) => {
                        await lgApi(
                          `accounts/profiles/search/${e.target.value}`,
                          {
                            headers: {
                              Authorization: "Bearer " + String(accessToken),
                            },
                          }
                        )
                          .then((res) => {
                            if (e.target.value.length !== 0) {
                              setProfiles(res.data.results || res.data);
                              if (res.data.results?.length === 0) {
                                setNotProfile("Profile does not match");
                              }
                            } else {
                              setProfiles([]);
                              setNotProfile("");
                            }
                          })
                          .then((err) => {});
                      }}
                      onBlur={() => {
                        setProfiles([]);
                        setNotProfile("");
                      }}
                    />
                    <div className="grapper-results-search">
                      {profiles?.length !== 0
                        ? profiles?.map((value, i) => {
                            // If post image not contains http_media, add.
                            if (value?.picture === null) {
                              profilePicture = httpMedia + "user_circle.svg";
                            } else {
                              profilePicture = value?.picture;
                            }
                            return (
                              <div key={i}>
                                <div className="grapper-searchs border border-2 p-2 rounded-3">
                                  <div>
                                    <Link
                                      to={`profile/${value?.user?.username}`}
                                    >
                                      <img
                                        src={profilePicture}
                                        alt={value?.user?.username}
                                        className={
                                          value?.picture === null
                                            ? "go-to-profile rounded-circle profile-img-search"
                                            : "go-to-profile rounded-circle profile-img-search scale-down"
                                        }
                                        onClick={(e) => {
                                          window.localStorage.setItem(
                                            "profile",
                                            e.target.alt
                                          );
                                        }}
                                        id={`id_picture_search_${value?.id}`}
                                      />
                                    </Link>
                                  </div>
                                  <div>
                                    <Link
                                      to={`profile/${value?.user?.username}`}
                                    >
                                      <span
                                        className="h5 go-to-profile"
                                        id={`id_username_search_${value?.id}`}
                                        onClick={(e) => {
                                          window.localStorage.setItem(
                                            "profile",
                                            e.target.innerText
                                          );
                                        }}
                                      >
                                        {value?.user?.username}
                                      </span>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        : notProfile !== ""
                        ? profileDoesNotMatch
                        : ""}
                    </div>
                  </div>
                </li>

                {/* MD */}
                <li className="nav-item">
                  <span className="nav-link container-icons-link">
                    <BsChatLeft className="icon-gral" />
                  </span>
                </li>

                {/* Home */}
                <li className="nav-item">
                  <Link to="/" title="home">
                    <span className="nav-link container-icons-link">
                      <BsHouse className="icon-gral" />
                    </span>
                  </Link>
                </li>

                {/* Profile */}
                <li className="nav-item">
                  <Link
                    to={`/profile/${window.localStorage.getItem(
                      "profile_auth"
                    )}`}
                    title="profile"
                  >
                    <span className="nav-link container-icons-link">
                      <BsPersonCircle className="icon-gral" />
                    </span>
                  </Link>
                </li>

                {/* New post */}
                <li className="nav-item">
                  <Link to="/new-post" title="new post">
                    <span className="nav-link container-icons-link">
                      <BsPlusCircle className="icon-gral" />
                    </span>
                  </Link>
                </li>

                {/* Lazy wallet */}
                <li className="nav-item">
                  <span className="nav-link container-icons-link">
                    <BsFillWalletFill className="icon-gral" />
                  </span>
                </li>

                {/* Logout */}
                <li
                  className="nav-item"
                  onClick={async () => {
                    // Logout
                    await lgApi({
                      url: "http://localhost:8000/accounts/logout/",
                      method: "post",
                      headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: "Bearer " + String(accessToken),
                      },
                      withCredentials: true,
                    })
                      .then(() => {
                        // Remove authenticated user in local storage
                        window.localStorage.removeItem("profile_auth");
                        window.localStorage.removeItem("current_profile");
                        setAccessToken(false);
                      })
                      .catch(({ err }) => {
                        console.error(err);
                      });

                    // Delete tokens in cache
                    await caches.delete("refresh_token");
                    await caches.delete("access_token");
                  }}
                >
                  <Link to="/login" title="logout">
                    <span className="nav-link container-icons-link">
                      <BsBoxArrowRight className="icon-gral" />
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}

export { HeadMenu };
