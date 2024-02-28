//controllers
import postModel from '../models/Posts.js'

function getPosts(req, res) {
    const posts = postModel.getPosts();
    res.json({ posts })
}
function getPost(req, res) {
    const post = postModel.getPost(req.params.id)
    res.json({ post })
}

export default{
    getPosts,
    getPost
}