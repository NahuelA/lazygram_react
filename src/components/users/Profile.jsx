/* Profile view */

import { lgApi } from "../../__modules__";
import "../../css/users/Profile.css";
import { BsFillBookmarkFill, BsFillGrid3X3GapFill } from "react-icons/bs";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import "../../css/Margin.css";

const Profile = () => {
  /* STATES */
  // Profile
  const [profile, setProfile] = useState([]);
  // Posts from current profile
  const [posts, setPosts] = useState([]);
  // Followers and followings
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

  // Edit or follow btn
  const [editOrFollowBtn, setEditOrFollowBtn] = useState("Follow");
  const authProfile = window.localStorage.getItem("profile_auth");

  // Edit or follow className
  const [editOrFollowClass, setEditOrFollowClass] = useState(
    "ml-5 btn btn-sm btn-primary"
  );

  // Params from url
  const kwargUsername = useParams();

  // Context
  const { accessToken } = useContext(AuthContext);

  // If picture is null, show default profile picture
  const picture =
    profile?.picture !== null
      ? profile?.picture
      : "http://localhost:8000/media/user_circle.svg";

  /**
   * Fetch to profile
   */
  const getProfile = async () => {
    // Get own profile
    await lgApi(`accounts/profiles/${kwargUsername.username}`, {
      headers: {
        Authorization: "Bearer " + String(accessToken),
      },
    }).then((res) => {
      setProfile(res.data);
    });
  };

  /**
   * If a profile is followed, change followOrUnfollow state to "Follow" or "Unfollow"
   */
  const isFollowed = async () => {
    await lgApi(`accounts/isfollowed/${authProfile}`, {
      method: "get",
      headers: {
        Authorization: "Bearer " + String(accessToken),
      },
      params: {
        myprofile: kwargUsername.username,
      },
    })
      .then((res) => {
        if (res.data) {
          setEditOrFollowBtn("Unfollow");
          setEditOrFollowClass("ml-5 btn btn-sm btn-info");
        } else {
          setEditOrFollowBtn("Follow");
        }
      })
      .catch((err) => {
        console.error(err.response);
      });
  };

  /**
   * If is your account profile, edit. Else follow.
   */
  const EditOrFollow = async () => {
    // Follow
    await lgApi(`accounts/followers/${authProfile}/`, {
      method: "put",
      headers: {
        Authorization: "Bearer " + String(accessToken),
      },
      data: {
        profile: kwargUsername.username, // Profile that will be followed
        followers: authProfile, // Authenticated profile will be follow the profile
      },
    })
      .then((res) => {
        setFollowers([res.data]);
      })
      .catch((err) => {
        console.error(err.response);
      });

    // Following
    await lgApi(`accounts/followings/${authProfile}/`, {
      method: "put",
      headers: {
        Authorization: "Bearer " + String(accessToken),
      },
      data: {
        profile: authProfile,
        following: kwargUsername.username,
      },
    })
      .then((res) => {
        setFollowings([res.data]);
      })
      .catch((err) => {
        console.error(err.response);
      });
  };

  // Fetch profile
  useEffect(() => {
    // For cancel load request
    const cancelToken = axios.CancelToken.source();
    getProfile();
    return () => {
      cancelToken.cancel();
    };
  }, [accessToken, kwargUsername.username]);

  //Fetch followers and followings
  useEffect(() => {
    // For cancel load request
    const cancelToken = axios.CancelToken.source();

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
      setFollowings(res.data);
    });

    return () => {
      cancelToken.cancel();
    };
  }, [accessToken, kwargUsername.username]);

  // Fetch profile posts
  useEffect(() => {
    // For cancel load request
    const cancelToken = axios.CancelToken.source();

    lgApi(`profile-posts/${kwargUsername.username}`, {
      headers: {
        Authorization: "Bearer " + String(accessToken),
      },
    })
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      cancelToken.cancel();
    };
  }, [accessToken, kwargUsername.username]);

  // Set follow or edit profile
  useEffect(() => {
    let cancelToken = axios.CancelToken.source();

    if (profile?.user?.username === authProfile) {
      setEditOrFollowBtn("Edit profile");
      setEditOrFollowClass("ml-5 btn btn-sm btn-outline-info");
    } else {
      isFollowed();
    }

    return () => {
      cancelToken.cancel();
    };
  }, [profile, authProfile, accessToken, kwargUsername.username, isFollowed]);

  return (
    <main>
      <div className="container mb-3 mt-3">
        <div className="row">
          <div className="col-sm-4 d-flex justify-content-center">
            <img
              src={picture}
              alt={profile?.user?.username}
              className="rounded-circle picture-profile"
              width="170px"
              height="170px"
            />
          </div>

          <div className="col-sm-8">
            <h2 className="username-h2">
              {profile?.user?.username}

              {/* Edit or follow */}
              {profile?.user?.username === authProfile ? (
                <Link to={`edit`} relative="path">
                  <span className={editOrFollowClass}>{editOrFollowBtn}</span>
                </Link>
              ) : (
                <span
                  className={editOrFollowClass}
                  onClick={() => {
                    EditOrFollow();
                  }}
                >
                  {editOrFollowBtn}
                </span>
              )}
            </h2>

            <div className="row mt-2 info-profile">
              <div className="col-sm-4">
                <b>{profile?.posts_count}</b> posts
              </div>
              <div className="col-sm-4">
                <b>{followers?.followers_length}</b> followers
              </div>
              <div className="col-sm-4">
                <b>{followings?.following_length}</b> following
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
      <div className="show-posts">
        <span>
          <BsFillGrid3X3GapFill
            className="icons-posts"
            onClick={(e) => {
              lgApi(`profile-posts/${kwargUsername.username}`, {
                headers: {
                  Authorization: "Bearer " + String(accessToken),
                },
              })
                .then((res) => {
                  setPosts(res.data);
                })
                .catch((err) => {
                  console.error(err);
                });
            }}
          />
        </span>
        <span>
          <BsFillBookmarkFill
            className="icons-posts"
            onClick={async (e) => {
              await lgApi(`saved_posts/${authProfile}`, {
                headers: {
                  Authorization: "Bearer " + String(accessToken),
                },
              })
                .then((res) => {
                  setPosts(res.data.saved_post);
                })
                .catch((err) => {
                  console.error(err);
                });
            }}
          />
        </span>
      </div>
      <div className="own-posts">
        {posts?.map((value) => {
          return (
            <div className="m-2 rounded own-posts-posts" key={value?.id}>
              <Link to={`post/${value?.id}`}>
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
