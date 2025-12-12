// routes/community.js – PHIÊN BẢN HOÀN HẢO, KHÔNG CÒN LỖI
import express from 'express';
import { protect } from '../middlewares/auth.js';
import { 
  getSessionClasses, 
  createPost, 
  createComment, 
  getClassPosts 
} from '../controllers/communityController.js';

const router = express.Router();
router.use(protect);

// LẤY DANH SÁCH LỚP HỌC
router.get('/sessions', getSessionClasses);

// TẠO BÀI VIẾT
router.post('/posts', createPost);

// TẠO BÌNH LUẬN
router.post('/comments', createComment);

// LẤY BÀI VIẾT + BÌNH LUẬN CỦA 1 LỚP
router.get('/posts/:sessionId', getClassPosts);

export default router;