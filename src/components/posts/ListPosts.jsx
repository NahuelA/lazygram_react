/* List posts from lazygram with react */

import { lgApi } from "../../__modules__";
import "../../css/posts/ListPosts.css";
import React, { useContext, useEffect, useState } from "react";
import {
  BsFillHeartFill,
  BsFillChatFill,
  BsFillBookmarkFill,
  BsShareFill,
} from "react-icons/bs";
import "../../css/Margin.css";

import { likePost, inputComment } from "../../utils/posts/posts";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router";
import axios from "axios";

const ListPosts = () => {
  const { accessToken } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const navigation = useNavigate();
  const httpMedia = "http://localhost:8000/media/";

  let picture;
  let profilePictureNull;

  const handledPosts = (e) => {
    likePost(e, accessToken);
  };

  const commentComponent = (e) => {
    let len = e.target.id.split("").length;
    let id = e.target.id.slice(11, len);

    lgApi(`comments/`, {
      headers: {
        Authorization: "Bearer " + String(accessToken),
      },
      params: { id_post: id },
    })
      .then((res) => {
        setComments(res.data.results);
      })
      .catch((err) => {
        console.error(err.response);
      });
  };

  /**
   * Redirect to the desired profile.
   * @param {*} post
   */
  const goToProfileComment = (e) => {
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
    navigation(`profile/${profile}`);
  };

  /**
   *
   * @param {*} e
   * @returns
   */
  const goToProfile = (e) => {
    // Getting profile name
    let profile;
    if (e.target.id.startsWith("id_img_prof_post")) {
      profile = e.nativeEvent.path[1].nextSibling.childNodes[0].innerText;
    } else {
      profile = e.target.innerText;
    }
    // set in localStorage the profile name
    window.localStorage.setItem("profile", profile);
    navigation(`profile/${profile}`);
  };

  /**
   *
   * @param {*} post
   */

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    lgApi("posts/", {
      headers: {
        Authorization: "Bearer " + String(accessToken),
      },
    })
      .then((res) => {
        setPosts(res.data.results);
      })
      .catch((err) => {
        console.error(err.response.data);
      });

    return () => {
      cancelToken.cancel();
    };
  }, [accessToken]);

  return (
    <section className="mt-3">
      {posts?.map((post, i) => {
        // If post image not contains http_media, add.
        if (!String(post.picture).startsWith(httpMedia)) {
          picture = httpMedia + post.picture;
        } else {
          picture = post.picture;
        }

        // If picture is null, show default profile picture
        profilePictureNull =
          post?.profile?.picture !== null
            ? post?.profile?.picture
            : httpMedia + "user_circle.svg";

        let profilePictureCommentNull;

        return (
          <div
            key={i}
            id={post.id}
            className="row w-50 mx-auto mt-4  mb-2 p-2 posts border border-4"
            onClick={(e) => handledPosts(e)}
          >
            {/* User profile image */}
            <div className="row row-profile-pic align-items-center">
              <div className="col-sm-1">
                <img
                  className="profile-img-post rounded-circle go-to-profile"
                  id={`id_img_prof_post${post.id}`}
                  src={profilePictureNull}
                  alt={post.profile?.user?.username}
                  onClick={(e) => goToProfile(e)}
                />
              </div>

              {/* User profile name */}
              <div className="col-sm">
                <h5
                  className="h5 go-to-profile"
                  onClick={(e) => goToProfile(e)}
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
                src={picture}
                alt={picture}
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
                    let a = inputComment(
                      e.target.parentElement.id,
                      accessToken
                    );
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
                  onClick={async (e) => {
                    let id = e.target.parentNode.id.split("_");
                    await lgApi(
                      `saved_posts/${window.localStorage.getItem(
                        "profile_auth"
                      )}/`,
                      {
                        method: "put",
                        headers: {
                          Authorization: "Bearer " + String(accessToken),
                        },
                        data: {
                          saved_post: id[3],
                        },
                      }
                    )
                      .then((res) => {})
                      .catch((err) => {
                        console.error(err.response);
                      });
                  }}
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
                    commentComponent(e);
                  }}
                >
                  Show comments...
                </button>
                <div className="" id={`id_show_comments_${post.id}`}>
                  {post?.id === comments[0]?.post
                    ? comments?.map((value) => {
                        // If post image not contains http_media, add.
                        if (value?.commented_by?.picture === null) {
                          profilePictureCommentNull =
                            httpMedia + "user_circle.svg";
                        } else {
                          profilePictureCommentNull =
                            value?.commented_by?.picture;
                        }
                        return (
                          <div
                            className="row-profile-pic align-items-center mt-2 p-2 rounded border border-1"
                            key={value?.id}
                          >
                            <div>
                              <img
                                className={
                                  value?.commented_by?.picture === null
                                    ? "profile-img-comment rounded-circle go-to-profile"
                                    : "profile-img-comment rounded-circle go-to-profile scale-down"
                                }
                                id={`id_image_prof_comment_${value?.id}`}
                                src={profilePictureCommentNull}
                                alt={value?.commented_by?.user?.username}
                                onClick={(e) => {
                                  goToProfileComment(e);
                                }}
                              />
                            </div>

                            <div className="username">
                              <h6
                                className="h5 go-to-profile"
                                onClick={(e) => {
                                  goToProfileComment(e);
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
                                  {value?.created.slice(0, 10)}
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
};

export { ListPosts };

/* 



*/
