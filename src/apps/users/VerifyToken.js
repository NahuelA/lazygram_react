// Verify token.

import { lg_api, addInvalidToken } from "../../__modules__";
import React from "react";
import "../../css/users/Verify.css";
import { BsFillExclamationSquareFill } from "react-icons/bs";

class VerifyToken extends React.Component {
  constructor() {
    super();
    this.state = { token: "" };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    let token_data = new FormData();
    let new_token = document.querySelector("#id_token");
    token_data.append("token", new_token.value);

    await lg_api("accounts/verify-account/", {
      method: "post",
      data: token_data,
    })
      .then((res) => {
        console.log(res.data);
        window.location.hash = "#login";
      })
      .catch((err) => {
        addInvalidToken(new_token, err.response.data);
      });
  }

  render() {
    return (
      <div className="w-25 mx-auto">
        <h2 className="h2 text-center">Input token</h2>
        <div className="row justify-content-center">
          <BsFillExclamationSquareFill className="verify" />{" "}
        </div>

        <form
          method="post"
          onSubmit={(e) => {
            this.handleSubmit(e);
          }}
        >
          <input
            type="text"
            className="form-control"
            id="id_token"
            required
            placeholder="Input your token"
          />
          <input
            type="submit"
            className="btn btn-primary col"
            id="submit"
            placeholder="Input your token"
          />
        </form>
      </div>
    );
  }
}

export { VerifyToken };
