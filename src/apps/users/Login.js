/* Login view from lazygram in react */

import { lg_api } from "../../__modules__";
import "../../css/users/Login.css";
import React from "react";
import { addCache } from "../../utils/users/cache";

class Login extends React.Component {
  constructor() {
    super();
    this.state = { errors: [] };
    this.username = "";
    this.password = "";
    this.img = "http://localhost:8000/media/logo_instagram.png";
    this.login_submit = async (e) => {
      e.preventDefault();

      await lg_api({
        url: "accounts/login/",
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: {
          username: this.username,
          password: this.password,
        },
        withCredentials: true,
      })
        .then(({ data }) => {
          // Set in localStorage the username from authenticated user.
          console.log("Values", data);
          addCache("refresh_token", "http://localhost:8000/", data.refresh);
          window.localStorage.setItem("profile_auth", data.user);
          window.location.hash = "";
        })
        .catch((err) => {
          this.setState({ errors: err.response.data });
          e.target[0].classList.add("is-invalid");
          e.target[1].classList.add("is-invalid");
        });
    };
  }

  render() {
    let state = this.state?.errors;
    let username = (
      <div className="invalid-feedback">
        {state?.username || console.error("Invalid login. Plese, try again!")}{" "}
      </div>
    );
    let password = (
      <div className="invalid-feedback">
        {state?.password || console.error("Invalid login. Plese, try again!")}{" "}
      </div>
    );
    return (
      <main>
        <section className="login">
          <div className="logo">
            <img src={this.img} alt="copygram_logo" />
            <h1>Lazygram</h1>
          </div>
          <div className="container-form">
            <form
              method="POST"
              className="needs-validation"
              noValidate
              onSubmit={(e) => {
                this.login_submit(e);
              }}
            >
              <div className="container-form">
                {/* Username */}
                <label htmlFor="validationServer03" id="labels-login-username">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control inputs-login"
                  autoFocus
                  id="validationServer03"
                  placeholder="Username"
                  required
                  onChange={(e) => {
                    this.username = e.target.value;
                  }}
                />
                {username}

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
                  onChange={(e) => {
                    this.password = e.target.value;
                  }}
                />
                {password}

                {/* Login submit */}
                <div className="d-grid gap-2 col-12 my-2">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Login
                  </button>
                </div>
                <div className="mx-auto">
                  <span className="dont-account" onClick={() => {}}>
                    Don't have an account? register now!
                  </span>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
    );
  }
}

export { Login };
