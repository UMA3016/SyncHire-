const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getChatRoom, uploadChatFile } = require('../controllers/chatController');
const multer = require('multer');
const path = require('path');

// Multer storage for chat files
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `chat-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

router.get('/:applicationId', authMiddleware, getChatRoom);
router.post('/upload', authMiddleware, upload.single('chatFile'), uploadChatFile);

module.exports = router;
