import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import sendEmail from "../utils/mailer.js";
import { OAuth2Client } from "google-auth-library";
import mysql from 'mysql2';
import crypto from 'crypto';
import sendResetEmail from '../Utils/sendResetEmail.js';
import dotenv from 'dotenv';
dotenv.config(); //This must come before using any process.env variables


//const db = await mysql.createConnection({ /* config */ });


const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'Public/Images');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     }
// });
// const upload = multer({ storage: storage });
// Multer storage configuration for avatar
const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Avatar');
    },
    filename: (req, file, cb) => {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

const avatarUpload = multer({ storage: avatarStorage });

const galleryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const galleryUpload = multer({ storage: galleryStorage });


// app.use(express.static('Public'));

router.post("/login", (req, res) => {
    const sql = "SELECT * from users Where email=?";
    con.query(sql, [req.body.email], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query Error" })
        if (result.length > 0) {
            bcrypt.compare(req.body.password, result[0].password, (bcryptErr, bcryptResult) => {
                if (bcryptErr) return res.json({ loginStatus: false, Error: "Bcrypt Error" });
                if (bcryptResult) {
                    const email = result[0].email;
                    const token = jwt.sign({ role: "admin", email: email }, "jwt_csalumni_key", { expiresIn: "1d" });
                    res.cookie('token', token);
                    return res.json({ loginStatus: true, userType: result[0].type, userId: result[0].id, userName: result[0].name, alumnus_id: result[0].alumnus_id });
                } else {
                    return res.json({ loginStatus: false, Error: "Wrong Email or Password" });
                }
            });
        } else {
            return res.json({ loginStatus: false, Error: "Wrong Email or Password" })
        }
    })
})

// router.post("/signup", (req, res) => {
//     const sql = "INSERT INTO users(name,email,password,type) VALUES(?,?,?,?)";
//     const { name, email, password, userType } = req.body;
//     con.query(sql, [name, email, password, userType], (err, result) => {
//         if (err) {
//             console.error("Error executing SQL query:", err);
//             return res.status(500).json({ error: "Query Error", signupStatus: false });
//         }
//         return res.json({ message: 'SignUp Successfull', userId: result.insertId, signupStatus: true });

//     })
// })
router.post("/signup", async (req, res) => {
    const { name, email, password, userType, course_id } = req.body;
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ error: "Missing required fields", signupStatus: false });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const checkEmailSql = "SELECT * FROM users WHERE email = ?";
      con.query(checkEmailSql, [email], async (err, result) => {
        if (err) {
          console.error("Error checking email:", err);
          return res.status(500).json({ error: "Database error", signupStatus: false });
        }
        if (result.length > 0) {
          return res.json({ error: "Email already exists", email: result[0].email, signupStatus: false });
        }
  
        if (userType === "alumnus") {
          const alumnusSql = "INSERT INTO alumnus_bio (name, email, course_id) VALUES (?, ?, ?)";
          con.query(alumnusSql, [name, email, course_id], (alumnusErr, alumnusResult) => {
            if (alumnusErr) {
              console.error("Error inserting into alumnus_bio:", alumnusErr);
              return res.status(500).json({ error: "Alumnus insert error", signupStatus: false });
            }
  
            const alumnusId = alumnusResult.insertId;
            const userSql = "INSERT INTO users (name, email, password, type, alumnus_id) VALUES (?, ?, ?, ?, ?)";
            con.query(userSql, [name, email, hashedPassword, userType, alumnusId], (userErr, userResult) => {
              if (userErr) {
                console.error("Error inserting into users:", userErr);
                return res.status(500).json({ error: "User insert error", signupStatus: false });
              }
              return res.json({ message: "Signup Successful", userId: userResult.insertId, signupStatus: true });
            });
          });
        } else {
          const userSql = "INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)";
          con.query(userSql, [name, email, hashedPassword, userType], (err, result) => {
            if (err) {
              console.error("Error inserting into users:", err);
              return res.status(500).json({ error: "User insert error", signupStatus: false });
            }
            return res.json({ message: "Signup Successful", userId: result.insertId, signupStatus: true });
          });
        }
      });
    } catch (error) {
      console.error("Error in signup:", error);
      return res.status(500).json({ error: "Server error", signupStatus: false });
    }
  });



router.post("/logout", (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout Success' });
});

