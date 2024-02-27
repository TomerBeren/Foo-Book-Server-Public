import userService from '../services/User.js';

const createUser = async (req, res) => {
    try {
        // Assume validateInput is a function that checks the input and returns an object
        // with a boolean `isValid` and an object `errors` with any validation errors.
        //const { isValid, errors } = userService.validateInput(req.body);

        /*if (!isValid) {
            return res.status(400).json(errors);
        }*/

        // Create the user with the hashed password
        console.log('Received request for user creation:', req.body);
        const user = await userService.createUser(
            req.body.username,
            req.body.password,
            req.body.displayname,
            req.body.profilepic
        );

        // Respond with success message (exclude sensitive info like password)
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user._id,
                username: user.username,
                displayname: user.displayname,
                // Do not return the password or any sensitive information
            }
        });
    } catch (error) {
        console.error('Error in createUser:', error);
        // Handle errors (e.g., username already exists)
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

export default { createUser };
