import { lgApi } from "../../__modules__";

/**
 * Like a post.
 * @param {*} e
 */
async function likePost(e, accessToken) {
  if (String(e.target.parentNode.id).startsWith("id_like_post")) {
    // Like component ID
    let likesComponentId =
      e.target.parentElement.parentElement.nextSibling.firstChild.id;

    // Post id
    let idPost =
      e.target.parentElement.parentElement.parentElement.parentElement.id;

    // Like component
    let likesComponent = document.querySelector(
      `#id_show_likes_${likesComponentId.split("_")[3]}`
    );

    await lgApi(`posts/${idPost}/`, {
      method: "put",
      headers: {
        Authorization: "Bearer " + String(accessToken),
      },
    })
      .then((res) => {
        likesComponent.innerHTML = `${res.data.likes} Likes`;
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

/**
 * Send comments.
 * @param {*} e
 */
async function commentPost(e, newComment, accessToken) {
  try {
    let form_comment = new FormData();
    let postid = e.path[2].id;

    // Post ID validation.
    if (postid !== null) {
      form_comment.append("post", postid);
    }

    // Comment validation.
    if (newComment !== null) {
      form_comment.append("comment", newComment);
    }

    // Put comments.
    lgApi("comments/", {
      method: "post",
      headers: {
        Authorization: "Bearer " + String(accessToken),
      },
      data: form_comment,
    })
      .then((res) => {})
      .catch((err) => {
        console.error(err.response.data);
      });
  } catch (err) {
    alert(err.name, err.message);
  }
}

/**
 * Input component from comment.
 * @param {*} id_comment
 * @returns
 */
function inputComment(id_comment, accessToken) {
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
    commentPost(e, inputCommentValue, accessToken);
  });

  return commentComponent;
}

/**
 * Reply comments.
 * @param {*} e
 */
async function replyComment(e, accessToken) {
  if (String(e.nativeEvent.path[1].id).startsWith("comments_post")) {
    try {
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
      lgApi(`replies/`, {
        method: "put",
        headers: {
          Authorization: "Bearer " + String(accessToken),
        },
        data: form_comment,
      })
        .then((res) => {})
        .catch((err) => {
          console.error(err.response.data);
        });
    } catch (err) {
      alert(err.name, err.message);
    }
  }
}

// Components
export { inputComment };

// Utils
export { likePost, commentPost, replyComment };
