import express from "express";
import { getUsers, getUserById, createUser, deleteUser, updateUser } from "../application/user.js";

const userRouter = express.Router();

userRouter.get("/" , getUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", createUser);
userRouter.delete("/:id", deleteUser);
userRouter.put("/:id", updateUser);

export default userRouter;