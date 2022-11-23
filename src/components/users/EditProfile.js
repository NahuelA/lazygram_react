/* Edit profile. */

import { lgApi } from "../../__modules__";
import { addInvalidUpdate } from "../../__modules__";
import "../../css/users/Profile.css";
import { React, useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { redirect } from "react-router";

const EditProfile = () => {
  const [profile, setProfile] = useState([]);
  const authUser = window.localStorage.getItem("profile_auth") + "/";
  const { retrieveAccessToken } = useContext(AuthContext);

  // Submit profile handler
  async function updateProfile(e) {
    e.preventDefault();

    // Profile update.
    let profileForm = new FormData();
    let picture = document.querySelector("#id_picture").files[0];
    let biography = document.querySelector("#id_biography").value;
    let phoneNumber = document.querySelector("#id_phone_number").value;
    let website = document.querySelector("#id_website").value;
    let dateOfBirth = document.querySelector("#id_date_of_birth").value;

    // User update.
    let userForm = new FormData();
    let username = document.querySelector("#id_username").value;
    let email = document.querySelector("#id_email").value;
    let firstName = document.querySelector("#id_first_name").value;
    let lastName = document.querySelector("#id_last_name").value;

    // Username validation.
    if (username !== undefined) {
      userForm.append("username", username);
    }

    // Email validation.
    if (email !== undefined) {
      userForm.append("email", email);
    }

    // first_name validation.
    if (firstName !== undefined) {
      userForm.append("first_name", firstName);
    }

    // last_name validation.
    if (lastName !== undefined) {
      userForm.append("last_name", lastName);
    }

    // Picture validation.
    if (picture !== undefined) {
      profileForm.append("picture", picture);
    }
    // Biography validate.
    if (biography !== undefined) {
      profileForm.append("biography", biography);
    }

    // Phone number validation.
    if (phoneNumber !== undefined) {
      profileForm.append("phone_number", phoneNumber);
    }

    // Website validation.
    if (website !== undefined) {
      profileForm.append("website", website);
    }

    // Date of birth validation.
    if (dateOfBirth !== undefined) {
      profileForm.append("date_of_birth", dateOfBirth);
    }

    // Update profile
    await lgApi(`accounts/profiles/${authUser}`, {
      method: "put",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + String(retrieveAccessToken()),
      },
      data: profileForm,
    })
      .then(({ data }) => {
        return redirect(`/profiles/${data?.results[0]?.user?.username}`);
      })
      .catch((err) => {
        addInvalidUpdate(err.response.data, e.target);
      });

    // Update user
    await lgApi(`accounts/users/${authUser}`, {
      method: "put",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + String(retrieveAccessToken()),
      },
      data: userForm,
    })
      .then(({ data }) => {
        window.localStorage.setItem(
          "profile_auth",
          data?.results[0].user?.username
        );
        return redirect(`/profiles/${data?.results[0]?.user?.username}`);
      })
      .catch((err) => {
        addInvalidUpdate(err.response.data, e.target);
      });
  }

  // Getting data from profile user.
  lgApi(`accounts/profiles/${authUser}`, {
    headers: {
      Authorization: "Bearer " + String(retrieveAccessToken()),
    },
  }).then(({ data }) => {
    setProfile([data.results[0]]);
  });

  // Getting date (yyy-mm-dd) from user
  let date = profile?.date_of_birth;
  if (date !== undefined) {
    date = date?.toString().slice(0, 10);
  }

  return (
    <form
      method="put"
      encType="multipart/form-data"
      onSubmit={(e) => {
        updateProfile(e);
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
            value={profile?.user?.username}
            className="form-control"
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
            value={profile?.user?.email}
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
            value={profile?.user?.first_name}
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
            value={profile?.user?.last_name}
            className="form-control"
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
            value={profile?.biography}
            className="form-control"
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
            value={profile?.website}
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
            value={profile?.phone_number}
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
};

export { EditProfile };
