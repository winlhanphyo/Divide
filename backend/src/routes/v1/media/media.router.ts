import { Router } from "../../custom-router";
import { mediaController } from "../../../controllers/media";

const router = new Router();


router.get('/product/:id', mediaController.getMediaWithProductId);
router.get('/:filename/stream/', mediaController.streamMedia);
router.get('/:id/download', mediaController.downloadMedia);
router.get('/:id', mediaController.detailMedia);
router.post('/:id', mediaController.changeMedia);
router.post('/', mediaController.createMedia);
router.get('/', mediaController.getAllMedia);

router.delete('/:id', mediaController.deleteMedia);

export const mediaRouter = router;
