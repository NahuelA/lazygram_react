import { BrowserRouter, Routes, Route, redirect } from "react-router-dom";

import React from "react";

const PrivateRoute = ({ children, ...args }) => {
  const auth = false;

  return (
    <BrowserRouter>
      <Routes>
        <Route {...args}>{!auth ? redirect("/login") : children} </Route>
      </Routes>
    </BrowserRouter>
  );
};

export { PrivateRoute };
