import Post from '../models/postSchema.js'; // Assuming you have a Post model
import User from '../models/userSchema.js'

const deletePost = async (userId, postId) => {
    // Assuming a MongoDB model named `Post`
    const result = await Post.findOneAndDelete({ _id: postId, createdBy: userId });
    if (!result) {
        throw new Error("NotAuthorizedOrNotFound");
    }

    return result;
}

const deletePostsByUserId = async (userId) => {
    try {
        const result = await Post.deleteMany({ createdBy: userId });
        return result; // This object contains information about the operation, including the number of documents deleted.
    } catch (error) {
        throw new Error('Error deleting posts by user: ' + error.message);
    }
};

const updatePost = async (userId, postId, updateData) => {
    // Find the post by postId and createdBy (userId) to ensure ownership
    let post = await Post.findOneAndUpdate(
        { _id: postId, createdBy: userId },
        updateData,
        { new: true } // Return the updated document
    ).populate('createdBy', 'displayname profilepic'); // Populate createdBy field after update

    // If no post found, or the userId does not match, throw a custom error
    if (!post) {
        throw new Error("NotAuthorizedOrNotFound");
    }

    // No need to call post.toObject(); we are returning the Mongoose document directly
    return post;
}


const getPostsByUserId = async (userId) => {
    try {
        // Fetch the posts created by the user
        let posts = await Post.find({ createdBy: userId });

        // Convert Mongoose documents to objects
        posts = posts.map(post => post.toObject());

        return posts;

    } catch (error) {
        throw new Error('Error fetching user\'s posts: ' + error.message);
    }
};

const createPostForUser = async (userId, postData) => {
    try {
        let newPost = new Post({ ...postData, createdBy: userId });
        await newPost.save();

        newPost = await Post.findById(newPost._id)
                             .populate('createdBy', 'displayname profilepic');
        
        return newPost; 
    } catch (error) {
        throw new Error('Error creating new post: ' + error.message);
    }
};

const getFriendsPosts = async (userId) => {
    const currentUser = await User.findById(userId).populate('friendsList');
    const friendsIds = currentUser.friendsList.map(friend => friend._id);
    friendsIds.push(currentUser._id); // Include user's own posts

    return Post.find({ createdBy: { $in: friendsIds } })
        .populate('createdBy', 'displayname profilepic') // Populate createdBy field
        .sort({ createdAt: -1 })
        .limit(20);
};

const getNonFriendsPosts = async (userId) => {
    const currentUser = await User.findById(userId);
    const friendsIds = currentUser.friendsList.map(friend => friend._id);

    // Also exclude the current user's own posts by adding their ID to the array
    friendsIds.push(currentUser._id);

    return Post.find({ createdBy: { $nin: friendsIds } })
        .populate('createdBy', 'displayname profilepic') // Populate createdBy field
        .sort({ createdAt: -1 })
        .limit(5);
};



export default {
    getPostsByUserId,
    createPostForUser,
    updatePost,
    deletePost,
    getFriendsPosts,
    getNonFriendsPosts,
    deletePostsByUserId,
};