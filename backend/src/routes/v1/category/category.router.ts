import { Router } from "../../custom-router";
import { categoryController } from "../../../controllers/category";

const router = new Router();

router.get('/', categoryController.getAllCategory);
router.post('/', categoryController.createCategory);
router.get('/:id', categoryController.detailCategory);
router.post('/update/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export const categoryRouter = router;
