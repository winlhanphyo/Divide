import express from "express";
import { videoStreamController } from "../../controllers/videoStream";

const router = express.Router();

router.get('/:filename/stream', videoStreamController.streamVideo);

export default router;
