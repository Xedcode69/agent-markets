import {getUserById, getAllUsers, getSellers, getBuyers} from '../models/user_model.js'

const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.staus(200).json({
            message: 'Users retrieved successfully',
            data: users
        })
    } catch (error) {        
        console.error('Error retrieving users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getUserByIdController = async(req, res) => {
    try {
        const {userId} = req.body;

        const user = await getUserById(userId);

        res.status(200).json({
            message: 'User retrieved successfully',
            data: user
        })
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getSellersController = async(req, res) => {
    try {
        const sellers = await getSellers();
        res.status(200).json({
            message: 'Sellers retrieved successfully',
            data: sellers
        })
    } catch (error) {
        console.error('Error retrieving sellers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getBuyersController = async(req, res) => {
    try {
        const buyers = await getBuyers();

        res.status(200).json({
            message: 'Buyers retrieved successfully',
            data: buyers
        })
    } catch (error) {
        console.error('Error retrieving buyers:', error);
        res.status(500).json({ message: 'Internal server error'        
        })
    }
}

export {getAllUsersController, getUserByIdController, getSellersController, getBuyersController}
