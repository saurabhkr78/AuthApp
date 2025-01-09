const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const Path = require("path");
const userModel = require("./models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(Path.join(__dirname, "public")));
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/create", async (req, res) => {
  try {
    const { username, email, password, confirmPassword, phone, age } = req.body;

    // Validate input data
    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !age
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Ensure username is lowercase
    if (username !== username.toLowerCase()) {
      return res.status(400).json({ error: "Username must be in lowercase." });
    }

    // Validate phone number format (e.g., 123-456-7890 or 1234567890)
    const phoneRegex = /^(\d{3}-\d{3}-\d{4}|\d{10})$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        error: "Phone number must be in the format 123-456-7890 or 1234567890.",
      });
    }

    // Validate age (must be a positive number)
    const parsedAge = Number(age);
    if (isNaN(parsedAge) || parsedAge <= 0) {
      return res.status(400).json({ error: "Age must be a positive number." });
    }

    // Validate password strength with regex
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    // generate salt with 10 round recommended and Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const createdUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      phone,
      age: parsedAge,
    });

    //after account creation keep user loged in
    let token = jwt.sign({ email }, JWT_SECRET);
    res.cookie("token", token);

    // Respond with the created user
    res.status(201).json({
      id: createdUser._id,
      username: createdUser.username,
      email: createdUser.email,
      phone: createdUser.phone,
      age: createdUser.age,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
