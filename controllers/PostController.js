import PostService from '../services/PostService.js';

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

// Function to handle fetching posts by a specific user ID
export const getPostsByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        const posts = await PostService.getPostsByUserId(userId);
        res.status(201).json(posts);
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
export default { getPostsByUserId, createPostForUser, updatePostForUser, deletePostForUser }
