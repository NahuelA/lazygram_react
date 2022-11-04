import React from "react";
import { lg_api } from "../../__modules__";
import { addInvalidCreatePost } from "../../utils/users/profile";

class CreatePost extends React.Component {
  constructor() {
    super();
    this.state = { post: [] };
    this.token = window.localStorage.getItem("token");
    this.profile_auth = window.localStorage.getItem("profile_auth");

    // Methods
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(e);
    let form_post = new FormData();
    let picture = document.querySelector("#id_picture").files[0];
    let description = document.querySelector("#id_description").value;

    // Post image validation.
    if (picture !== null) {
      form_post.append("picture", picture);
    }

    // Description validation.
    if (description !== null) {
      form_post.append("description", description);
    }
    form_post.append("auth_profile", this.profile_auth);

    lg_api("posts/", {
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${this.token}`,
      },
      data: form_post,
    })
      .then((res) => {
        window.location.hash = "#";
      })
      .catch((err) => {
        addInvalidCreatePost(err.response.data, e.target[0]);
      });
  }

  render() {
    return (
      <section className="mt-5">
        <form
          method="post"
          encType="multipart/form-data"
          onSubmit={(e) => {
            this.handleSubmit(e);
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
  }
}

export { CreatePost };
