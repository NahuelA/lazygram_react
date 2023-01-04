import React, { useContext } from "react";
import { lgApi } from "../../__modules__";
import { addInvalidCreatePost } from "../../utils/users/profile";
import AuthContext from "../../context/AuthContext";
import "../../css/Margin.css";

const CreatePost = () => {
  const { accessToken } = useContext(AuthContext);
  const profileAuth = window.localStorage.getItem("profile_auth");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let postForm = new FormData();
    let picture = document.querySelector("#id_picture").files[0];
    let description = document.querySelector("#id_description").value;

    // Post image validation.
    if (picture !== null) {
      postForm.append("picture", picture);
    }

    // Description validation.
    if (description !== null) {
      postForm.append("description", description);
    }

    postForm.append("username", profileAuth);

    await lgApi("posts/", {
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + String(accessToken),
      },
      data: postForm,
    })
      .then((res) => {
        alert("Post created successfully!");
      })
      .catch((err) => {
        addInvalidCreatePost(err.response.data, e.target[0]);
      });
  };

  return (
    <section className="mt-3">
      <form
        method="post"
        encType="multipart/form-data"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="row w-50 mx-auto justify-content-center">
          <input
            className="form-control mb-2"
            id="id_picture"
            type="file"
            accept="image/png, image/jpeg image/jpg image/svg"
          />
          <input
            className="form-control mb-2"
            id="id_description"
            type="text"
            placeholder="Description"
          />
          <button type="submit" className="btn btn-primary">
            Submit post
          </button>
        </div>
      </form>
    </section>
  );
};

export { CreatePost };