// Google Sign-In Route
router.post("/google-signin", async (req, res) => {
    const { token } = req.body;
  
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const { email, name, sub: googleId } = payload;
  
      const checkUserSql = "SELECT * FROM users WHERE email = ?";
      con.query(checkUserSql, [email], async (err, result) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ error: "Database query error", details: err.message });
        }
  
        if (result.length > 0) {
          const user = result[0];
          const token = jwt.sign(
            { role: user.type, email: user.email },
            "jwt_csalumni_key",
            { expiresIn: "1d" }
          );
          return res.json({
            loginStatus: true,
            userId: user.id,
            userType: user.type,
            userName: user.name,
            alumnus_id: user.alumnus_id,
            token,
          });
        } else {
          const verificationToken = Math.random().toString(36).substr(2) + Date.now().toString(36);
          const alumnusSql =
            "INSERT INTO alumnus_bio (name, email, verification_token) VALUES (?, ?, ?)";
          con.query(alumnusSql, [name, email, verificationToken], (alumnusErr, alumnusResult) => {
            if (alumnusErr) {
              console.error("Alumnus insert error:", alumnusErr);
              return res.status(500).json({ error: "Alumnus insert error", details: alumnusErr.message });
            }
  
            const alumnusId = alumnusResult.insertId;
            const userSql =
              "INSERT INTO users (name, email, type, alumnus_id) VALUES (?, ?, ?, ?)";
            con.query(userSql, [name, email, "alumnus", alumnusId], async (userErr, userResult) => {
              if (userErr) {
                console.error("User insert error:", userErr);
                return res.status(500).json({ error: "User insert error", details: userErr.message });
              }
  
              const verificationLink = `${process.env.BASE_URL}/auth/verify?token=${verificationToken}`;
              const html = `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`;
              try {
                await sendEmail(email, "Verify Your Email - Alumni CEP", html);
                return res.json({
                  signupStatus: true,
                  message: "Account created, please verify your email",
                  userId: userResult.insertId,
                });
              } catch (emailErr) {
                console.error("Email sending error:", emailErr);
                return res.status(500).json({ error: "Email sending failed", details: emailErr.message });
              }
            });
          });
        }
      });
    } catch (error) {
      console.error("Google token verification error:", error);
      return res.status(400).json({ error: "Invalid Google token", details: error.message });
    }
  });
  
  // Existing verification route (from your previous setup)
  router.get("/verify", (req, res) => {
    const { token } = req.query;
  
    const verifyQuery = "SELECT * FROM alumnus_bio WHERE verification_token = ?";
    con.query(verifyQuery, [token], (err, result) => {
      if (err) return res.status(500).json({ error: "Query Error" });
      if (result.length === 0) return res.status(400).send("Invalid or expired token");
  
      const updateQuery =
        "UPDATE alumnus_bio SET status = 1, verification_token = NULL WHERE verification_token = ?";
      con.query(updateQuery, [token], (updateErr) => {
        if (updateErr) return res.status(500).json({ error: "Update Error" });
        res.send("Email verified successfully! You can now log in.");
      });
    });
  });

router.get("/counts", (req, res) => {
    const sql = `
        SELECT
            (SELECT COUNT(*) FROM forum_topics) AS forumCount,
            (SELECT COUNT(*) FROM careers) AS jobCount,
            (SELECT COUNT(*) FROM events) AS eventCount,
            (SELECT COUNT(*) FROM events WHERE schedule >= CURDATE()) AS upeventCount,
            (SELECT COUNT(*) FROM alumnus_bio) AS alumniCount;
    `;

    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }

        // Extract counts from the result
        const counts = {
            forums: result[0].forumCount,
            jobs: result[0].jobCount,
            events: result[0].eventCount,
            upevents: result[0].upeventCount,
            alumni: result[0].alumniCount
        };

        // Send the counts to the client
        res.json(counts);
    });
});
// Example middleware — adjust based on how you're managing auth (e.g., sessions, JWTs)
function ensureAuthenticated(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  }
  
  // Optional: for role-based access (e.g., admin only)
  function ensureAdmin(req, res, next) {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  }
  





router.get("/achievements", (req, res) => {
    const sql = `
      SELECT a.id, a.title, a.description, a.date_achieved, a.created_at, a.category, a.attachment, ab.name, ab.email
      FROM achievements a
      JOIN alumnus_bio ab ON a.alumnus_id = ab.id
      ORDER BY a.created_at DESC
    `;
    con.query(sql, (err, result) => {
      if (err) {
        console.error("Error fetching achievements:", err);
        return res.status(500).json({ error: "Database error", details: err.message });
      }
      res.json(result);
    });
  });
  
  router.post("/achievements", galleryUpload.single('attachment'), (req, res) => {
    const { alumnus_id, title, description, date_achieved, category } = req.body;
    const attachment = req.file ? req.file.filename : null;
  
    if (!alumnus_id || !title) {
      return res.status(400).json({ error: "alumnus_id and title are required" });
    }
  
    const sql = `
      INSERT INTO achievements (alumnus_id, title, description, date_achieved)
      VALUES (?, ?, ?, ?)
    `;
    con.query(sql, [alumnus_id, title, description, date_achieved || null], (err, result) => {
      if (err) {
        console.error("Error adding achievement:", err);
        return res.status(500).json({ error: "Database error", details: err.message });
      }
      res.json({ success: true, message: "Achievement added", id: result.insertId });
    });
  });
  router.delete("/achievements/:id", ensureAuthenticated, ensureAdmin, (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM achievements WHERE id = ?";
    con.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error deleting achievement:", err);
        return res.status(500).json({ error: "Database error", details: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Achievement not found" });
      }
      res.json({ success: true, message: "Achievement deleted" });
    });
  });
  
  
