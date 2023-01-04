// Verify token.

import { lgApi, addInvalidToken } from "../../__modules__";
import "../../css/ActiveAccount.css";
import { redirect, useNavigate } from "react-router-dom";

const ActivateAccount = () => {
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    // Get refresh token
    let activateAccount = new FormData();
    const refreshInput = document.querySelector("#id_token");
    const refresh = document.querySelector("#id_token").value;
    activateAccount.append("refresh", refresh);
    activateAccount.append(
      "username",
      window.localStorage.getItem("profile_auth")
    );

    await lgApi("accounts/validation-register-token/", {
      method: "post",
      data: activateAccount,
    })
      .then(() => {
        return navigate("../login", { relative: "path" });
      })
      .catch((err) => {
        console.log(err);
        addInvalidToken(
          refreshInput,
          err.response.data.detail || err.response.data
        );
      });
  }

  return (
    <div className="w-25 position mx-auto mt-3">
      <h2 className="h2 text-center">Activate your account</h2>

      <form
        method="post"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <input
          type="text"
          className="form-control"
          id="id_token"
          required
          placeholder="Input your token"
        />
        <input type="submit" className="btn btn-primary col" id="submit" />
      </form>
    </div>
  );
};

export { ActivateAccount };
