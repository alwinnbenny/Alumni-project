import express from "express";
import cors from "cors";
import { adminRouter } from "./Routes/AdminRoutes.js";
import dotenv from "dotenv";
import path from 'path';
dotenv.config();
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'https://alumni-client.vercel.app'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
}));

// Handle preflight requests
app.options('*', cors({
    origin: ['http://localhost:5173', 'https://alumni-client.vercel.app'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
}));

app.use(express.json());


app.get("/", (req, res) => {
    res.send("Hello from Alumni Server!");
});

app.use("/auth", adminRouter);
app.use('/Public', express.static('Public'));
app.use('/avatar', express.static('Public/avatar'));
app.use('/avatar', express.static(path.join(process.cwd(), 'Public/avatar')));
app.use("/uploads", express.static("uploads"));
app.use('/images', express.static(path.join(__dirname, 'public/Images')));


const PORT = process.env.DB_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
