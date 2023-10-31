import { Router } from "../../custom-router";
import { orderController } from "../../../controllers/order";

const router = new Router();

router.get('/', orderController.getAllOrder);
router.post('/', orderController.createOrder);
router.get('/:id', orderController.detailOrder);
router.post('/update/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

export const orderRouter = router;