//   // Add a new achievement (admin only)
//   router.post("/achievements", (req, res) => {
//     const { alumnus_id, title, description, date_achieved } = req.body;
//     if (!alumnus_id || !title) {
//       return res.status(400).json({ error: "alumnus_id and title are required" });
//     }
  
//     const sql = "INSERT INTO achievements (alumnus_id, title, description, date_achieved) VALUES (?, ?, ?, ?)";
//     con.query(sql, [alumnus_id, title, description, date_achieved || null], (err, result) => {
//       if (err) {
//         console.error("Error adding achievement:", err);
//         return res.status(500).json({ error: "Database error", details: err.message });
//       }
//       res.json({ success: true, message: "Achievement added", id: result.insertId });
//     });
//   });
  
//   // Optional: Delete an achievement (admin only)
//   router.delete("/achievements/:id", (req, res) => {
//     const { id } = req.params;
//     const sql = "DELETE FROM achievements WHERE id = ?";
//     con.query(sql, [id], (err, result) => {
//       if (err) {
//         console.error("Error deleting achievement:", err);
//         return res.status(500).json({ error: "Database error", details: err.message });
//       }
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ error: "Achievement not found" });
//       }
//       res.json({ success: true, message: "Achievement deleted" });
//     });
//   });


router.get('/jobs', (req, res) => {
    // const sql = `
    //     SELECT c.*, u.name
    //     FROM careers c
    //     INNER JOIN users u ON u.id = c.user_id
    //     ORDER BY c.id DESC
    // `;
    const sql = `
    SELECT careers.*, users.name
    FROM careers
    INNER JOIN users ON careers.user_id = users.id
    ORDER BY careers.id DESC       
    `;

    con.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Query Error' });
        }
        // Send the fetched job data to the client
        res.json(result);
    });
});


// router.post('/managejob', (req, res) => {
//     const { company, job_title, location, description, user_id } = req.body;

//     const sql = 'INSERT INTO careers (company, job_title, location, description,user_id) VALUES (?, ?, ?, ?,?)';
//     con.query(sql, [company, job_title, location, description, user_id], (err, result) => {
//         if (err) {
//             console.error('Error executing SQL query:', err);
//             return res.status(500).json({ error: 'Database Error' });
//         }
//         return res.json({ message: 'New job added successfully', jobId: result.insertId });
//     });
// });


router.put('/managejob', (req, res) => {
    const { id, company, job_title, location, description } = req.body;

    if (id) {
        const sql = 'UPDATE careers SET company=?, job_title=?, location=?, description=? WHERE id=?';
        con.query(sql, [company, job_title, location, description, id], (err, result) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Database Error' });
            }
            return res.json({ message: 'Job updated successfully' });
        });
    } else {
        return res.status(400).json({ error: 'Invalid Request: No ID provided for update' });
    }
});

// Forgot Password Route
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const checkEmailSql = "SELECT * FROM users WHERE email = ?";
  con.query(checkEmailSql, [email], (err, result) => {
    if (err) {
      console.error("Error checking email:", err);
      return res.status(500).json({ error: "Database error", details: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Email not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry

    // Store token in users table (add reset_token and reset_token_expiry columns if not present)
    const updateSql = `
      UPDATE users 
      SET reset_token = ?, reset_token_expiry = ?
      WHERE email = ?
    `;
    con.query(updateSql, [resetToken, resetTokenExpiry, email], (err) => {
      if (err) {
        console.error("Error saving reset token:", err);
        return res.status(500).json({ error: "Database error", details: err.message });
      }

      // Send reset email
      const resetLink = `${process.env.BASE_URL}/reset-password/${resetToken}`;
      const html = `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`;
      
      sendEmail(email, "Password Reset Request - Alumni BZU", html)
        .then(() => {
          res.json({ success: true, message: "Reset link sent to your email" });
        })
        .catch((emailErr) => {
          console.error("Error sending reset email:", emailErr);
          res.status(500).json({ error: "Failed to send reset email", details: emailErr.message });
        });
    });
  });
});

// Reset Password Route
router.post("/reset-password/:token", (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const sql = "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?";
  con.query(sql, [token, Date.now()], (err, result) => {
    if (err) {
      console.error("Error verifying token:", err);
      return res.status(500).json({ error: "Database error", details: err.message });
    }
    if (result.length === 0) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Hash new password
    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error("Error hashing password:", hashErr);
        return res.status(500).json({ error: "Password hashing error" });
      }

      const updateSql = `
        UPDATE users 
        SET password = ?, reset_token = NULL, reset_token_expiry = NULL 
        WHERE reset_token = ?
      `;
      con.query(updateSql, [hashedPassword, token], (updateErr) => {
        if (updateErr) {
          console.error("Error updating password:", updateErr);
          return res.status(500).json({ error: "Database error", details: updateErr.message });
        }
        res.json({ success: true, message: "Password reset successfully" });
      });
    });
  });
});

