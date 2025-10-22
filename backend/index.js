const express = require("express");
const cors = require("cors");
const http = require("http"); // add this
const { Server } = require("socket.io"); // add this

const app = express();
const dbConnect = require("./config/dbConnect.js");
const cloudinaryConfig = require("./config/cloudinaryConfig.js");
const userRoute = require("./routes/userRoutes.js");
const blogRoute = require("./routes/blogRoutes.js");
const { PORT, FRONTEND_URL } = require("./config/dotenv.config.js");
const dotenv = require("dotenv");
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors({ origin: FRONTEND_URL }));

const server = http.createServer(app); // create HTTP server
const io = new Server(server, {
  cors: { origin: FRONTEND_URL, methods: ["GET", "POST"] },
});

app.set("io", io) ;

// Routes
app.get("/", (req, res) => {
  res.send("Backend is live now updated");
});

app.use("/Api/v1", userRoute);
app.use("/Api/v1", blogRoute);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
}) ;

// ---- Start server ----
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  dbConnect();
  cloudinaryConfig();
});
