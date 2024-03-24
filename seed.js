import mongoose from 'mongoose';
import Chance from 'chance';
import faker from 'faker'
import User from './models/userSchema.js';
import Post from './models/postSchema.js';
import customEnv from 'custom-env';

customEnv.env(process.env.NODE_ENV, './config');
mongoose.connect(process.env.CONNECTION_STRING);

const chance = new Chance();

const createUser = () => ({
    username: chance.word({ length: 8 }), // Generates a random word of length 8.
    password: chance.string({ length: 10 }), // Generates a random string of length 10.
    displayname: chance.name(), // Generates a full name.
    profilepic: `https://i.pravatar.cc/150?img=${chance.integer({ min: 1, max: 70 })}`, // Uses Pravatar for avatars with a random image.
    friendsList: [],
    friendRequests: [],
});

const createPost = (userId) => ({
    text: chance.sentence({ words: 5 }), // Generates a sentence of 5 words.
    // For dynamic images, you might opt for a service like picsum for more control
    imageUrl: `https://picsum.photos/seed/${chance.guid()}/632/500`, // Generates a unique URL for each image.
    createdBy: userId,
});

const seedDB = async () => {
    try {
        await User.deleteMany({});
        await Post.deleteMany({});

        // Create users
        const users = Array.from({ length: 10 }, createUser);
        const createdUsers = await User.insertMany(users);

        // Prepare updates for reciprocal friendships
        let friendshipUpdates = [];

        for (const user of createdUsers) {
            const friends = faker.random.arrayElements(
                createdUsers.filter(friend => friend._id.toString() !== user._id.toString()), 
                faker.datatype.number({ min: 1, max: 3 })
            ).map(friend => friend._id);

            // Add the current user to their friends' friendsLists
            friends.forEach(friendId => {
                friendshipUpdates.push({
                    userId: friendId,
                    friendId: user._id
                });
            });

            // Update the current user's friendsList
            await User.findByIdAndUpdate(user._id, { $set: { friendsList: friends } });
        }

        // Update the friendsLists for reciprocal friendships
        for (const update of friendshipUpdates) {
            await User.findByIdAndUpdate(update.userId, { $addToSet: { friendsList: update.friendId } });
        }

        // Create posts and assign them randomly to users
        const posts = createdUsers.flatMap(user =>
            Array.from({ length: faker.datatype.number({ min: 1, max: 5 }) }, () => createPost(user._id))
        );
        await Post.insertMany(posts);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        mongoose.connection.close();
    }
};


seedDB();
