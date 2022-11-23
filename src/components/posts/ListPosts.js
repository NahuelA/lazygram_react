/* List posts from lazygram with react */

import { lgApi } from "../../__modules__";
import "../../css/posts/ListPosts.css";
import React from "react";
import {
  BsFillHeartFill,
  BsFillChatFill,
  BsFillBookmarkFill,
  BsShareFill,
} from "react-icons/bs";

import { likePost, inputComment } from "../../utils/posts/posts";

class ListPosts extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { posts: [], comments: [] };
    this.token = window.localStorage.getItem("token");
    this.http_media = "http://localhost:8000/media/";
    this.post_img = "";
    this.created = "";
    this.handledPosts = (e) => {
      likePost(e);
    };
    this.addHTTPMedia = this.addHTTPMedia.bind(this);
    this.goToProfile = this.goToProfile.bind(this);
    this.goToProfileComment = this.goToProfileComment.bind(this);
    this.commentComponent = this.commentComponent.bind(this);
  }

  commentComponent(e) {
    let len = e.target.id.split("").length;
    let id = e.target.id.slice(11, len);
    lgApi(`comments/`, {
      headers: {
        Authorization: `Token ${this.token}`,
      },
      params: { id_post: id },
    })
      .then((res) => {
        this.setState({ comments: res.data.results });
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err.response);
      });
  }

  /**
   * Redirect to the desired profile.
   * @param {*} post
   */
  goToProfileComment(e) {
    // Getting username
    let len = e.nativeEvent.path[1].nextSibling.childNodes[0].innerText.length;
    let profile;
    if (e.target.id.startsWith("id_image_prof_comment_")) {
      profile = e.nativeEvent.path[1].nextSibling.childNodes[0].innerText.slice(
        0,
        len - 1
      );
    } else {
      profile = e.target.firstChild.data;
    }
    // set in localStorage the profile name
    window.localStorage.setItem("profile", `${profile}`);
    window.location.hash = "#profile";
  }

  goToProfile(e) {
    // Getting profile name
    let profile;
    if (e.target.id.startsWith("id_img_prof_post")) {
      profile = e.nativeEvent.path[1].nextSibling.childNodes[0].innerText;
    } else {
      profile = e.target.innerText;
    }
    // set in localStorage the profile name
    window.localStorage.setItem("profile", `${profile}`);
    window.location.hash = "#profile";
  }

  /**
   *
   * @param {*} post
   */
  addHTTPMedia(post) {
    // If post image not contains http_media, add.
    if (!post.picture.startsWith(this.http_media)) {
      this.post_img = this.http_media + post.picture;
    } else {
      this.post_img = post.picture;
    }
  }

  componentDidMount() {
    // Getting posts.
    lgApi("posts/", {
      headers: {
        Authorization: `Token ${this.token}`,
      },
    })
      .then((res) => {
        this.setState({ posts: res.data.results });
      })
      .catch((err) => {
        console.error(err.response.data);
      });
  }

  render() {
    return (
      <section className="">
        {this.state.posts.map((post, i) => {
          this.addHTTPMedia(post);

          return (
            <div
              key={i}
              id={post.id}
              className="row w-50 mx-auto mt-4  mb-2 p-2 posts border border-4"
              onClick={(e) => this.handledPosts(e)}
            >
              {/* User profile image */}
              <div className="row row-profile-pic align-items-center">
                <div className="col-sm-1">
                  <img
                    className="profile-img-post rounded-circle go-to-profile"
                    id={`id_img_prof_post${post.id}`}
                    src={post.profile?.picture}
                    alt={post.profile?.picture}
                    onClick={(e) => this.goToProfile(e)}
                  />
                </div>

                {/* User profile name */}
                <div className="col-sm">
                  <h5
                    className="h5 go-to-profile"
                    onClick={(e) => this.goToProfile(e)}
                  >
                    {post.profile?.user?.username}
                  </h5>
                </div>

                {/* Created */}
                <div className="post-created">
                  <p className="h6 pt-1 px-1 text-black-50">
                    Created: {post.created}
                  </p>
                </div>
              </div>

              {/* Post img */}
              <div className="">
                <img
                  className="w-100 rounded-top img-post"
                  src={this.post_img}
                  alt={this.post_img}
                />

                {/* Like | comment | share | save post */}
                <div className="feedback">
                  {/* Like */}
                  <BsFillHeartFill
                    className="icon-size-post"
                    id={`id_like_post_${post.id}`}
                  />

                  {/* Comment */}
                  <BsFillChatFill
                    className="icon-size-post"
                    onClick={(e) => {
                      let a = inputComment(e.target.parentElement.id);
                      e.nativeEvent.path[4].appendChild(a);
                    }}
                    id={`id_comments_post_${post.id}`}
                  />

                  {/* Share */}
                  <BsShareFill
                    className="icon-size-post"
                    id={`id_share_post_${post.id}`}
                  />

                  {/* Save post */}
                  <BsFillBookmarkFill
                    className="icon-size-post"
                    id={`id_save_post_${post.id}`}
                  />
                </div>

                {/* Likes count */}
                <div>
                  <span
                    className="text-end fs-6 likes"
                    id={`id_show_likes_${post.id}`}
                  >
                    {post?.likes} Likes
                  </span>
                </div>

                {/* Description */}
                <div className="mt-2">
                  <p className="fs-6">
                    <span className="h6 me-2">{post.description}</span>
                  </p>
                </div>

                {/* Comments */}
                <div>
                  <button
                    className="btn btn-outline-info"
                    id={`id_btn_cmt_${post.id}`}
                    onClick={(e) => {
                      this.commentComponent(e);
                    }}
                  >
                    Show comments...
                  </button>
                  <div className="" id={`id_show_comments_${post.id}`}>
                    {post.id === this.state?.comments[0]?.post
                      ? this.state?.comments.map((value) => {
                          if (value?.created) {
                            this.created = value?.created.slice(0, 10);
                          }
                          return (
                            <div
                              className="row-profile-pic align-items-center mt-2 p-2 rounded border border-1"
                              key={value?.id}
                            >
                              <div>
                                <img
                                  className="profile-img-comment rounded-circle go-to-profile"
                                  id={`id_image_prof_comment_${value?.id}`}
                                  src={value?.commented_by?.picture}
                                  alt={value?.commented_by?.user?.username}
                                  onClick={(e) => {
                                    this.goToProfileComment(e);
                                  }}
                                />
                              </div>

                              <div className="username">
                                <h6
                                  className="h5 go-to-profile"
                                  onClick={(e) => {
                                    this.goToProfileComment(e);
                                  }}
                                >
                                  {value?.commented_by?.user?.username}{" "}
                                  <span>:</span>
                                </h6>
                              </div>
                              <div className="comment-container">
                                <p className="fs-comment">{value?.comment}</p>
                                <div>
                                  <span className="fs-6 text-black-50">
                                    {this.created}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    );
  }
}

export { ListPosts };
