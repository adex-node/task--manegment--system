require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const taskRouter = require("./router/taskRouter");
const authRouter = require("./router/authRouter");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5500");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

app.use(express.json());

app.get("/check-server", (req, res) => {
    res.json({
        message: "NEW SERVER IS RUNNING 🚀"
    });
});
app.use("/auth", authRouter);
app.use("/task", taskRouter);

app.use(errorHandler);
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected ✅");
    })
    .catch((error) => {
        console.log("MongoDB connection failed ❌");
        console.log(error.message);
    });

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});