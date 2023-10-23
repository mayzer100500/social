import { } from 'dotenv/config'
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import likeRoutes from './routes/likes.js'
import commentRoutes from './routes/comments.js'
import authRoutes from './routes/auth.js'
import relationshipsRoutes from './routes/relationships.js'
import storiesRoutes from './routes/stories.js'

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    console.log(req.path, req.body, req.method, req.socket.remoteAddress)
    next()
})
app.use(cors({
    origin: `${process.env.CORS_ORIGIN}`
}))
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({ storage: storage })

app.use("/api/upload/", upload.single("file"), (req, res) => {
    const file = req.file
    res.status(200).json(file.filename)
})
app.use("/api/auth/", authRoutes);
app.use("/api/users/", userRoutes);
app.use("/api/posts/", postRoutes);
app.use("/api/likes/", likeRoutes);
app.use("/api/comments/", commentRoutes);
app.use("/api/relationships/", relationshipsRoutes);
app.use("/api/stories/", storiesRoutes);

app.listen(PORT, () => {
    console.log(`API working on port ${PORT}!`);
})