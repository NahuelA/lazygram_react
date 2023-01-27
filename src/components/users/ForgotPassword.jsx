/* Forgot password */

import { lgApi, addInvalidToken } from "../../__modules__";
import "../../css/ActiveAccount.css";
import { useNavigate } from "react-router";

const ForgotPassword = () => {
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    // Get email
    let email = new FormData();
    const emailInput = document.querySelector("#id_email");
    const emailValue = document.querySelector("#id_email").value;

    // Email field
    if (emailValue !== undefined) {
      email.append("email", emailValue);
    }

    await lgApi("accounts/forgot-password", {
      method: "post",
      data: email,
    })
      .then(() => {
        navigate("../forgot-password-validation", { relative: "path" });
      })
      .catch((err) => {
        addInvalidToken(
          emailInput,
          err.response.data.detail || err.response.data
        );
      });
  }

  return (
    <div className="w-25 position mx-auto mt-3">
      <h2 className="h2 text-center">Enter your email:</h2>

      <form
        method="post"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <input
          type="text"
          className="form-control"
          pattern=".+@gmail\.com"
          maxLength="170"
          minLength="8"
          id="id_email"
          placeholder="youremail@domain.com"
          aria-label="Your email"
          required
        />
        <input type="submit" className="btn btn-primary col" id="submit" />
      </form>
    </div>
  );
};

export { ForgotPassword };
