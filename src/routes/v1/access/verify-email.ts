import { Router } from "express";
import Repo from "./repo";

const router = Router();

router.post("/basic", Repo.verifyEmailSchema, Repo.verifyEmail);

export default router;
