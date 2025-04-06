//import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();
import mysql from "mysql2";

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);


const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

})


con.connect((err) => {
    if (err) {
        console.log("Connection Error", err)
    } else {
        console.log("connected")
    }
})

con.on("error", (err) => {
    console.error("MySQL connection error:", err);
  });
  
export default con;