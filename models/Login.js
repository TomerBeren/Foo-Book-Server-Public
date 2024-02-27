import User from '../models/User.js';

async function checkUsernameAndPassword(username, password) {
    try {
        const user = await User.findOne({ username: username });
        console.log(user)
        if (!user) {
            return false; // No user found with this username
        }

        // Directly compare the provided password with the stored password
        const isPasswordMatch = (password === user.password);

        return isPasswordMatch;
    } catch (error) {
        console.error('Error checking username and password:', error);
        return false; // In case of error, return false or handle as appropriate
    }
}

export default { checkUsernameAndPassword };
