import { Router } from "express";
import Repo from "./repo";

const router = Router()

router.post("/basic", Repo.loginSchema, Repo.login);

export default router;