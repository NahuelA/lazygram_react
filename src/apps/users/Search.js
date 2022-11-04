import React from "react";
import { lg_api } from "../../__modules__";

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      profiles: [],
      search_profile: document.querySelector("#search-input").value,
    };
    this.token = window.localStorage.getItem("token");
  }

  componentDidMount() {
    console.log(this.state?.search_profile);
    lg_api("accounts/profile", {
      headers: {
        Authorization: `Token ${this.token}`,
      },
      params: {
        search_profile: this.state?.search_profile,
      },
    }).then((res) => {
      this.setState({ profiles: res.data.results });
      this.setState({
        search_profile: document.querySelector("#search-input"),
      });
    });
  }
  render() {
    return this.state?.profiles?.map((value) => {
      return (
        <React.Fragment key={value?.id}>
          <div className="grapper-searchs border border-2 rounded-3 mt-2">
            <div>
              <img
                src={value?.picture}
                alt={value?.user?.username}
                className="go-to-profile rounded-circle profile-img-comment"
                id={`id_picture_search_${value?.id}`}
              />
            </div>
            <div>
              <span
                className="h5 go-to-profile"
                id={`id_username_search_${value?.id}`}
              >
                {value?.user?.username}
              </span>
            </div>
          </div>
        </React.Fragment>
      );
    });
  }
}

export { Search };
