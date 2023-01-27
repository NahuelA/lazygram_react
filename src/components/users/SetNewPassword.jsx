/* Set new password */

import { lgApi, addInvalidToken } from "../../__modules__";
import "../../css/ActiveAccount.css";
import { useNavigate } from "react-router";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const SetNewPassword = () => {
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();

    let setNewPassword = new FormData();
    const passInput = document.querySelector("#id_password");
    const passwordValue = document.querySelector("#id_password").value;
    const confirmationPasswordInput = document.querySelector(
      "#id_confirmation_passwd"
    );
    const confirmationPasswordValue = document.querySelector(
      "#id_confirmation_passwd"
    ).value;

    // Password field
    if (passwordValue !== undefined) {
      setNewPassword.append("password", passwordValue);
    }

    // Confirmation password field
    if (confirmationPasswordValue !== undefined) {
      setNewPassword.append("confirm_passwd", confirmationPasswordValue);
    }

    if (passwordValue !== confirmationPasswordValue) {
      addInvalidToken(
        confirmationPasswordInput,
        "Password and confirmation password does not match"
      );
    }

    await lgApi("accounts/set-new-password", {
      method: "post",
      data: setNewPassword,
      headers: {
        Authorization: "Bearer " + String(accessToken),
      },
    })
      .then((res) => {
        console.log(res);
        navigate("../set-new-password", { relative: "path" });
      })
      .catch((err) => {
        let data = err.response.data;
        console.log(data);
        let error;

        if (data.non_field_errors !== undefined) {
          error = data.non_field_errors;
        }

        if (data.detail !== undefined) {
          error = data.detail;
        }

        addInvalidToken(confirmationPasswordInput, error);
      });
  }

  return (
    <div className="w-25 position mx-auto mt-3">
      <h2 className="h2 text-center">Set new password:</h2>

      <form
        method="post"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <input
          type="password"
          className="form-control"
          minLength="8"
          id="id_password"
          placeholder="Set password"
          required
        />
        <input
          type="password"
          className="form-control"
          minLength="8"
          id="id_confirmation_passwd"
          placeholder="Set confirmation password"
          required
        />
        <input type="submit" className="btn btn-primary col" id="submit" />
      </form>
    </div>
  );
};

export { SetNewPassword };
