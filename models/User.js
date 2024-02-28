import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  displayname: {
    type: String,
    required: false
  },
  profilepic: {
    type: String,
    required: false
  }
}, {
  timestamps: true 
});

const User = mongoose.model('User', UserSchema);

export default User;
