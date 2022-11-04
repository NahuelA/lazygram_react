/* Edit profile. */

import { lg_api } from "../../__modules__";
import { addInvalidUpdate } from "../../__modules__";
import "../../css/users/Profile.css";
import React from "react";

class EditProfile extends React.Component {
  constructor() {
    super();
    this.state = { profile_data: "", errors: [] };
    this.auth_user = window.localStorage.getItem("profile_auth") + "/";

    // User data.
    this.username = this.state.profile_data?.user?.username;
    this.email = this.state.profile_data?.user?.email;
    this.first_name = this.state.profile_data?.user?.first_name;
    this.last_name = this.state.profile_data?.user?.last_name;

    // Profile data
    this.biography = this.state.profile_data?.biography;
    this.picture = this.state.profile_data?.picture;
    this.date_of_birth = this.state.profile_data?.date_of_birth;
    this.website = this.state.profile_data?.website;
    this.phone_number = this.state.profile_data?.phone_number;

    // Methods
    this.handleInput = this.handleInput.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
  }

  // Handle all inputs.
  handleInput(e) {
    this.setState({ profile_data: e.target.value });
  }

  // Submit profile handle
  async updateProfile(e) {
    e.preventDefault();

    // Update profile.
    let form = new FormData();
    let picture = document.querySelector("#id_picture").files[0];
    let biography = document.querySelector("#id_biography").value;
    let phone_number = document.querySelector("#id_phone_number").value;
    let website = document.querySelector("#id_website").value;
    let date_of_birth = document.querySelector("#id_date_of_birth").value;

    // Update user.
    let form_user = new FormData();
    let username = document.querySelector("#id_username").value;
    let email = document.querySelector("#id_email").value;
    let first_name = document.querySelector("#id_first_name").value;
    let last_name = document.querySelector("#id_last_name").value;

    // Username validation.
    if (username !== undefined) {
      form_user.append("username", username);
    }

    // Email validation.
    if (email !== undefined) {
      form_user.append("email", email);
    }

    // first_name validation.
    if (first_name !== undefined) {
      form_user.append("first_name", first_name);
    }

    // last_name validation.
    if (last_name !== undefined) {
      form_user.append("last_name", last_name);
    }

    // Picture validation.
    if (picture !== undefined) {
      form.append("picture", picture);
    }
    // Biography validate.
    if (biography !== undefined) {
      form.append("biography", biography);
    }

    // Phone number validation.
    if (phone_number !== undefined) {
      form.append("phone_number", phone_number);
    }

    // Website validation.
    if (website !== undefined) {
      form.append("website", website);
    }

    // Date of birth validation.
    if (date_of_birth !== undefined) {
      form.append("date_of_birth", date_of_birth);
    }

    // Update profile
    await lg_api(`accounts/profiles/${this.auth_user}`, {
      method: "put",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${window.localStorage.getItem("token")}`,
      },
      data: form,
    })
      .then((res) => {
        window.location.hash = "#profile";
      })
      .catch((err) => {
        addInvalidUpdate(err.response.data, e.target);
      });

    // Update user
    await lg_api(`accounts/users/${this.auth_user}`, {
      method: "put",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${window.localStorage.getItem("token")}`,
      },
      data: form_user,
    })
      .then((res) => {
        window.localStorage.setItem("profile_auth", username);
      })
      .catch((err) => {
        addInvalidUpdate(err.response.data, e.target);
      });
  }

  // State handle
  componentDidMount() {
    // Getting data from profile user.
    lg_api(`accounts/profiles/${this.auth_user}`, {
      headers: {
        Authorization: `Token ${window.localStorage.getItem("token")}`,
      },
    }).then((res) => {
      this.setState({ profile_data: res.data });
    });
  }

  render() {
    // User data
    let user = this.state.profile_data;

    // Getting date (yyy-mm-dd) from user
    let date = user?.date_of_birth;
    if (date !== undefined) {
      date = date?.toString().slice(0, 10);
    }

    return (
      <form
        method="put"
        encType="multipart/form-data"
        onSubmit={(e) => {
          this.updateProfile(e);
        }}
      >
        <div className="mx-auto w-75">
          {/* Title edit profile */}
          <div className="mb-2 col-sm-8 mx-auto">
            <h2 className="h2">Edit user profile</h2>
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
              value={user?.user?.username}
              className="form-control"
              onChange={(e) => {
                this.handleInput(e);
                this.username = e.target.value;
              }}
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
              value={user?.user?.email}
              onChange={(e) => {
                this.handleInput(e);
                this.email = e.target.value;
              }}
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
              value={user?.user?.first_name}
              className="form-control"
              onChange={(e) => {
                this.handleInput(e);
                this.first_name = e.target.value;
              }}
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
              value={user?.user?.last_name}
              className="form-control"
              onChange={(e) => {
                this.handleInput(e);
                this.last_name = e.target.value;
              }}
            />
          </div>

          {/* Biography */}
          <div className="mb-2 col-sm-8 mx-auto">
            <label htmlFor="id_biography" className="form-label">
              Biography:
            </label>
            <input
              type="text"
              placeholder="Your biography"
              id="id_biography"
              value={user?.biography}
              className="form-control"
              onChange={(e) => {
                this.handleInput(e);
                this.biography = e.target.value;
              }}
            />
          </div>

          {/* Picture */}
          <div className="mb-2 col-sm-8 mx-auto">
            <label htmlFor="id_picture" className="form-label">
              Picture:
            </label>
            <input
              type="file"
              id="id_picture"
              accept="image/png, image/jpeg image/jpg image/svg"
              className="form-control"
              onChange={(e) => {
                this.handleInput(e);
              }}
            />
          </div>

          {/* Date of birth */}
          <div className="mb-2 col-sm-8 mx-auto">
            <label htmlFor="id_date_of_birth" className="form-label">
              Date of birth:
            </label>
            <input
              type="date"
              id="id_date_of_birth"
              className="form-control"
              value={date}
              onChange={(e) => {
                this.handleInput(e);
                this.date_of_birth = e.target.value;
              }}
            />
          </div>

          {/* Website */}
          <div className="mb-2 col-sm-8 mx-auto">
            <label htmlFor="id_website" className="form-label">
              Website:
            </label>
            <input
              type="text"
              placeholder="https://website.com"
              id="id_website"
              pattern="https://.*"
              maxLength="200"
              className="form-control"
              value={user?.website}
              onChange={(e) => {
                this.handleInput(e);
                this.website = e.target.value;
              }}
            />
          </div>

          {/* Phone number */}
          <div className="mb-2 col-sm-8 mx-auto">
            <label htmlFor="id_phone_number" className="form-label">
              Phone number:
            </label>
            <input
              type="text"
              id="id_phone_number"
              placeholder="Phone number"
              maxLength="17"
              min="0"
              className="form-control"
              value={user?.phone_number}
              onChange={(e) => {
                this.handleInput(e);
                this.phone_number = e.target.value;
              }}
            />
          </div>

          {/* Update profile */}
          <div className="d-grid gap-2 col-sm-8 mx-auto mb-2">
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export { EditProfile };
