import mongoose from 'mongoose'
const Schema = mongoose.Schema;
import commentSchema from './commentSchema.js'
const postSchema = new Schema({
  text: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String, // URL to the image
    required: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Link to the User model
    required: true
  },
  comments: [commentSchema], // Embedding the comment schema
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post