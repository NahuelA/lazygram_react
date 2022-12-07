/* Profile view */

import { lgApi } from "../../__modules__";
import "../../css/users/Profile.css";
import { useParams } from "react-router";
import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const Profile = () => {
  /* STATES */
  // For cancel load request
  const cancelToken = axios.CancelToken.source();
  // Profile
  const [profile, setProfile] = useState([]);
  // Posts from current profile
  const [posts, setPosts] = useState([]);
  // Followers and followings
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

  // Edit or follow btn
  const [editOrFollowBtn, setEditOrFollowBtn] = useState("Edit profile");
  // Edit or follow htmlClass
  const [editOrFollowClass, setEditOrFollowClass] = useState(
    "ml-5 btn btn-sm btn-outline-info"
  );

  // Follow or Unfollow btn
  const [followOrUnfollow, setFollowOrUnfollow] = useState("Follow");
  // Follow or Unfollow htmlClass
  const [followClass, setFollowClass] = useState("ml-5 btn btn-primary");

  // Params from url
  const kwargUsername = useParams();
  const profile_auth = window.localStorage.getItem("profile_auth");

  // Context
  const { accessToken } = useContext(AuthContext);

  // If picture is null, show default profile picture
  const picture =
    profile[0]?.picture !== null
      ? profile[0]?.picture
      : "http://localhost:8000/media/user_circle.svg";

  /**
   * If a profile is followed, change followOrUnfollow state to "Follow" or "Unfollow"
   */
  const isFollowed = async () => {
    await lgApi(`accounts/isfollowed/${profile_auth}`, {
      method: "get",
      headers: {
        Authorization: "Bearer " + String(accessToken),
      },
      params: {
        profile_followed: kwargUsername.username,
      },
    })
      .then((res) => {
        if (res.data) {
          setFollowOrUnfollow("Unfollow");
        } else {
          setFollowOrUnfollow("Follow");
        }
      })
      .catch((err) => {
        console.error(err.response);
      });
  };

  /**
   * If is your account profile, edit. Else follow.
   * @param {event} e
   */
  const EditOrFollow = async (e) => {
    if (kwargUsername.username !== profile_auth) {
      isFollowed();

      // Follow
      await lgApi(`accounts/followers/${profile_auth}/`, {
        method: "put",
        headers: {
          Authorization: "Bearer " + String(accessToken),
        },
        data: {
          profile: kwargUsername.username, // Profile that will be followed
          followers: profile_auth, // Authenticated profile will be follow the profile
        },
      })
        .then((res) => {
          setFollowers([res.data]);
        })
        .catch((err) => {
          console.error(err.response);
        });

      // Following
      lgApi(`accounts/followings/${profile_auth}/`, {
        method: "put",
        headers: {
          Authorization: "Bearer " + String(accessToken),
        },
        data: {
          profile: profile_auth,
          following: kwargUsername.username,
        },
      })
        .then((res) => {
          setFollowings([res.data]);
        })
        .catch((err) => {
          console.error(err.response);
        });
    }
  };

  useEffect(() => {
    // Get own profile
    lgApi(`accounts/profiles/${kwargUsername.username}`, {
      headers: {
        Authorization: "Bearer " + String(accessToken),
      },
    }).then((res) => {
      setProfile([res.data.results[0]]);
    });

    return () => {
      cancelToken.cancel();
    };
  }, [accessToken, kwargUsername.username]);

  useEffect(() => {
    // Get followers
    lgApi(`accounts/followers/${kwargUsername.username}`, {
      headers: {
        Authorization: "Bearer " + String(accessToken),
      },
    }).then((res) => {
      setFollowers([res.data]);
    });

    // Get following
    lgApi(`accounts/followings/${kwargUsername.username}`, {
      headers: {
        Authorization: "Bearer " + String(accessToken),
      },
    }).then((res) => {
      setFollowings([res.data]);
    });

    return () => {
      cancelToken.cancel();
    };
  }, [accessToken, kwargUsername.username]);

  useEffect(() => {
    // Own posts
    lgApi("posts/", {
      headers: {
        Authorization: "Bearer " + String(accessToken),
      },
      params: {
        own_post: kwargUsername.username,
      },
    })
      .then((res) => {
        setPosts([res.data.results]);
      })
      .catch((err) => {
        console.error(err.response.data);
      });

    return () => {
      cancelToken.cancel();
    };
  }, [accessToken, kwargUsername.username]);

  return (
    <main>
      <div className="container mb-3">
        <div className="row">
          <div className="col-sm-4 d-flex justify-content-center">
            <img
              src={picture}
              alt={profile[0]?.user?.username}
              className="rounded-circle picture-profile"
              width="170px"
              height="170px"
            />
          </div>

          <div className="col-sm-8">
            <h2 className="username-h2">
              {profile[0]?.user?.username}
              <span
                className={editOrFollowClass}
                onClick={() => EditOrFollow()}
              >
                {editOrFollowBtn}
              </span>
            </h2>

            <div className="row mt-2 info-profile">
              <div className="col-sm-4">
                <b>{profile[0]?.posts_count}</b> posts
              </div>
              <div className="col-sm-4">
                <b>{followers[0]?.followers_length}</b> followers
              </div>
              <div className="col-sm-4">
                <b>{followings[0]?.following_length}</b> following
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-sm-12">
                <p>{profile[0]?.biography}</p>
              </div>
              <div className="col-sm-12">
                <p>Website: {profile[0]?.website}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="own-posts">
        {posts[0]?.map((value) => {
          return (
            <div className="m-2 rounded own-posts-posts" key={value?.id}>
              <Link to={`profile/${kwargUsername.username}/post/${value?.id}`}>
                <div className="img-posts-container">
                  <img
                    src={value?.picture}
                    alt={value?.profile?.user?.username}
                    className="img-own-post rounded border"
                  />
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
};
export { Profile };
