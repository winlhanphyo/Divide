import { Router } from "../../custom-router";
import { contactController } from "../../../controllers/contact";

const router = new Router();

router.post('/', contactController.postMessage);

export const contactRouter = router;