router.delete('/jobs/:id', (req, res) => {
    const jid = req.params.id;

    const sql = 'DELETE FROM careers WHERE id= ?';

    con.query(sql, [req.params.id], (err, result) => {
        if (err) { return res.json({ Error: "Query Error" }) }
        return res.json({ message: 'Job deleted successfully' });
    })

});
router.get('/courses', (req, res) => {
    const sql = "SELECT * FROM courses";
    con.query(sql, (err, result) => {
        if (err) {
            return res.json({ Error: "Query Error" })
        }
        return res.json(result);
    })
});

router.delete('/courses/:id', (req, res) => {
    // const cid = req.params.id;

    const sql = 'DELETE FROM courses WHERE id= ?';

    con.query(sql, [req.params.id], (err, result) => {
        if (err) { return res.json({ Error: "Query Error" }) }
        return res.json({ message: 'Course deleted successfully' });
    })

});
router.post("/courses", (req, res) => {
    const sql = "INSERT INTO courses(course) VALUES(?)";
    con.query(sql, [req.body.course], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);

            return res.json({ Error: "Query Error" })
        }
        return res.json(result.insertId);
    })
})

router.put('/courses', (req, res) => {
    const { id, course } = req.body;
    if (id != "") {
        const sql = 'UPDATE courses SET course=? WHERE id=?';
        con.query(sql, [course, id], (err, result) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Database Error' });
            }
            return res.json({ message: 'Course Updated Successfully' });
        });
    } else {
        return res.status(400).json({ error: 'Invalid Request: No ID provided for update' });
    }
});

router.get("/events", (req, res) => {
    const sql = "SELECT events.*, COUNT(event_commits.id) AS commits_count FROM events LEFT JOIN event_commits ON events.id = event_commits.event_id GROUP BY events.id ORDER BY events.schedule DESC";

    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }
        return res.json(result);
    });
});


router.post("/events", (req, res) => {
    const { title, content, schedule } = req.body;
    const sql = "INSERT INTO events (title, content, schedule) VALUES (?, ?, ?)";
    con.query(sql, [title, content, schedule], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }
        return res.json({ message: "Event Added Successfully" });
    });
});

router.put("/events", (req, res) => {
    const { id, title, content, schedule } = req.body;
    if (id) {
        const sql = "UPDATE events SET title=?, content=?, schedule=? WHERE id=?";
        con.query(sql, [title, content, schedule, id], (err, result) => {
            if (err) {
                console.error("Error executing SQL query:", err);
                return res.status(500).json({ error: "Query Error" });
            }
            return res.json({ message: "Event Updated Successfully" });
        });
    }
});

router.delete("/events/:id", (req, res) => {
    const eid = req.params.id;
    const sql = 'DELETE FROM events WHERE id=?';
    con.query(sql, [eid], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }
        return res.json({ message: 'Event Deleted Successfully' });
    })
})

router.post("/events/participate", (req, res) => {
    const { event_id, user_id } = req.body;
    const sql = "INSERT INTO event_commits (event_id,user_id) VALUES (?, ?)";
    con.query(sql, [event_id, user_id], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }
        return res.json({ message: "Participated" });
    });
});
router.post("/eventcommits/check", (req, res) => {
    const { event_id, user_id } = req.body;
    const sql = "SELECT * FROM event_commits where event_id=? AND user_id=?";
    con.query(sql, [event_id, user_id], (err, result) => {
        if (err) return res.json({ eventCommit: false, Error: "Query Error" })
        if (result.length > 0) {
            return res.json({ eventCommit: true })
        } else {
            return res.json({ eventCommit: false })
        }
    });
});

router.get("/forums", (req, res) => {
    // const sql = "SELECT forum_topics.*, COUNT(forum_comments.id) AS comments_count FROM forum_topics LEFT JOIN forum_comments ON forum_topics.id = forum_comments.topic_id GROUP BY forum_topics.id ORDER BY forum_topics.id DESC";
    const sql = "SELECT forum_topics.*, COUNT(forum_comments.id) AS comments_count, users.name AS created_by FROM forum_topics LEFT JOIN forum_comments ON forum_topics.id = forum_comments.topic_id LEFT JOIN users ON forum_topics.user_id = users.id GROUP BY forum_topics.id ORDER BY forum_topics.id DESC"
    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }
        return res.json(result);
    });
});

router.delete("/forum/:id", (req, res) => {
    const eid = req.params.id;
    const sql = 'DELETE FROM forum_topics WHERE id=?';
    con.query(sql, [eid], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }
        return res.json({ message: 'Forum Deleted Successfully' });
    })
})


