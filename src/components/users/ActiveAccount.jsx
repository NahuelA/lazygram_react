// Verify token.

import { lgApi, addInvalidToken } from "../../__modules__";
import React from "react";
import "../../css/users/Verify.css";
import { BsFillExclamationSquareFill } from "react-icons/bs";
import { addCache } from "../../utils/users/cache";

class RefreshToken extends React.Component {
  constructor() {
    super();
    this.state = { token: "" };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    let refreshForm = new FormData();
    let refresh = caches.open("refresh_token").then((cache) => {
      console.log(cache);
    });
    refreshForm.append("token", refresh);

    await lgApi("accounts/refresh-token/", {
      method: "post",
      data: refresh,
    })
      .then((res) => {
        console.log(res.data);
        window.location.hash = "#login";
      })
      .catch((err) => {
        addInvalidToken(refresh, err.response.data);
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

export { RefreshToken };
