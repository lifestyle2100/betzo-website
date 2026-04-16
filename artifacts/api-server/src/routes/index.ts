import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sportsRouter from "./sports";
import casinoRouter from "./casino";
import authRouter from "./auth";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(sportsRouter);
router.use(casinoRouter);
router.use(adminRouter);

export default router;
