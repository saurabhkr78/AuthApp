const mongoose = require("mongoose");

// Configure MongoDB connection with connection pooling
mongoose.connect("mongodb://127.0.0.1:27017/authapp", {
    // Minimum number of connections to maintain in the pool
    minPoolSize: 10,
    // Maximum number of connections that can be created in the pool
    maxPoolSize: 50,
    // Maximum time (in milliseconds) to wait for a connection to become available
    waitQueueTimeoutMS: 10000,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
