import React, { useContext } from "react";
import "../../css/Main.css";
import { Routes, Route } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

import {
  HeadMenu,
  ListPosts,
  Profile,
  Login,
  EditProfile,
  CreateUser,
  ActivateAccount,
  CreatePost,
  PrivateRoute,
  ForgotPassword,
  ForgotPasswordValidation,
  SetNewPassword,
} from "../../__modules__";
import { PostDetail } from "../posts/PostDetail";

const App = () => {
  const { accessToken } = useContext(AuthContext);

  return (
    <main>
      {/* Header */}
      {accessToken ? <HeadMenu /> : ""}

      <Routes>
        {/* Register */}
        <Route path="/register" element={<CreateUser />} />

        {/* Active account */}
        <Route path="/activate-account" element={<ActivateAccount />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Forgot password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Forgot password validation */}
        <Route
          path="/forgot-password-validation"
          element={<ForgotPasswordValidation />}
        />

        {/* Set new password */}
        <Route path="/set-new-password" element={<SetNewPassword />} />

        <Route element={<PrivateRoute />}>
          {/* Header */}

          {/* Profile */}
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/profile/:username/edit" element={<EditProfile />} />
          <Route path="/profile/:username/post/:id" element={<PostDetail />} />

          {/* New post */}
          <Route path="/new-post" element={<CreatePost />} />

          {/* Home */}
          <Route path="/" element={<ListPosts />} />

          {/* Not fount, redirect to home */}
          <Route path="*" element={<ListPosts />} />
        </Route>
      </Routes>
    </main>
  );
};
export { App };
