import React from "react";
import "../../css/Main.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";

import {
  HeadMenu,
  ListPosts,
  Profile,
  Login,
  EditProfile,
  CreateUser,
  CreatePost,
  PrivateRoute,
} from "../../__modules__";

const App = () => {
  return (
    <main>
      <AuthProvider>
        {/* Routes */}
        <HeadMenu />

        <Routes>
          {/* Register */}
          <Route path="/register" element={<CreateUser />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute />}>
            {/* Header */}

            {/* Profile */}
            <Route path="/profile/:username" element={<Profile />}>
              {/* Nested edit profile */}
              <Route path="edit" element={<EditProfile />} />
            </Route>

            {/* New post */}
            <Route path="/new-post" element={<CreatePost />} />

            {/* Home */}
            <Route path="/" element={<ListPosts />} />

            {/* Not fount, redirect to home */}
            <Route path="*" element={<ListPosts />} />
          </Route>
        </Routes>
      </AuthProvider>
    </main>
  );
};
export { App };
