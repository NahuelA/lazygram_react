import React from "react";
import "../../css/posts/ListPosts.css";

function ShowSearchProfiles(props) {
  return (
    <div className="grapper-search-prof">
      <div className="row-profile-pic-search  pt-2">

        <img
          src={props.picture}
          alt={props.username}
          onClick={(e) => {
            console.log(e);
          }}
          className="profile-img-comment rounded-circle go-to-profile"
        />
      </div>

        <span
          className="h5 go-to-profile"
          onClick={(e) => {
            console.log(e);
          }}
        >
          {props.username}
        </span>
    </div>
  );
}

export { ShowSearchProfiles };
