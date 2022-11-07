/* Login view from lazygram in react */

import { lgApi } from "../../__modules__";
import "../../css/users/Login.css";
import React, { useState } from "react";
import { addCache } from "../../utils/users/cache";
import { Link } from "react-router-dom";

const Login = () => {
  const [errors, setErrors] = useState([]);
  const img = "http://localhost:8000/media/logo_instagram.png";

  const loginSubmit = async (e) => {
    e.preventDefault();

    await lgApi({
      url: "accounts/login/",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        username: document.querySelector("#validationServer03").value,
        password: document.querySelector("#validationServer04").value,
      },
      withCredentials: true,
    })
      .then(({ data }) => {
        // Set in localStorage the username from authenticated user.
        addCache("access_token", "http://localhost:8000/", data.access);
        addCache("refresh_token", "http://localhost:8000/", data.refresh);
        window.localStorage.setItem("profile_auth", data.user);
      })
      .catch((err) => {
        setErrors([err.response.data]);
        e.target[0].classList.add("is-invalid");
        e.target[1].classList.add("is-invalid");
      });
  };

  return (
    <main>
      <section className="login">
        <div className="logo">
          <img src={img} alt="copygram_logo" />
          <h1>Lazygram</h1>
        </div>
        <div className="container-form">
          <form
            method="POST"
            className="needs-validation"
            noValidate
            onSubmit={(e) => {
              loginSubmit(e);
            }}
          >
            <div className="container-form">
              {/* Username */}
              <label htmlFor="validationServer03" id="labels-login-username">
                Username{errors[0]?.username}
              </label>
              <input
                type="text"
                className="form-control inputs-login"
                autoFocus
                id="validationServer03"
                placeholder="Username"
                required
              />
              {
                <div className="invalid-feedback">
                  {errors[0]?.username || null}{" "}
                </div>
              }

              {/* Password */}
              <label htmlFor="validationServer04" id="labels-login-password">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="validationServer04"
                placeholder="Password"
                min={8}
                required
              />
              {
                <div className="invalid-feedback">
                  {errors[0]?.password ||
                    errors[0]?.detail ||
                    errors[0]?.non_field_errors}{" "}
                </div>
              }

              {/* Login submit */}
              <div className="d-grid gap-2 col-12 my-2">
                <button type="submit" className="btn btn-primary btn-lg">
                  Login
                </button>
              </div>
              <div className="mx-auto">
                <Link to={"/register"}>
                  <span className="dont-account">
                    Don't have an account? register now!
                  </span>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export { Login };
