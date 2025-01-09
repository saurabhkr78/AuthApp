const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/authapp', {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});



const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
