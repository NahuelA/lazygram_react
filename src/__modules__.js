// Import components
import { HeadMenu } from "./components/base/HeadMenu";
import { ListPosts } from "./components/posts/ListPosts";
import { Login } from "./components/users/Login";
import { EditProfile } from "./components/users/EditProfile";
import { Profile } from "./components/users/Profile";
import { CreateUser } from "./components/users/CreateUser";
import { CreatePost } from "./components/posts/CreatePost";
import { PrivateRoute } from "./components/base/PrivateRoute";
import { ActivateAccount } from "./components/users/ActivateAccount";
import { ForgotPassword } from "./components/users/ForgotPassword";
import { ForgotPasswordValidation } from "./components/users/ForgotPasswordValidation";
import { SetNewPassword } from "./components/users/SetNewPassword";

// Import axios
import axios from "axios";

// Import utils
import {
  addInvalidUpdate,
  addInvalidRegister,
  addInvalidToken,
} from "./utils/users/profile";

// Host
const apiHost = "http://localhost:8000/";
const frontHost = "http://localhost:3000/";

/**
 * Axios instance
 * Parameters by default:
 * - baseURL: http://localhost:8000/,
 * - headers: "Content-Type": "application/json; charset=utf-8",
 */
const lgApi = axios.create({
  baseURL: apiHost,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});

// Export Axios instance
export { lgApi };
// Export host
export { apiHost, frontHost };

// Export components
export {
  // General
  HeadMenu,

  // User app
  ListPosts,
  Login,
  Profile,
  EditProfile,
  CreateUser,
  ActivateAccount,
  // Post app
  CreatePost,
  // Private route
  PrivateRoute,
  //Forgot pass
  ForgotPassword,
  // Forgot pass validation
  ForgotPasswordValidation,
  // Set new password
  SetNewPassword,
};

// Export utils
export { addInvalidUpdate, addInvalidRegister, addInvalidToken };
