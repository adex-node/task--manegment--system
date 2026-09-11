require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const hashedPassword = await bcrypt.hash("adex@123", 10);

        await User.findOneAndUpdate(
            { email: "adex@example.com" },
            { password: hashedPassword }
        );

        console.log("Password updated successfully ✅");

        await mongoose.disconnect();
    } catch (error) {
        console.log("Error ❌");
        console.log(error.message);
    }
};

resetPassword();