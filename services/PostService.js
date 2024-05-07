import Post from '../models/postSchema.js'; 
import User from '../models/userSchema.js'
import { checkMaliciousUrls } from '../urlChecker.js';

// Helper function to extract URLs from a text
const extractUrls = (text) => {
    const urlRegex = /(https?:\/\/|www\.)[^\s]+/g;
    return text.match(urlRegex) || [];
};

const getLikeStatus = async (postId, userId) => {
    const post = await Post.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }

    const likeCount = post.likes.length;
    const userLiked = post.likes.includes(userId);

    return { likeCount, userLiked };
};

async function toggleLikeOnPost(userId, postId) {
    const post = await Post.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }

    let action;
    const likeIndex = post.likes.indexOf(userId);

    // If the user has already liked the post, remove their like
    if (likeIndex > -1) {
        post.likes.splice(likeIndex, 1);
        action = 'unliked'; // Indicate that the user has unliked the post
    } else {
        // If the user hasn't liked the post, add their like
        post.likes.push(userId);
        action = 'liked'; // Indicate that the user has liked the post
    }

    await post.save();

    return { post, action }; // Return both the updated post and the action taken
}


const deletePost = async (userId, postId) => {
    const result = await Post.findOneAndDelete({ _id: postId, createdBy: userId });
    if (!result) {
        throw new Error("NotAuthorizedOrNotFound");
    }

    return result;
}

const deletePostsByUserId = async (userId) => {
    try {
        const result = await Post.deleteMany({ createdBy: userId });
        return result; 
    } catch (error) {
        throw new Error('Error deleting posts by user: ' + error.message);
    }
};

const updatePost = async (userId, postId, updateData) => {
    // Extract and check URLs
    const urls = extractUrls(updateData.text);
    const maliciousCheck = await checkMaliciousUrls(urls);
    console.log(maliciousCheck.response);

    // If any URL is malicious, throw an error
    if (maliciousCheck.isMalicious) {
        console.log(maliciousCheck.response);
        throw new Error(`Post contains malicious URL: ${maliciousCheck.url}`);
    }

    // Find the post by postId and createdBy (userId) to ensure ownership
    let post = await Post.findOneAndUpdate(
        { _id: postId, createdBy: userId },
        updateData,
        { new: true } // Return the updated document
    ).populate('createdBy', 'displayname profilepic'); // Populate createdBy field after update

    // If no post found, or the userId does not match
    if (!post) {
        throw new Error("NotAuthorizedOrNotFound");
    }

    return post;
}

const getPostsByUserId = async (userId, requesterId) => {
    try {
        // First, check if requester is friends with the user or if it's their own profile
        const user = await User.findById(userId).populate('friendsList', '_id');
        const isFriend = user.friendsList.some(friend => friend._id.toString() === requesterId);

        if (!isFriend && userId !== requesterId) {
            // If not friends and not viewing their own posts
            return null;
        }

        // Fetch the posts created by the user and populate createdBy field
        const posts = await Post.find({ createdBy: userId })
            .populate('createdBy', 'displayname profilepic')
            .sort({ createdAt: -1 });

        return posts;

    } catch (error) {
        throw new Error('Error fetching user\'s posts: ' + error.message);
    }
};

const createPostForUser = async (userId, postData) => {
// Extract and check URLs
    const urls = extractUrls(postData.text);
    const maliciousCheck = await checkMaliciousUrls(urls);
    console.log(maliciousCheck.response);
    
// If any URL is malicious, throw an error
    if (maliciousCheck.isMalicious) {
        console.log(maliciousCheck.response);
        throw new Error(`Post contains malicious URL: ${maliciousCheck.url}`);
    }

    try {
        let newPost = new Post({ ...postData, createdBy: userId });
        await newPost.save();

        newPost = await Post.findById(newPost._id)
            .populate('createdBy', 'displayname profilepic');

        let newPostJson = newPost.toJSON();

        newPostJson.likeCount = 0;
        newPostJson.userLiked = false;
        newPostJson.canEdit = true;

        return newPostJson;
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

    //exclude the current user's own posts by adding their ID to the array
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
    toggleLikeOnPost,
    getLikeStatus
};