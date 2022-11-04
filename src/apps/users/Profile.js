/* Login view from lazygram in react */

import { lg_api } from "../../__modules__";
import "../../css/users/Profile.css";
import React from "react";

class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      profile: [],
      posts: [],
      followers: [],
      following: [],
      follNotFoll: false,
      editOrFollowState: "Edit profile",
      btnClassEditOrFollow: "ml-5 btn btn-sm btn-outline-info",
    };
    this.http_media = "http://localhost:8000/media/";
    this.profile_auth = window.localStorage.getItem("profile_auth");
    this.current_profile = window.localStorage.getItem("profile");
    this.token = window.localStorage.getItem("token");
    this.followOrEdit = this.followOrEdit.bind(this);
    this.folOrUnFoll = this.folOrUnFoll.bind(this);
  }

  /**
   * If is your account profile, edit. Else follow.
   * @param {event} e
   */
  followOrEdit(e) {
    let editOrFol = this.state?.editOrFollowState;

    if (editOrFol === "Edit profile") {
      window.location.hash = "#edit-profile";
    }

    if (editOrFol === "Follow" || editOrFol === "Unfollow") {
      // Follow
      lg_api(`accounts/followers/${this.current_profile}/`, {
        method: "put",
        headers: {
          Authorization: `Token ${this.token}`,
        },
        data: {
          profile: this.current_profile,
          followers: this.profile_auth,
        },
      })
        .then((res) => {})
        .catch((err) => {
          console.error(err.response);
        });

      // Following
      lg_api(`accounts/followings/${this.profile_auth}/`, {
        method: "put",
        headers: {
          Authorization: `Token ${this.token}`,
        },
        data: {
          profile: this.profile_auth,
          following: this.current_profile,
        },
      })
        .then((res) => {})
        .catch((err) => {
          console.error(err.response);
        });
    }
  }

  async folOrUnFoll() {
    lg_api(`accounts/isfollowed/${this.profile_auth}`, {
      method: "get",
      headers: {
        Authorization: `Token ${this.token}`,
      },
      params: {
        profile_followed: this.current_profile,
      },
    })
      .then((res) => {
        window.localStorage.setItem("followed", res.data);
      })
      .catch((err) => {
        console.error(err.response);
      });
  }
  componentDidMount() {
    lg_api("accounts/verify-token/", {
      method: "post",
      data: {
        token_related_user: this.current_profile,
      },
      headers: {
        Authorization: `Token ${this.token}`,
      },
    })
      .then((res) => {
        // User token and isFollowed verify.
        if (this.token !== res.data) {
          this.folOrUnFoll();
          let f = window.localStorage.getItem("followed");
          if (f === "false") {
            this.setState({
              btnClassEditOrFollow: "ml-5 btn btn-primary",
              editOrFollowState: "Follow",
            });
          } else {
            this.setState({
              btnClassEditOrFollow: "ml-5 btn btn-outline-primary",
              editOrFollowState: "Unfollow",
            });
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });

    try {
      // Get user
      if (this.current_profile !== null) {
        lg_api(`accounts/profiles/${this.current_profile}`, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        }).then((res) => {
          this.setState({ profile: [res.data] });
        });

        // Own posts
        lg_api("posts/", {
          headers: {
            Authorization: `Token ${this.token}`,
          },
          params: {
            own_post: this.current_profile,
          },
        })
          .then((res) => {
            this.setState({ posts: res.data.results });
          })
          .catch((err) => {
            console.error(err);
          });

        // Get followers
        lg_api(`accounts/followers/${this.current_profile}`, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        }).then((res) => {
          this.setState({ followers: [res.data] });
        });

        // Get following
        lg_api(`accounts/followings/${this.current_profile}`, {
          headers: {
            Authorization: `Token ${this.token}`,
          },
        }).then((res) => {
          this.setState({ following: [res.data] });
        });
      } else {
        if (this.profile_auth !== null) {
          lg_api(`accounts/profiles/${this.profile_auth}`, {
            headers: {
              Authorization: `Token ${this.token}`,
            },
          }).then((res) => {
            this.setState({ profile: [res.data] });
          });

          // Get followers
          lg_api(`accounts/followers/${this.profile_auth}`, {
            headers: {
              Authorization: `Token ${this.token}`,
            },
          }).then((res) => {
            console.log("My followers", res.data);
            this.setState({ followers: [res.data] });
          });

          // Get following
          lg_api(`accounts/followings/${this.profile_auth}`, {
            headers: {
              Authorization: `Token ${this.token}`,
            },
          }).then((res) => {
            this.setState({ following: [res.data] });
          });
        }
      }
    } catch (err) {
      this.setState({ profile: [err] });
    }
  }
  render() {
    let profile = this.state?.profile[0];
    if (profile?.picture === null) {
      profile.picture = "http://localhost:8000/media/user_circle.svg";
    }
    return (
      <main>
        <React.Fragment>
          <div className="container mb-3">
            <div className="row">
              <div className="col-sm-4 d-flex justify-content-center">
                <img
                  src={profile?.picture}
                  alt={profile?.user?.username}
                  className="rounded-circle picture-profile"
                  width="170px"
                  height="170px"
                />
              </div>

              <div className="col-sm-8">
                <h2 className="username-h2">
                  {profile?.user?.username}
                  <span
                    className={this.state?.btnClassEditOrFollow}
                    onClick={(e) => this.followOrEdit(e)}
                  >
                    {this.state?.editOrFollowState}
                  </span>
                </h2>

                <div className="row mt-2 info-profile">
                  <div className="col-sm-4">
                    <b>{profile?.posts_count}</b> posts
                  </div>
                  <div className="col-sm-4">
                    <b>{this.state.followers[0]?.followers_length}</b> followers
                  </div>
                  <div className="col-sm-4">
                    <b>{this.state.following[0]?.following_length}</b> following
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-sm-12">
                    <p>{profile?.biography}</p>
                  </div>
                  <div className="col-sm-12">
                    <p>Website: {profile?.website}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="own-posts">
            {this.state?.posts.map((value) => {
              return (
                <div className="m-2 rounded own-posts-posts" key={value?.id}>
                  <div className="img-posts-container">
                    <img
                      src={value?.picture}
                      alt={value?.profile?.user?.username}
                      className="img-own-post rounded border"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </React.Fragment>
      </main>
    );
  }
}

export { Profile };
