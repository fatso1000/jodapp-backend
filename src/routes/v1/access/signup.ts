import { Router } from "express";
import Repo from "./repo";

const router = Router();

router.post("/basic", Repo.signupSchema, Repo.signup);

export default router;