router.post("/topiccomments", (req, res) => {
    const { topic_id } = req.body;
    // const sql = "SELECT * FROM forum_comments WHERE topic_id = ?";
    const sql = "SELECT forum_comments.*, users.name AS name FROM forum_comments LEFT JOIN users ON forum_comments.user_id = users.id WHERE topic_id = ?";
    con.query(sql, [topic_id], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }
        return res.json(result);
    });
});

router.put("/view_forum/:id", (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    if (id) {
        const sql = "UPDATE forum_comments SET comment=? WHERE id=?";
        con.query(sql, [comment, id], (err, result) => {
            if (err) {
                console.error("Error executing SQL query:", err);
                return res.status(500).json({ error: "Query Error" });
            }
            return res.json({ message: "Comment Updated Successfully" });
        });
    } else {
        return res.status(400).json({ error: "Invalid request" });
    }
});

router.post("/view_forum", (req, res) => {
    const { c, user_id, topic_id } = req.body;
    const sql = "INSERT INTO forum_comments (topic_id, comment, user_id) VALUES (?, ?, ?)";
    con.query(sql, [topic_id, c, user_id], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }
        return res.json(result);
    });
});


router.delete('/view_forum/:id', (req, res) => {
    // const cid = req.params.id;
    const sql = 'DELETE FROM forum_comments WHERE id= ?';
    con.query(sql, [req.params.id], (err, result) => {
        if (err) { return res.json({ Error: "Query Error" }) }
        return res.json({ message: 'Comment deleted successfully' });
    })
});


router.post('/manageforum', (req, res) => {
    const { title, userId, description } = req.body;

    const sql = 'INSERT INTO forum_topics (title, user_id, description) VALUES (?, ?, ?)';
    con.query(sql, [title, userId, description], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Database Error' });
        }
        return res.json({ message: 'New Forum added successfully', jobId: result.insertId });
    });
});

router.put('/manageforum', (req, res) => {
    const { title, description, id } = req.body;
    if (id) {
        const sql = 'UPDATE forum_topics SET title=?, description=? WHERE id=?';
        con.query(sql, [title, description, id], (err, result) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Database Error' });
            }
            return res.json({ message: 'Forum Topic Updated Successfully' });
        });
    } else {
        return res.status(400).json({ error: 'Invalid Request: No ID provided for update' });
    }
});


router.get("/users", (req, res) => {
    const sql = "SELECT * FROM users order by name asc";
    con.query(sql, (err, result) => {
        if (err) return res.json({ eventCommit: false, Error: "Query Error" })
        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.json({ message: "No User Available" })
        }
    });
});


// router.post('/manageuser', (req, res) => {
//     const { name, email, password } = req.body;

//     const sql = 'INSERT INTO forum_topics (name, email, password) VALUES (?, ?, ?)';
//     con.query(sql, [title, userId, description], (err, result) => {
//         if (err) {
//             console.error('Error executing SQL query:', err);
//             return res.status(500).json({ error: 'Database Error' });
//         }
//         return res.json({ message: 'New Forum added successfully', jobId: result.insertId });
//     });
// });

router.put('/manageuser', async (req, res) => {
    try {

        const { name, email, id, password, type } = req.body;
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        if (id) {
            const sql = 'UPDATE users SET name=?, email=?,type=? WHERE id=?';
            con.query(sql, [name, email, type, id], (err, result) => {
                if (err) {
                    console.error('Error executing SQL query:', err);
                    return res.status(500).json({ error: 'Database Error' });
                }
                if (hashedPassword) {
                    const psql = 'UPDATE users SET password = ? WHERE id =?';
                    const pvalues = [hashedPassword, id];
                    con.query(psql, pvalues, (err, result) => {
                        if (err) {
                            console.error('Error updating password:', err);
                            res.status(500).json({ error: 'An error occurred' });
                            return;
                        }
                        res.json({ message: 'User updated successfully' });
                    });
                } else {
                    res.json({ message: 'User updated successfully' });
                }
            });
        } else {
            return res.status(400).json({ error: 'Invalid Request: No ID provided for update' });
        }

    } catch (error) {
        console.error('Error updating User:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.delete('/user/:id', (req, res) => {
    const searchsql = 'Select alumnus_id from users where id=?'
    con.query(searchsql, [req.params.id], (serr, sresult) => {
        if (serr) { return res.json({ Error: "Query Error" }) }
        if (sresult[0].alumnus_id !== 0) {
            const asql = 'DELETE FROM alumnus_bio WHERE id=?';
            con.query(asql, [sresult[0].alumnus_id], (aerr, aresult) => {
                if (aerr) {
                    console.error("Error executing SQL query:", aerr);
                }
            })
        }

        const usql = 'DELETE FROM users WHERE id= ?';
        con.query(usql, [req.params.id], (uerr, uresult) => {
            if (uerr) { return res.json({ Error: "Query Error" }) }
            return res.json({ message: 'User deleted successfully' });
        })

    })

});

router.get("/gallery", (req, res) => {
    const sql = "SELECT * FROM gallery order by id desc";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Query Error" })
        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.json({ message: "No Image Available" })
        }
    });
});


