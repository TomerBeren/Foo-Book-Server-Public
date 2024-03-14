// friendController.js
import friendService from '../services/friendService.js';

const sendFriendRequest = async (req, res) => {
    try {
        const requesterId = req.user.id;
        const receiverId = req.params.id;

        const result = await friendService.addFriendRequest(requesterId, receiverId);

        if (result.error) {
            return res.status(result.statusCode).json({ message: result.error });
        }

        res.status(200).json({ message: result.message });
    } catch (error) {
        console.error('Error in sendFriendRequest:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const fetchFriendList = async (req, res) => {
    try {
        const userId = req.user.id;
        const friendId = req.params.id; // Get the friendId from route parameters

        const { friendList, statusCode, error } = await friendService.getFriendList(userId, friendId);

        if (error) {
            return res.status(statusCode).json({ message: error });
        }

        res.status(200).json({ friendList });
    } catch (error) {
        console.error('Error in fetchFriendList controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const fetchFriendRequests = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { friendRequests, statusCode, error } = await friendService.getFriendRequests(userId);

        if (error) {
            return res.status(statusCode).json({ message: error });
        }

        res.status(200).json({ friendRequests });
    } catch (error) {
        console.error('Error in fetchFriendRequests controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const acceptFriendRequest = async (req, res) => {
    try {
        const userId = req.user.id; // The user accepting the friend request
        const friendId = req.params.fid; // The friend being accepted

        const result = await friendService.acceptFriendRequest(userId, friendId);

        if (result.error) {
            return res.status(result.statusCode).json({ message: result.error });
        }

        res.status(result.statusCode).json({ message: result.message });
    } catch (error) {
        console.error('Error in acceptFriendRequest:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const deleteFriend = async (req, res) => {
    try {
        const userId = req.user.id; // The user deleting the friend
        const friendId = req.params.fid; // The friend being deleted

        const result = await friendService.deleteFriend(userId, friendId);

        if (result.error) {
            return res.status(result.statusCode).json({ message: result.error });
        }

        res.status(result.statusCode).json({ message: result.message });
    } catch (error) {
        console.error('Error in deleteFriend controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default { sendFriendRequest, fetchFriendRequests, acceptFriendRequest, fetchFriendList, deleteFriend };
