import { Router } from "express";
import { getCars, getUserData, loginUser, registerUser } from "../controllers/userController";
import { protect } from "../middleware/auth.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUserData);
userRouter.get("/cars", getCars);

export default userRouter;
