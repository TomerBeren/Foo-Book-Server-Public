import PostService from '../services/PostService.js';

const toggleLike = async (req, res) => {
    try {
        const userId = req.user.id; // ID of the user toggling the like
        const postId = req.params.pid; // ID of the post being liked/unliked

        const { post, action } = await PostService.toggleLikeOnPost(userId, postId);
        res.status(200).json({ likeCount: post.likes.length, action }); // Return like count and action
    } catch (error) {
        console.error('Error in toggleLike:', error);
        res.status(500).send({ message: error.message });
    }
};

const deletePostForUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const postId = req.params.pid;
        await PostService.deletePost(userId, postId);

        res.status(200).send({ message: "Post deleted successfully" });

    } catch (error) {
        console.error('Error in deletePostForUser:', error);

        if (error.message === "NotAuthorizedOrNotFound") {
            return res.status(403).send({ message: "User not authorized to delete this post, or post not found." });
        }

        res.status(500).send({ message: error.message });
    }
};

const updatePostForUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const postId = req.params.pid;
        const updateData = req.body;

        const updatedPost = await PostService.updatePost(userId, postId, updateData);
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error in updatePostForUser:', error);

        // Handle the custom error specifically
        if (error.message === "NotAuthorizedOrNotFound") {
            return res.status(403).send({ message: "User not authorized to update this post, or post not found." });
        }
        
        if (error.message.includes('malicious URL')) {
            return res.status(400).send({ message: error.message });
        }

        res.status(500).send({ message: error.message });
    }
}

const appendCanEditAndLikeStatus = async (posts, userId) => {
    const enrichedPosts = []; // Initialize an array to hold the enriched posts

    for (let post of posts) {
        // Convert Mongoose document to JSON
        let postJson = post.toJSON();
        postJson.canEdit = post.createdBy._id.toString() === userId.toString();

        // Append like status for each post
        const { likeCount, userLiked } = await PostService.getLikeStatus(post._id, userId);
        postJson.likeCount = likeCount;
        postJson.userLiked = userLiked;

        enrichedPosts.push(postJson); // Add the enriched post to the array
    }

    return enrichedPosts; // Return the new array with enriched posts
};

export const getPostsByUserId = async (req, res) => {
    try {
        const userId = req.params.id; // ID of the user whose posts are being requested
        const requesterId = req.user.id; // ID of the user making the request, extracted from the token

        let posts = await PostService.getPostsByUserId(userId, requesterId);

        if (!posts) {
            return res.status(403).json({ message: "You are not friends with this user." });
        }
        const enrichedPosts = await appendCanEditAndLikeStatus(posts, requesterId);
        // Send back a success message along with the posts
        res.status(200).json({
            message: "Posts fetched successfully.",
            posts: enrichedPosts
        });
    } catch (error) {
        console.error('Error in getPostsByUserId:', error);
        res.status(500).send({ message: error.message });
    }
};

// Function to handle the creation of a new post for a specific user
export const createPostForUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const postData = {
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            createdBy: userId,
        };
        const newPost = await PostService.createPostForUser(userId, postData);
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error in createPostForUser:', error);
        if (error.message.includes('malicious URL')) {
            return res.status(400).send({ message: error.message });
        }
        res.status(500).send({ message: error.message });
    }
};

const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from the request

        // Use the feed service to fetch posts
        let friendsPosts = await PostService.getFriendsPosts(userId);
        let nonFriendsPosts = await PostService.getNonFriendsPosts(userId);

        // Append canEdit flag and like status
        friendsPosts = await appendCanEditAndLikeStatus(friendsPosts, userId);
        nonFriendsPosts = await appendCanEditAndLikeStatus(nonFriendsPosts, userId);

        // Combine and return the posts
        res.json({ friendsPosts, nonFriendsPosts });
    } catch (error) {
        console.error("Error fetching feed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default {
    getPostsByUserId,
    createPostForUser,
    updatePostForUser,
    deletePostForUser,
    getFeedPosts,
    toggleLike,
}
