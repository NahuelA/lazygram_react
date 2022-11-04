import { lg_api } from "../../__modules__";

/**
 * Like a post.
 * @param {*} e
 */
async function likePost(e) {
  if (String(e.nativeEvent.path[1].id).startsWith("id_like_post")) {
    let url = `posts/${e.nativeEvent.path[4].id}/`;
    let token = window.localStorage.getItem("token");
    let likesComponent = document.querySelector(
      `#id_show_likes_${e.nativeEvent.path[4].id}`
    );

    await lg_api(url, {
      method: "put",
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        likesComponent.innerHTML = `${res.data.likes} Likes`;
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

/**
 * Send comments.
 * @param {*} e
 */
async function commentPost(e, newComment) {
  try {
    let form_comment = new FormData();
    let postid = e.path[2].id;
    let token = window.localStorage.getItem("token");

    // Post ID validation.
    if (postid !== null) {
      form_comment.append("post", postid);
    }

    // Comment validation.
    if (newComment !== null) {
      form_comment.append("comment", newComment);
    }

    // Put comments.
    lg_api("comments/", {
      method: "post",
      headers: {
        Authorization: `Token ${token}`,
      },
      data: form_comment,
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  } catch (err) {
    alert(err.name, err.message);
    console.log(err.message);
  }
}

/**
 * Input component from comment.
 * @param {*} id_comment
 * @returns
 */
function inputComment(id_comment) {
  let commentComponent = document.createElement("div");
  let inputComponent = document.createElement("input");
  let btnComponent = document.createElement("button");

  // Comment
  commentComponent.classList =
    "row-inp-comment mt-2 rounded-pill border border-2";

  // Input
  inputComponent.classList = "input-cmt border-0";
  inputComponent.placeholder = "Add comment...";
  inputComponent.id = `${id_comment}_inp`;

  // Send button
  btnComponent.classList =
    "btn btn-outline-primary text-center col-sm rounded-pill";
  btnComponent.innerHTML = "Send";
  commentComponent.append(inputComponent, btnComponent);
  btnComponent.addEventListener("click", (e) => {
    let inputCommentValue = document.querySelector(`#${id_comment}_inp`).value;
    commentPost(e, inputCommentValue);
  });

  return commentComponent;
}

/**
 * Reply comments.
 * @param {*} e
 */
async function replyComment(e) {
  if (String(e.nativeEvent.path[1].id).startsWith("comments_post")) {
    try {
      let token = window.localStorage.getItem("token");
      let replied_by = window.localStorage.getItem("profile_auth");
      let form_comment = new FormData();
      let len = e.target.parentElement.id.split("").length;
      let commentid = parseInt(e.target.parentElement.id.split("")[len - 1]);

      let reply = e.target.value;

      // Comment id validation.
      if (commentid !== null) {
        form_comment.append("commentid", commentid);
      }

      // Replied by validation.
      if (replied_by !== null) {
        form_comment.append("replied_by", replied_by);
      }

      // Reply validation.
      if (reply !== null) {
        form_comment.append("reply", reply);
      }

      // Put comments.
      lg_api(`replies/`, {
        method: "put",
        headers: {
          Authorization: `Token ${token}`,
        },
        data: form_comment,
      })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    } catch (err) {
      alert(err.name, err.message);
      console.log(err.message);
    }
  }
}

async function likeComment(e) {
  // if (likes !== null) {
  //   form_comment.append("likes", likes);
  // }
}

// Components
export { inputComment };

// Utils
export { likePost, commentPost, replyComment, likeComment };
