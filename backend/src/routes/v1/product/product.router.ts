import { Router } from "../../custom-router";
import { productController } from "../../../controllers/product";

const router = new Router();

router.get('/top', productController.getTopProduct);
router.get('/category/:id', productController.getProductWithCategoryId);
router.post('/update/:id', productController.updateProduct);
router.get('/:id', productController.detailProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/', productController.getAllProduct);
router.post('/', productController.createProduct);

// router.post('/:id/support', postController.support);
// router.get('/top/video/:id/random', postController.userRandomTopVideoList);
// router.get('/video/list', postController.userVideoList);
// router.get('/:id/video/like', postController.likeVideo);
// router.get('/:id/video/view', postController.viewVideo);
// router.get('/:id/video/unlike', postController.unLikeVideo);

export const productRouter = router;