// router.post('/gallery', upload.single('image'), (req, res) => {
//     const { about } = req.body;
//     const imagePath = req.file.path;

//     con.query('INSERT INTO gallery (image_path, about) VALUES (?, ?)', [imagePath, about], (err, result) => {
//         if (err) {
//             console.error('Error inserting into gallery:', err);
//             res.status(500).json({ error: 'An error occurred' });
//             return;
//         }
//         res.json({ message: 'Image uploaded successfully' });
//     });
// });

router.delete('/gallery/:id', (req, res) => {
    const id = req.params.id;

    con.query('DELETE FROM gallery WHERE id = ?', id, (err, result) => {
        if (err) {
            console.error('Error deleting from gallery:', err);
            res.status(500).json({ error: 'An error occurred' });
            return;
        }
        res.json({ message: 'Image deleted successfully' });
    });
});

router.post('/gallery', galleryUpload.single('image'), (req, res) => {
    try {
        const imagePath = req.file.path;
        const about = req.body.about;

        con.query('INSERT INTO gallery (image_path, about) VALUES (?, ?)', [imagePath, about], (err, result) => {
            if (err) {
                console.error('Error inserting into gallery:', err);
                res.status(500).json({ error: 'An error occurred' });
                return;
            }
            const insertedId = result.insertId;
            res.json({ message: 'Image uploaded successfully', id: insertedId, image_path: imagePath, about: about });
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.get("/alumni", (_req, res) => {
    const sql = "SELECT a.*,c.course,a.name as name from alumni_accounts a inner join courses c on c.id = a.course_id order by a.name asc";
    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching alumni:", err);
            return res.status(500).json({ error: "Database error", details: err.message });
          }
         // console.log("Alumni query result:", result); // Debug log
          res.json(result.length > 0 ? result : []); // Ensure array response
        });
      });

router.delete("/alumni/:id", (req, res) => {
    const eid = req.params.id;
    const sql = 'DELETE FROM alumnus_bio WHERE id=?';
    con.query(sql, [eid], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }
        return res.json({ message: 'Alumnus Deleted Successfully' });
    })

})

router.put('/viewalumni', (req, res) => {
    const { status, id } = req.body;
    const sql = 'UPDATE alumnus_bio SET status=? WHERE id=?';
    con.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Database Error' });
        }
        return res.json({ message: 'Status Updated Successfully' });
    });
});


router.get("/settings", (req, res) => {
    const sql = "SELECT * FROM system_settings";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Query Error" })
        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.json({ message: "No Data Available" })
        }
    });
});



//frontend

router.get("/up_events", (req, res) => {
    const sql = `SELECT * FROM events WHERE schedule >= CURDATE() ORDER BY schedule ASC`;
    con.query(sql, (err, result) => {
        if (err){
            console.log("Database Query Error:", err);
            return res.json({Error: `DB Query Error ${err}`})
            // return res.json({ Error: "DB Query Error" , })
        } 
        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.json({ message: "Still there are no upcoming Events" })
        }
    });
});

router.get("/alumni_list", (req, res) => {
    const sql = "SELECT a.*,c.course,a.name as name from alumni_accounts a inner join courses c on c.id = a.course_id order by a.name asc";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Query Error" })
        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.json({ message: "No Alumni available" })
        }
    });
});

//const multer = require('multer');


// Ensure the avatar storage folder exists (public/avatar)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Public/avatar');
  },
  filename: function (req, file, cb) {
    // Rename file to avoid collision: userID_timestamp.ext
    const ext = path.extname(file.originalname);
    const uniqueName = `avatar_${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.put("/upaccount", upload.single('image'), async (req, res) => {
  const {
    name,
    connected_to,
    course_id,
    email,
    gender,
    password,
    batch,
    alumnus_id,
    user_id
  } = req.body;

  if (!alumnus_id || !user_id || !name || !course_id || !email || !gender || !batch) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const avatar = req.file ? req.file.filename : null; // Use saved filename

  const insertSql = `
    INSERT INTO alumni_accounts 
    (user_id, name, connected_to, course_id, email, gender, batch, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const insertValues = [user_id, name, connected_to, course_id, email, gender, batch, avatar];

  con.query(insertSql, insertValues, (err) => {
    if (err) {
      console.error("Error inserting into alumni_accounts:", err);
      return res.status(500).json({ error: "Failed to update alumni account" });
    }

    // Update users table
    const updateUserSql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    con.query(updateUserSql, [name, email, user_id], async (err) => {
      if (err) {
        console.error("Error updating users table:", err);
        return res.status(500).json({ error: "Failed to update user table" });
      }

      if (password && password.trim() !== "") {
        try {
          const hashedPassword = await bcrypt.hash(password, 10);
          const updatePassSql = 'UPDATE users SET password = ? WHERE id = ?';
          con.query(updatePassSql, [hashedPassword, user_id], (err) => {
            if (err) {
              console.error("Error updating password:", err);
              return res.status(500).json({ error: "Failed to update password" });
            }
            return res.json({ message: "Account updated successfully with avatar" });
          });
        } catch (err) {
          console.error("Password hashing failed:", err);
          return res.status(500).json({ error: "Password hashing failed" });
        }
      } else {
        return res.json({ message: "Account updated successfully with avatar" });
      }
    });
  });
});




