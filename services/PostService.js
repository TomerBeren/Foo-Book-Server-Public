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

const updatePost = async (userId, postId, updateData) => {
    // Find the post by postId and createdBy (userId) to ensure ownership
    let post = await Post.findOne({ _id: postId, createdBy: userId });

    // If no post found, or the userId does not match, throw a custom error
    if (!post) {
        throw new Error("NotAuthorizedOrNotFound");
    }

    Object.assign(post, updateData);
    await post.save();

    post = post.toObject();

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
        // Create the post with incoming postData
        let newPost = new Post({ ...postData, createdBy: userId });
        await newPost.save();

        // Convert Mongoose document to object
        newPost = newPost.toObject();

        return newPost;

    } catch (error) {
        throw new Error('Error creating new post');
    }
};

export default {
    getPostsByUserId,
    createPostForUser,
    updatePost,
    deletePost,
};