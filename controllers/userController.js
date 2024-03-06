import userService from '../services/UserService.js';

const createUser = async (req, res) => {
    try {
        const { username, password, displayname, profilePic } = req.body;
        const user = await userService.createUser(username, password, displayname, profilePic);
        res.status(201).json({ message: 'User created successfully', user: user });
    } catch (error) {
        if (error.message === 'Username already taken') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
};
const getUserDetailes = async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await userService.getUser(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const safeUserData = {
            displayName: user.displayname,
            profilePic: user.profilepic,
            friendsList: user.friendsList,
        };

        res.send(safeUserData); // Send only the selected user data
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).send({ message: "Internal server error" });
    }
}

const checkUsernameAvailability = async (req, res) => {
    try {
        
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ message: 'Username query parameter is required.' });
        }
        const isAvailable = await userService.checkUsernameAvailability(username);
        console.log(isAvailable)
        res.json({ available: isAvailable });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default { createUser, getUserDetailes, checkUsernameAvailability };
