import { Router } from "../../custom-router";
import { userController } from "../../../controllers/user";

const router = new Router();

router.get('/', userController.getAllUser);
router.get('/:id', userController.detailUser);
router.post('/update/:id', userController.updateUser);
router.post('/password-change/:id', userController.passwordChange);
router.delete('/:id', userController.deleteUser);
router.post('/', userController.createUser);

export const userRouter = router;
