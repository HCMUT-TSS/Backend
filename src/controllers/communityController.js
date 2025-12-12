// controllers/communityController.js – ĐÃ HOÀN HẢO
import prisma from "../config/db.js";

// LẤY DANH SÁCH LỚP HỌC (CHO CẢ STUDENT & TUTOR)
export const getSessionClasses = async (req, res) => {
  try {
    const schedules = await prisma.schedule.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        dayOfWeek: true,
        startTime: true,
        endTime: true,
        location: true,
        meetLink: true,
        tutor: { select: { user: { select: { name: true } } } },
      },
    });

    const classes = schedules.map(s => ({
      id: s.id,
      title: s.title || 'Buổi tư vấn 1:1',
      tutorName: s.tutor.user.name,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      location: s.location,
      meetLink: s.meetLink,
    }));

    res.json({ classes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi tải lớp học" });
  }
};

// TẠO BÀI VIẾT
export const createPost = async (req, res) => {
  const { sessionId, title, content } = req.body;
  const authorId = req.user.id;

  try {
    const post = await prisma.post.create({
      data: { sessionId: Number(sessionId), authorId, title, content },
    });
    res.status(201).json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi tạo bài viết" });
  }
};

// TẠO BÌNH LUẬN
export const createComment = async (req, res) => {
  const { postId, content } = req.body;
  const authorId = req.user.id;

  try {
    const comment = await prisma.comment.create({
      data: { postId: Number(postId), authorId, content },
    });
    res.status(201).json({ comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi thêm bình luận" });
  }
};

// LẤY BÀI VIẾT + BÌNH LUẬN CỦA 1 LỚP
export const getClassPosts = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: { sessionId: Number(sessionId) },
      include: {
        author: { select: { name: true } },
        comments: {
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi tải bài viết" });
  }
};