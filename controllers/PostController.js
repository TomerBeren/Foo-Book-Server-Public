import PostService from '../services/PostService.js';

const getLikeStatus = async (req, res) => {
    try {
        const postId = req.params.pid;
        const userId = req.user.id; // Extracted by your authMiddleware from the JWT

        const { likeCount, userLiked } = await PostService.getLikeStatus(postId, userId);

        res.json({ likeCount, userLiked });
    } catch (error) {
        console.error('Error fetching like status:', error.message);
        const statusCode = error.message === 'Post not found' ? 404 : 500;
        res.status(statusCode).send({ message: error.message });
    }
};

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

        res.status(500).send({ message: error.message });
    }
}

export const getPostsByUserId = async (req, res) => {
    try {
        const userId = req.params.id; // ID of the user whose posts are being requested
        const requesterId = req.user.id; // ID of the user making the request, extracted from the token

        const posts = await PostService.getPostsByUserId(userId, requesterId);

        if (!posts) {
            return res.status(403).json({ message: "You are not friends with this user." });
        }

        // Send back a success message along with the posts
        res.status(200).json({
            message: "Posts fetched successfully.",
            posts: posts
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
        res.status(500).send({ message: error.message });
    }
};
const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from the request, assuming middleware has added `user` to `req`

        // Use the feed service to fetch posts
        let friendsPosts = await PostService.getFriendsPosts(userId);
        let nonFriendsPosts = await PostService.getNonFriendsPosts(userId);

        const appendCanEditFlag = (posts) => posts.map(post => ({
            ...post.toJSON(),
            canEdit: post.createdBy._id.toString() === userId.toString()
        }));

        // Append canEdit flag
        friendsPosts = appendCanEditFlag(friendsPosts);
        nonFriendsPosts = appendCanEditFlag(nonFriendsPosts);

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
    getLikeStatus
}