// //Optional: set up storage config for avatar file (if needed)
// const storage = multer.memoryStorage(); // or configure diskStorage
// const upload = multer({ storage });

// router.put("/upaccount", upload.single('image'), async (req, res) => {
//     try {
//       const {
//         name,
//         connected_to,
//         course_id,
//         email,
//         gender,
//         password,
//         batch,
//         alumnus_id,
//         user_id
//       } = req.body;
  
//       if (!alumnus_id || !user_id || !name || !course_id || !email || !gender || !batch) {
//         return res.status(400).json({ error: "Missing required fields" });
//       }
  
//       const avatar = req.file ? req.file.originalname : null;
  
//       // Proceed with DB update like before, using `alumnus_id` as `id`
//       //const sql = `
//     //     UPDATE alumni_accounts 
//     //     SET user_id = ?, name = ?, connected_to = ?, course_id = ?, email = ?, gender = ?, batch = ?, avatar = ?
//     //     WHERE id = ?
//     //   `;
//     //   const values = [user_id, name, connected_to, course_id, email, gender, batch, avatar, alumnus_id];
//     const sql = `
//     INSERT INTO alumni_accounts 
//     (user_id, name, connected_to, course_id, email, gender, batch, avatar)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//   `;
//   const values = [user_id, name, connected_to, course_id, email, gender, batch, avatar];
  
//       con.query(sql, values, (err, result) => {
//         if (err) {
//           console.error("Error updating account:", err);
//           return res.status(500).json({ error: "Internal server error" });
//         }
  
//         // Update users table
//         const userSql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
//         const userValues = [name, email, user_id];
  
//         con.query(userSql, userValues, (err) => {
//           if (err) {
//             console.error('Error updating users:', err);
//             return res.status(500).json({ error: 'Failed to update user table' });
//           }
  
//           if (password) {
//             //import bcrypt from 'bcrypt';

//         //    //  const bcrypt = require('bcrypt');
//             const saltRounds = 10;
//             bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
//               if (err) {
//                 console.error('Error hashing password:', err);
//                 return res.status(500).json({ error: 'Password hashing failed' });
//               }
  
//               const passSql = 'UPDATE users SET password = ? WHERE id = ?';
//               con.query(passSql, [hashedPassword, user_id], (err) => {
//                 if (err) {
//                   console.error('Error updating password:', err);
//                   return res.status(500).json({ error: 'Failed to update password' });
//                 }
//         if (password && password.trim() !== '') {
//             // New password provided — hash and update
//             const hashedPassword =  bcrypt.hash(password, 10);
//             const psql = 'UPDATE users SET password = ? WHERE id = ?';
//              db.query(psql, [hashedPassword, user_id]);
//           } else {
//             // No password provided — reuse existing password from DB
//             const [existingUser] =  db.query('SELECT password FROM users WHERE id = ?', [user_id]);
//             const existingPassword = existingUser?.[0]?.password;
          
//             if (existingPassword) {
//               const psql = 'UPDATE users SET password = ? WHERE id = ?';
//                db.query(psql, [existingPassword, user_id]);
//             } else {
//               console.error('No existing password found for user');
//               return res.status(500).json({ error: 'Unable to retain existing password' });
//             }
//           }
          
//                 res.json({ message: 'Account updated successfully' });
//               });
//             });
//     //       } 
//     } catch (error) {
//       console.error('Error updating account:', error);
//       res.status(500).json({ error: 'An error occurred' });
//     }
//   });
  
//new code 








// router.put("/upaccount", (req, res) => {
//     const {
//       id,
//       user_id,
//       name,
//       connected_to,
//       course_id,
//       email,
//       gender,
//       batch,
//       avatar // optional
//     } = req.body;
  
//     if (!id || !user_id || !name || !course_id || !email || !gender || !batch) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }
  
//     const sql = `
//       UPDATE alumni_accounts 
//       SET user_id = ?, name = ?, connected_to = ?, course_id = ?, email = ?, gender = ?, batch = ?, avatar = ? 
//       WHERE id = ?
//     `;
  
//     const values = [user_id, name, connected_to, course_id, email, gender, batch, avatar, id];
  
