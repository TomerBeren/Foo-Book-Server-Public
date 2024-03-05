import User from '../models/userSchema.js'

const createUser = async (username, password, displayname, profilepic) => {

    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
        throw new Error('Username already taken');
    }
    const user = new User({ username, password, displayname, profilepic });
    await user.save();
    return user;
};

const getUser = async (id) => {
    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        console.error("Error finding user:", error);
        throw error;
    }
}

async function checkUsernameAndPassword(username, password) {
    try {
        const user = await User.findOne({ username: username });
        console.log(user)
        if (!user) {
            return null; // No user found with this username
        }

        // Directly compare the provided password with the stored password
        const isPasswordMatch = (password === user.password);
        if (isPasswordMatch) {
            return user;
        }
        else {
            return null;
        }

    } catch (error) {
        console.error('Error checking username and password:', error);
        return null; // In case of error, return false or handle as appropriate
    }
}

const checkUsernameAvailability = async (username) => {
    const userExists = await User.findOne({ username }).exec();
    return !userExists; // Returns true if username is available, false if taken
};

export default { createUser, getUser, checkUsernameAndPassword, checkUsernameAvailability }