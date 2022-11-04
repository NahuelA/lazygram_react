import React from "react";
import "../../css/Main.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  HeadMenu,
  ListPosts,
  Profile,
  Login,
  EditProfile,
  CreateUser,
  VerifyToken,
  CreatePost,
} from "../../__modules__";
import { Search } from "../users/Search";
import { PrivateRoute } from "../../utils/PrivateRoute";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      hash: "",
    };
    this.actual_hash = window.location.hash;
  }

  componentDidMount() {
    window.addEventListener("hashchange", () => {
      this.setState({ hash: window.location.hash });
    });
  }

  render() {
    return (
      <BrowserRouter>
        <Routes>
          <PrivateRoute component={HeadMenu} path="/" exact />
          <Route component={Login} path="/login" />
        </Routes>
      </BrowserRouter>
    );
  }
}
export { App };
