/* Edit profile. */

import { lgApi } from "../../__modules__";
import { addInvalidUpdate } from "../../__modules__";
import "../../css/users/Profile.css";
import { React, useState, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { redirect, useNavigate } from "react-router";
import "../../css/Margin.css";
import axios from "axios";

const EditProfile = () => {
  const [profile, setProfile] = useState([]);
  const authUser = window.localStorage.getItem("profile_auth") + "/";
  const { accessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  let picture = document.querySelector("#id_picture");
  let biography = document.querySelector("#id_biography");
  let phoneNumber = document.querySelector("#id_phone_number");
  let website = document.querySelector("#id_website");
  let dateOfBirth = document.querySelector("#id_date_of_birth");

  let username = document.querySelector("#id_username");
  let email = document.querySelector("#id_email");
  let firstName = document.querySelector("#id_first_name");
  let lastName = document.querySelector("#id_last_name");

  // Submit profile handler
  async function updateProfile(e) {
    e.preventDefault();

    // Profile update.
    let profileForm = new FormData();
    // User update.
    let userForm = new FormData();

    // Username validation.
    if (username.value !== undefined) {
      userForm.append("username", username.value);
    }

    // Email validation.
    if (email.value !== undefined) {
      userForm.append("email", email.value);
    }

    // first_name validation.
    if (firstName.value !== undefined) {
      userForm.append("first_name", firstName.value);
    }

    // last_name validation.
    if (lastName.value !== undefined) {
      userForm.append("last_name", lastName.value);
    }

    // Picture validation.
    if (picture.files[0] !== undefined) {
      profileForm.append("picture", picture.files[0]);
    }
    // Biography validate.
    if (biography.value !== undefined) {
      profileForm.append("biography", biography.value);
    }

    // Phone number validation.
    if (phoneNumber.value !== undefined) {
      profileForm.append("phone_number", phoneNumber.value);
    }

    // Website validation.
    if (website.value !== undefined) {
      profileForm.append("website", website.value);
    }

    // Date of birth validation.
    if (dateOfBirth.value !== undefined) {
      profileForm.append("date_of_birth", dateOfBirth.value);
    }

    let profileUpdate = true;
    let userUpdate = true;

    // Update profile
    await lgApi(`accounts/profiles/${authUser}`, {
      method: "put",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + String(accessToken),
      },
      data: profileForm,
    })
      .then(({ data }) => {
      })
      .catch((err) => {
        profileUpdate = false;
        addInvalidUpdate(err.response.data, e.target);
      });

    // Update user
    await lgApi(`accounts/users/${authUser}`, {
      method: "put",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + String(accessToken),
      },
      data: userForm,
    })
      .then(({ data }) => {
        window.localStorage.setItem("profile_auth", data?.username);
      })
      .catch((err) => {
        userUpdate = false;
        addInvalidUpdate(err.response.data, e.target);
      });

    if (profileUpdate && userUpdate) {
      navigate("..", { relative: "path" });
    }
  }

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    // Getting data from profile user.
    lgApi(`accounts/profiles/${authUser}`, {
      headers: {
        Authorization: "Bearer " + String(accessToken),
      },
    }).then(({ data }) => {
      setProfile(data);
    });
    return () => {
      cancelToken.cancel();
    };
  }, [accessToken, authUser]);

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
      className="mt-3"
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
            className="form-control"
            defaultValue={profile?.user?.username || ""}
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
            defaultValue={profile?.user?.email || ""}
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
            defaultValue={profile?.user?.first_name || ""}
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
            defaultValue={profile?.user?.last_name || ""}
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
            className="form-control"
            defaultValue={profile?.biography || ""}
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
            defaultValue={profile?.picture || ""}
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
            defaultValue={profile?.date_of_birth || ""}
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
            defaultValue={profile?.website || ""}
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
            defaultValue={profile?.phone_number || ""}
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
