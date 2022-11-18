import "../../css/Main.css";
import React, { useState } from "react";
import { lgApi } from "../../__modules__";

import {
  BsHouse,
  BsBoxArrowRight,
  BsPersonCircle,
  BsChatLeft,
  BsInstagram,
  BsSearch,
  BsPlusCircle,
} from "react-icons/bs";
import { Link } from "react-router-dom";

function HeadMenu() {
  const [profiles, setProfiles] = useState([]);
  return (
    <div className="App">
      <header className="header">
        <nav className="navbar navbar-expand-lg bg-light">
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
                  <span
                    className="nav-link container-icons-link"
                    onClick={(e) => {
                      let grapSearchProfiles = document.querySelector(
                        "#grapper-search-profiles"
                      );
                      grapSearchProfiles.classList.toggle("hidden");
                    }}
                  >
                    <BsSearch className="icon-gral" />
                  </span>
                </li>

                {/* Input search */}
                <li className="nav-item">
                  <div className="grid-search position-relative">
                    <input
                      className="form-control"
                      id="search-input"
                      placeholder="Search profile"
                      autoComplete="off"
                      onChange={(e) => {
                        lgApi(`accounts/profile/${e.target.value}`, {
                          headers: {
                            Authorization: `Token ${window.localStorage.getItem(
                              "token"
                            )}`,
                          },
                        })
                          .then((res) => {
                            setProfiles(res.data.results || res.data);
                          })
                          .then((err) => {
                            console.log(err.response);
                          });
                      }}
                    />
                    <div
                      className="grapper-results-search"
                      id="grapper-search-profiles"
                    >
                      {profiles !== "Does not results." ? (
                        profiles?.map((value) => {
                          return (
                            <div key={value?.id}>
                              <div className="grapper-searchs border border-2 p-2 rounded-3">
                                <div>
                                  <img
                                    src={value?.picture}
                                    alt={value?.user?.username}
                                    className="go-to-profile rounded-circle profile-img-search"
                                    onClick={(e) => {
                                      window.localStorage.setItem(
                                        "profile",
                                        e.target.alt
                                      );
                                      let hashProfile = "#profile";
                                      if (
                                        hashProfile === window.location.hash
                                      ) {
                                        window.location.reload();
                                      } else {
                                        window.location.hash = "#profile";
                                      }
                                    }}
                                    id={`id_picture_search_${value?.id}`}
                                  />
                                </div>
                                <div>
                                  <span
                                    className="h5 go-to-profile"
                                    id={`id_username_search_${value?.id}`}
                                    onClick={(e) => {
                                      window.localStorage.setItem(
                                        "profile",
                                        e.target.innerText
                                      );
                                      let hashProfile = "#profile";
                                      if (
                                        hashProfile === window.location.hash
                                      ) {
                                        window.location.reload();
                                      } else {
                                        window.location.hash = "#profile";
                                      }
                                    }}
                                  >
                                    {value?.user?.username}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="border border-2 p-2 fs-6 text-secondary">
                          {profiles}
                        </p>
                      )}
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

                {/* Logout */}
                <li
                  className="nav-item"
                  onClick={async () => {
                    await caches.open("access_token").then(async (access) => {
                      await access
                        .match("/access_token")
                        .then(async (token) => {
                          await token.json().then(async (accessToken) => {
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
                              .then(({ res }) => {
                                console.log(res);
                                // Remove authenticated user in local storage
                                window.localStorage.removeItem("profile_auth");
                                window.localStorage.removeItem(
                                  "current_profile"
                                );
                              })
                              .catch(({ err }) => {
                                console.error(err);
                              });
                          });
                        });
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
