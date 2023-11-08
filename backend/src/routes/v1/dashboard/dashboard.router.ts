import { Router } from "../../custom-router";
import { dashboardController } from "../../../controllers/dashboard";

const router = new Router();

router.get('/', dashboardController.getDashboardData);

export const dashboardRouter = router;
