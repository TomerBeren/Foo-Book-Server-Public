import PostService from '../services/PostService.js';

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
            image: req.body.imageUrl, 
            createdBy: userId, 
        };
        const newPost = await PostService.createPostForUser(userId, postData);
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error in createPostForUser:', error);
        res.status(500).send({ message: error.message });
    }
};
export default {getPostsByUserId, createPostForUser}
