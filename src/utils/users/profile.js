import { lgApi } from "../../__modules__";
import "../../css/posts/ListPosts.css";

// Handle errors

function searchInputs(inputs, key_err, error_log) {
  let error_label = document.createElement("div");
  error_label.className = "invalid-feedback";
  error_label.innerHTML = `${error_log}`;

  //
  for (let i = 0; i < inputs.length - 1; i++) {
    if (`${inputs[i].id}` === `id_${key_err}`) {
      inputs[i].classList.add("is-invalid");
      if (inputs[i].nextSibling !== null) {
        inputs[i].nextSibling.remove();
      }
      inputs[i].parentNode.insertBefore(error_label, inputs[i].nextSibling);
    }
  }
}
/**
 * Receive inputs and validate your own value.
 * Then it looks for the elements and adds the class 'is-invalid'.
 * @param {*} err
 * @param {*} targets
 */
function addInvalidUpdate(err, targets) {
  console.log(err);
  Array(err).map((value) => {
    if (value.username !== undefined) {
      searchInputs(targets, "username", value.username);
    }

    if (value.email !== undefined) {
      searchInputs(targets, "email", value.email);
    }

    if (value.first_name !== undefined) {
      searchInputs(targets, "first_name", value.first_name);
    }

    if (value.last_name !== undefined) {
      searchInputs(targets, "last_name", value.last_name);
    }

    if (value.website !== undefined) {
      searchInputs(targets, "website", value.website);
    }

    if (value.picture !== undefined) {
      searchInputs(targets, "picture", value.picture);
    }

    if (value.phone_number !== undefined) {
      searchInputs(targets, "phone_number", value.phone_number);
    }

    if (value.date_of_birth !== undefined) {
      searchInputs(targets, "date_of_birth", value.date_of_birth);
    }

    if (value.biography !== undefined) {
      searchInputs(targets, "biography", value.biography);
    }
    return 0;
  });
}

/**
 * Validate register and send errors.
 * @param {*} err
 * @param {*} targets
 */
function addInvalidRegister(err, targets) {
  Array(err).map((value) => {
    if (value.username !== undefined) {
      searchInputs(targets, "username", value.username);
    }

    if (value.password !== undefined) {
      searchInputs(targets, "password", value.password);
    }

    if (value.email !== undefined) {
      searchInputs(targets, "email", value.email);
    }

    if (value.first_name !== undefined) {
      searchInputs(targets, "first_name", value.first_name);
    }

    if (value.last_name !== undefined) {
      searchInputs(targets, "last_name", value.last_name);
    }

    if (value.biography !== undefined) {
      searchInputs(targets, "biography", value.biography);
    }

    if (value.picture !== undefined) {
      searchInputs(targets, "picture", value.picture);
    }
    return 0;
  });
}

function addInvalidToken(target, error_log) {
  let error_label = document.createElement("div");
  if (target.nextSibling.id === "submit") {
    error_label.className = "invalid-feedback";
    error_label.innerHTML = `${error_log}`;
  } else {
    error_label.innerHTML = "";
  }

  target.classList.add("is-invalid");
  target.parentNode.insertBefore(error_label, target.nextSibling);
  return 0;
}

function addInvalidCreatePost(err, target) {
  Array(err).map((value) => {
    if (value.picture !== undefined) {
      let error_label = document.createElement("div");
      error_label.className = "invalid-feedback";
      error_label.innerHTML = `${value.picture}`;

      if (`${target.id}` === "id_picture") {
        target.classList.add("is-invalid");
        if (
          target.nextSibling !== null &&
          target.nextSibling.id !== "id_description"
        ) {
          target.nextSibling.remove();
        }
        target.parentNode.insertBefore(error_label, target.nextSibling);
      }
    }
  });
}

function searchProfile(value, accessToken) {
  lgApi("accounts/profile/", {
    headers: {
      Authorization: "Bearer " + String(accessToken),
    },
    params: {
      search_profile: `${value}`,
    },
  })
    .then((res) => {
      res.data.results.map((v) => {
        <showSearchProfiles picture={v.picture} username={v.user.username} />;
      });
    })
    .catch((err) => {
      console.error(err.response);
    });
}

// Validations
export {
  addInvalidUpdate,
  addInvalidRegister,
  addInvalidToken,
  addInvalidCreatePost,
};

export { searchProfile };
