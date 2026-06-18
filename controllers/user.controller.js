const User = require('../models/user.model');

// 1. Signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password, phone, age } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.json({ message: "Email already exists." });

        await User.create({ name, email, password, phone, age });
        res.json({ message: "User added successfully." });
    } catch (error) {
        res.json({ message: "Error", error: error.message });
    }
};

// 2. Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        
        if (!user) return res.json({ message: "Invalid email or password" });
        res.json({ message: "Login successful", userId: user._id }); 
    } catch (error) {
        res.json({ message: "Error", error: error.message });
    }
};

// 3. Update logged-in user
exports.updateUser = async (req, res) => {
    try {
        const userId = req.headers.userid;
        const { email } = req.body;

        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail && existingEmail._id.toString() !== userId) {
                return res.json({ message: "Email already exists" });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser) return res.json({ message: "User not found" });

        res.json({ message: "User updated", user: updatedUser });
    } catch (error) {
        res.json({ message: "Error", error: error.message });
    }
};

// 4. Delete logged-in user
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.headers.userid;
        const deletedUser = await User.findByIdAndDelete(userId);
        
        if (!deletedUser) return res.json({ message: "User not found" });
        res.json({ message: "User deleted" });
    } catch (error) {
        res.json({ message: "Error", error: error.message });
    }
};

// 5. Get logged-in user data
exports.getUser = async (req, res) => {
    try {
        const userId = req.headers.userid;
        const user = await User.findById(userId);
        
        if (!user) return res.json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.json({ message: "Error", error: error.message });
    }
};