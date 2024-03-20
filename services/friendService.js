// friendService.js
import User from '../models/userSchema.js';

const addFriendRequest = async (requesterId, receiverId) => {
    try {
        const receiver = await User.findById(receiverId);
        const requester = await User.findById(requesterId);

        if (!receiver || !requester) {
            return { error: 'User not found', statusCode: 404 };
        }

        const alreadyRequested = receiver.friendRequests.some(id => id.toString() === requesterId);
        const alreadyFriends = receiver.friendsList.some(id => id.toString() === requesterId);
        const hasPendingRequestFromReceiver = requester.friendRequests.some(id => id.toString() === receiverId);

        if (alreadyRequested || alreadyFriends) {
            return { error: 'Friend request already sent or you are already friends', statusCode: 401 };
        }

        if (hasPendingRequestFromReceiver) {
            return { error: 'You already have a pending friend request from this user. Check your friend requests to accept it.', statusCode: 400 };
        }

        receiver.friendRequests.push(requesterId);
        await receiver.save();

        return { message: 'Friend request sent successfully' };
    } catch (error) {
        console.log(error);
        return { error: 'Internal server error', statusCode: 500 };
    }
};

const getFriendList = async (userId, friendId) => {
    try {
        // Allow users to fetch their own friend list directly
        if (userId !== friendId) {
            const user = await User.findById(userId);

            // Check if friendId is in the user's friendsList
            const isFriend = user.friendsList.some(id => id.toString() === friendId);

            if (!isFriend) {
                return { error: 'Not friends or invalid request', statusCode: 403 };
            }
        }

        // Fetch the friend's or user's own friend list, excluding sensitive information
        const targetUserWithFriendList = await User.findById(friendId)
            .populate({
                path: 'friendsList',
                select: 'displayname profilepic _id' // Only include display name, profile picture, and ID
            });

        if (!targetUserWithFriendList) {
            return { error: 'User not found', statusCode: 404 };
        }

        return { friendList: targetUserWithFriendList.friendsList, statusCode: 200 };
    } catch (error) {
        console.error('Error in getFriendList service:', error);
        return { error: 'Internal server error', statusCode: 500 };
    }
}

const getFriendRequests = async (userId) => {
    try {
        // Fetch the user with the friendRequests populated, excluding friend lists and request lists
        const userWithFriendRequests = await User.findById(userId)
            .populate({
                path: 'friendRequests',
                select: 'displayname profilepic _id' // Exclude friend lists and request lists, and _id from the populated documents
            });

        if (!userWithFriendRequests) {
            return { error: 'User not found', statusCode: 404 };
        }

        return { friendRequests: userWithFriendRequests.friendRequests, statusCode: 200 };
    } catch (error) {
        console.error('Error in getFriendRequests service:', error);
        throw error;
    }
};
const acceptFriendRequest = async (userId, friendId) => {
    try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return { error: "User not found", statusCode: 404 };
        }

        // Add friendId to user's friendsList if not already present
        if (!user.friendsList.includes(friendId)) {
            user.friendsList.push(friendId);
            await user.save();
        }

        // Add userId to friend's friendsList if not already present
        if (!friend.friendsList.includes(userId)) {
            friend.friendsList.push(userId);
            await friend.save();
        }

        // Remove friendId from user's friendRequests
        user.friendRequests = user.friendRequests.filter(request => request.toString() !== friendId);
        await user.save();

        return { message: "Friend request accepted", statusCode: 200 };
    } catch (error) {
        console.error('Error accepting friend request:', error);
        return { error: "Internal server error", statusCode: 500 };
    }
};
const deleteFriend = async (userId, friendId) => {
    try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return { statusCode: 404, error: 'User(s) not found' };
        }

        const isFriends = user.friendsList.some(id => id.toString() === friendId);

        if (isFriends) {
            await User.findByIdAndUpdate(userId, { $pull: { friendsList: friendId } });
            await User.findByIdAndUpdate(friendId, { $pull: { friendsList: userId } });
            return { statusCode: 200, message: 'Friend successfully removed' };
        } else {
            const isFriendRequestSent = user.friendRequests.some(id => id.toString() === friendId);
            if (isFriendRequestSent) {
                await User.findByIdAndUpdate(userId, { $pull: { friendRequests: friendId } });
                return { statusCode: 200, message: 'Friend request successfully removed' };
            } else {
                return { statusCode: 403, message: 'No friendship or friend request to remove' };
            }
        }
    } catch (error) {
        console.error('Error in deleteFriend service:', error);
        return { statusCode: 500, error: 'Internal server error' };
    }
};

export default { addFriendRequest, getFriendRequests, acceptFriendRequest, getFriendList, deleteFriend };
