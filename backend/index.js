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
import db from "./utils/db.js"; // ✅ correct path
 // <-- import your DB connection

// Profile route

app.get("/profile/:userId", (req, res) => {
  const userId = req.params.userId;

//   const sql = `
//     SELECT u.id AS user_id, u.name AS user_name, u.email AS user_email,
//            a.id AS alumni_id, a.name AS alumni_name, a.course_id, a.batch,
//            a.gender, a.connected_to, a.avatar
//     FROM users u
//     LEFT JOIN alumni_accounts a ON u.id = a.user_id
//     WHERE u.id = ?
//   `;
const sql = `
    SELECT u.id as user_id, u.name as username, u.email as user_email, 
           a.id as alumni_id, a.name as alumni_name, a.course_id, a.connected_to, a.phone,a.linkedin_url, u.status,a.company_url,a.current_location,  
           a.gender, a.batch, a.avatar, c.course
    FROM users u
    LEFT JOIN alumni_accounts a ON u.id = a.user_id
    LEFT JOIN courses c ON c.id = a.course_id
    WHERE u.id = ?
  `;


  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching profile:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(result[0]);
  });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
