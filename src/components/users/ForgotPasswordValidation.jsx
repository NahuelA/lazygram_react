/* Forgot password validation */

import { lgApi, addInvalidToken, frontHost } from "../../__modules__";
import "../../css/ActiveAccount.css";
import { useNavigate } from "react-router";
import { addCache } from "../../utils/users/cache";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const ForgotPasswordValidation = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();
    // Get access token
    let access = new FormData();
    const accessInput = document.querySelector("#id_access_token");
    const accessToken = document.querySelector("#id_access_token").value;

    // Access token field
    if (accessToken !== undefined) {
      access.append("access", accessToken);
    }

    await lgApi("accounts/forgot-password-validation", {
      method: "post",
      data: access,
    })
      .then((res) => {
        addCache("access_token", `${frontHost}access_token`, res.data.access);

        window.localStorage.setItem("profile_auth", res.data.username);
        setAccessToken(res.data.access);
        navigate("../set-new-password", { relative: "path" });
      })
      .catch((err) => {
        addInvalidToken(
          accessInput,
          err.response.data.detail || err.response.data
        );
      });
  }

  return (
    <div className="w-25 position mx-auto mt-3">
      <h2 className="h2 text-center">Enter your token to change password:</h2>

      <form
        method="post"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <input
          type="text"
          className="form-control"
          maxLength="228"
          minLength="8"
          id="id_access_token"
          placeholder="Your token"
          required
        />
        <input type="submit" className="btn btn-primary col" id="submit" />
      </form>
    </div>
  );
};

export { ForgotPasswordValidation };
