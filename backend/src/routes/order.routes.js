import {Router} from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { createCartOrder } from "../controllers/order.controller";

const orderRouter=Router();



export default orderRouter;