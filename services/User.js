import User from '../models/User.js'

const createUser = async (username, password, displayname, profilepic) => {
    const user = new User({ username, password, displayname, profilepic })
    return await user.save();
};

export default { createUser }