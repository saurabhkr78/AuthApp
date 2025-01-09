const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const Path = require('path');
const userModel = require('./models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(Path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/create', async (req, res) => {
    try {
        const { username, email, age, npassword: password, cpassword: confirmPassword } = req.body;

        // Validate input data
        if (!username || !email || !password || !confirmPassword || !age) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Ensure username is lowercase
        if (username !== username.toLowerCase()) {
            return res.status(400).json({ error: 'Username must be in lowercase.' });
        }

        // Validate age (must be a positive number)
        const parsedAge = Number(age);
        if (isNaN(parsedAge) || parsedAge <= 0) {
            return res.status(400).json({ error: 'Age must be a positive number.' });
        }

        // Validate password strength with regex
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!strongPasswordRegex.test(password)) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
            });
        }

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match.' });
        }

        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user
        const createdUser = await userModel.create({
            username,
            email,
            password: hashedPassword,
            age: parsedAge,
        });

        // Create JWT token
        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';  // Better to use environment variable
        const token = jwt.sign({ email }, JWT_SECRET);
        res.cookie("token", token);

        // Redirect after successful creation
        res.redirect('/');  // or wherever you want to redirect
        
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
