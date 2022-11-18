/* Form to create an user. */

import { lgApi, addInvalidRegister } from "../../__modules__";

const CreateUser = () => {
  /**
   * Handle the submit event and send received data.
   * @param {event} e
   */
  const submitUser = async (e) => {
    e.preventDefault();
    let form_user = new FormData();

    // Data
    let username = document.querySelector("#id_username").value;
    let password = document.querySelector("#id_password").value;
    let email = document.querySelector("#id_email").value;
    let first_name = document.querySelector("#id_first_name").value;
    let last_name = document.querySelector("#id_last_name").value;

    // Username validation
    if (username !== undefined) {
      console.log(username);
      form_user.append("username", username);
    }

    // Password validation
    if (password !== undefined) {
      console.log(password);
      form_user.append("password", password);
    }

    // Email validation
    if (email !== undefined) {
      form_user.append("email", email);
    }

    // First name validation
    if (first_name !== undefined) {
      form_user.append("first_name", first_name);
    }

    // Last name validation
    if (last_name !== undefined) {
      form_user.append("last_name", last_name);
    }

    // Create user
    await lgApi("accounts/users/", {
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: form_user,
    })
      .then((res) => {
        console.log(res);
        window.localStorage.setItem("profile_auth", username);
      })
      .catch((err) => {
        addInvalidRegister(err.response.data, e.target);
      });
  };

  return (
    <form
      method="post"
      encType="multipart/form-data"
      onSubmit={(e) => {
        submitUser(e);
      }}
    >
      <div className="mx-auto mt-4 w-75">
        {/* Title create profile */}
        <div className="mb-2 col-sm-8 mx-auto">
          <h2 className="h2">Create your account</h2>
        </div>

        {/* Username */}
        <div className="mb-2 col-sm-8 mx-auto">
          <label htmlFor="id_username" className="form-label">
            Username:
          </label>
          <input
            type="text"
            placeholder="Username"
            id="id_username"
            className="form-control"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-2 col-sm-8 mx-auto">
          <label htmlFor="id_password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            placeholder="Password"
            id="id_password"
            className="form-control"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-2 col-sm-8 mx-auto">
          <label htmlFor="id_email" className="form-label">
            Email:
          </label>
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
        </div>

        {/* First name */}
        <div className="mb-2 col-sm-8 mx-auto">
          <label htmlFor="id_first_name" className="form-label">
            First name:
          </label>
          <input
            type="text"
            placeholder="First name"
            id="id_first_name"
            className="form-control"
          />
        </div>

        {/* Last name */}
        <div className="mb-2 col-sm-8 mx-auto">
          <label htmlFor="id_last_name" className="form-label">
            Last name:
          </label>
          <input
            type="text"
            placeholder="Last name"
            id="id_last_name"
            className="form-control"
          />
        </div>

        {/* Submit */}
        <div className="d-grid gap-2 col-sm-8 mx-auto mb-2">
          <button type="submit" className="btn btn-primary">
            Register now!
          </button>
        </div>
      </div>
    </form>
  );
};

export { CreateUser };