//     db.query(sql, values, (err, result) => {
//       if (err) {
//         console.error("Error updating account:", err);
//         return res.status(500).json({ error: "Internal server error" });
//       }
//       res.json({ message: "Account updated successfully" });
//     });
//   });

  
//             // Update users table
//             const usql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
//             const uvalues = [name, email, user_id];
//             con.query(usql, uvalues, (err, result) => {
//                 if (err) {
//                     console.error('Error updating users:', err);
//                     res.status(500).json({ error: 'An error occurred' });
//                     return;
//                 }
//                 // Update password in users table
//                 if (hashedPassword) {
//                     const psql = 'UPDATE users SET password = ? WHERE id = ?';
//                     const pvalues = [hashedPassword, user_id];
//                     con.query(psql, pvalues, (err, result) => {
//                         if (err) {
//                             console.error('Error updating password:', err);
//                             res.status(500).json({ error: 'An error occurred' });
//                             return;
//                         }
//                         res.json({ message: 'Account updated successfully' });
//                     });
//                 } else {
//                     res.json({ message: 'Account updated successfully' });
//                 }
//             });
        
//      catch (error) {
//         console.error('Error updating account:', error);
//         res.status(500).json({ error: 'An error occurred' });
//     }
// });


// router.put('/upaccount', avatarUpload.single('image'), (req, res) => {
//     try {
//         // const avatar = req.file.path ;

//         const { name, connected_to, course_id, email, gender, batch, password, alumnus_id } = req.body;

//         // Update alumnus_bio table
//         const asql = 'UPDATE alumnus_bio SET name = ?, connected_to = ?, course_id = ?, email = ?, gender = ?, batch = ? WHERE id = ?';
//         const avalues = [name, connected_to, course_id, email, gender, batch, alumnus_id];
//         con.query(asql, avalues, (err, result) => {
//             if (err) {
//                 console.error('Error updating alumnus_bio:', err);
//                 res.status(500).json({ error: 'An error occurred' });
//                 return;
//             }

//             // avatr
//             if (req.file) {
//                 const avsql = 'UPDATE alumnus_bio SET avatar = ? WHERE id = ?';
//                 const avvalues = [req.file.path, alumnus_id];
//                 con.query(avsql, avvalues, (err, result) => {
//                     if (err) {
//                         console.error('Error updating pic:', err);
//                         // res.status(500).json({ error: 'pic error occurred' });
//                         return;
//                     }
//                     // res.json({ message: 'pic updated successfully' });
//                 });
//             }

//             // Update users table
//             const usql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
//             const uvalues = [name, email, alumnus_id];
//             con.query(usql, uvalues, (err, result) => {
//                 if (err) {
//                     console.error('Error updating users:', err);
//                     res.status(500).json({ error: 'An error occurred' });
//                     return;
//                 }
//                 // Update password in users table
//                 if (password) {
//                     const psql = 'UPDATE users SET password = ? WHERE id = ?';
//                     const pvalues = [password, alumnus_id];
//                     con.query(psql, pvalues, (err, result) => {
//                         if (err) {
//                             console.error('Error updating password:', err);
//                             res.status(500).json({ error: 'An error occurred' });
//                             return;
//                         }
//                         res.json({ message: 'Account updated successfully' });
//                     });
//                 } else {
//                     res.json({ message: 'Account updated successfully' });
//                 }
//             });
//         });
//     } catch (error) {
//         console.error('Error updating account:', error);
//         res.status(500).json({ error: 'An error occurred' });
//     }
// });




const getAllStudentEmails = () => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT email FROM alumnus_bio";
      con.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          const emails = results.map(row => row.email);
          resolve(emails);
        }
      });
    });
  };

  // Add this route after existing GET routes
router.get("/alumnusdetails", (req, res) => {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "ID is required" });
  
    const sql = `
      SELECT a.*, c.course 
      FROM alumnus_bio a 
      LEFT JOIN courses c ON a.course_id = c.id 
      WHERE a.id = ?
    `;
    con.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error fetching alumnus details:", err);
        return res.status(500).json({ error: "Database error", details: err.message });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: "Alumnus not found" });
      }
      res.json(result); // Return as array to match MyAccount.jsx expectation
    });
  });
  
  router.post('/managejob', async (req, res) => {
    const { company, job_title, location, description, user_id } = req.body;
    const sql = 'INSERT INTO careers (company, job_title, location, description, user_id) VALUES (?, ?, ?, ?, ?)';
  
    con.query(sql, [company, job_title, location, description, user_id], async (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: 'Database Error' });
      }
  
      try {
        const emails = await getAllStudentEmails();
        const subject = `New Job Posted: ${job_title}`;
        const html = `A new job has been posted:<br><br>Company: ${company}<br>Title: ${job_title}<br>Location: ${location}<br>Description: ${description}`;
  
        await Promise.all(emails.map(email => sendEmail(email, subject, html)));
  
        return res.json({ message: 'New job added successfully and emails sent', jobId: result.insertId });
      } catch (error) {
        console.error('Error fetching emails or sending email:', error);
        if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
          return res.status(500).json({ error: 'Network Error: Unable to send emails' });
        } else {
          return res.status(500).json({ error: 'Error sending emails' });
        }
      }
    });
  });

export { router as adminRouter }
