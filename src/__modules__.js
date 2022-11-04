// Import components
import { HeadMenu } from "./apps/base/HeadMenu";
import { ListPosts } from "./apps/posts/ListPosts";
import { Login } from "./apps/users/Login";
import { EditProfile } from "./apps/users/EditProfile";
import { Profile } from "./apps/users/Profile";
import { CreateUser } from "./apps/users/CreateUser";
import { VerifyToken } from "./apps/users/VerifyToken";
import { CreatePost } from "./apps/posts/CreatePost";

// Import utils
import {
  addInvalidUpdate,
  addInvalidRegister,
  addInvalidToken,
} from "./utils/users/profile";

import axios from "axios";

/**
 * Axios instance
 * Parameters by default:
 * - baseURL: http://localhost:8000/,
 * - headers: "Content-Type": "application/json; charset=utf-8",
 */
const lg_api = axios.create({
  baseURL: "http://localhost:8000/",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});

// Export Axios instance
export { lg_api };

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
  VerifyToken,

  // Post app
  CreatePost,
};

// Export utils
export { addInvalidUpdate, addInvalidRegister, addInvalidToken };
