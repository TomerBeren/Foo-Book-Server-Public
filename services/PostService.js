import Post from '../models/postSchema.js'; // Assuming you have a Post model
import User from '../models/userSchema.js'
const getPostsByUserId = async (userId) => {
    try {
        // Fetch the posts created by the user
        let posts = await Post.find({ createdBy: userId });

        // Convert Mongoose documents to objects
        posts = posts.map(post => post.toObject());

        // Fetch the user's details once, assuming all posts are by the same user
        const user = await User.findById(userId, 'displayname profilepic createdAt -_id').exec();

        // Include user details in each post
        const responsePosts = posts.map(post => ({
            ...post,
            imageUrl: post.image, // Assuming 'image' holds the URL or identifier for the image
            author: user ? user.displayname : "",
            profilePic: user ? user.profilepic : "",
            timestamp: post.createdAt, // Use post's createdAt as timestamp
        }));

        return responsePosts;
    } catch (error) {
        throw new Error('Error fetching user\'s posts: ' + error.message);
    }
};

const createPostForUser = async (userId, postData) => {
    try {
        // Create the post with incoming postData
        let newPost = new Post({ ...postData, createdBy: userId });
        await newPost.save();

        // Convert Mongoose document to object
        newPost = newPost.toObject();

        // Fetch additional user details to include in the post response
        const user = await User.findById(userId, 'displayname profilepic createdAt -_id').exec();

        // Construct the response object with desired structure
        const responsePost = {
            ...newPost,
            imageUrl: newPost.image, 
            author: user ? user.displayname : "", 
            profilePic: user ? user.profilepic : "", 
            timestamp: user ? user.createdAt : ""
        };

        return responsePost;
    } catch (error) {
        throw new Error('Error creating new post');
    }
};

export default {
    getPostsByUserId,
    createPostForUser
};