const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket");

app.use(
  cors({
    // origin: "http://localhost:5174",

        origin: "https://dev-meet-x.vercel.app",


    // 

    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const server = http.createServer(app);

initializeSocket(server);

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(5000, () => {
      console.log("Server is successfully listening on port 5000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!", err);
  });
