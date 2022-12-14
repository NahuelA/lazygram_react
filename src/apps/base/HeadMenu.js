import "../../css/Main.css";
import React, { useState } from "react";
import { lg_api } from "../../__modules__";

import {
  BsHouse,
  BsBoxArrowRight,
  BsPersonCircle,
  BsChatLeft,
  BsInstagram,
  BsSearch,
  BsPlusCircle,
} from "react-icons/bs";

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
                        lg_api(`accounts/profile/${e.target.value}`, {
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
                <li
                  className="nav-item"
                  onClick={() => (window.location.hash = "")}
                >
                  <span className="nav-link container-icons-link">
                    <BsHouse className="icon-gral" />
                  </span>
                </li>

                {/* User */}
                <li
                  className="nav-item"
                  onClick={() => {
                    window.location.hash = "#profile";
                    window.localStorage.setItem(
                      "profile",
                      window.localStorage.getItem("profile_auth")
                    );
                  }}
                >
                  <span className="nav-link container-icons-link">
                    <BsPersonCircle className="icon-gral" />
                  </span>
                </li>

                {/* New post */}
                <li
                  className="nav-item"
                  onClick={() => (window.location.hash = "#newpost")}
                >
                  <span className="nav-link container-icons-link">
                    <BsPlusCircle className="icon-gral" />
                  </span>
                </li>

                {/* Logout */}
                <li
                  className="nav-item"
                  onClick={() => {
                    lg_api({
                      url: "http://localhost:8000/accounts/logout/",
                      method: "post",
                      headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: caches.has("refresh_token"),
                      },

                      withCredentials: true,
                    })
                      .then(({ res }) => {
                        console.log(res);
                        caches.delete("refresh_token");
                        window.localStorage.removeItem("profile_auth");
                        window.localStorage.removeItem("current_profile");
                        window.location.hash = "login";
                      })
                      .catch(({ err }) => {
                        console.error(err);
                      });
                  }}
                >
                  <span className="nav-link container-icons-link">
                    <BsBoxArrowRight className="icon-gral" />
                  </span>
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
