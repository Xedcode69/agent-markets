import {pool} from '../db/db.js'
import {getUserById, getAllUsers, getSellers, getBuyers, addCredits} from '../models/user_model.js'
import {getTransactionsByUserId, logTransaction} from '../models/execution_model.js'

const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json({
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
        const userId = req.params.id;

        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({
            message: 'User retrieved successfully',
            data: user
        })
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getMeController = async(req, res) => {
    try {
        const user = await getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({
            message: 'User retrieved successfully',
            data: user
        })
    } catch (error) {
        console.error('Error retrieving current user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getMyTransactionsController = async(req, res) => {
    try {
        const transactions = await getTransactionsByUserId(req.user.id);

        res.status(200).json({
            message: 'Transactions retrieved successfully',
            data: transactions
        })
    } catch (error) {
        console.error('Error retrieving transactions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const purchaseCreditsController = async(req, res) => {
    const client = await pool.connect();

    try {
        if (req.user.role !== 'buyer') {
            return res.status(403).json({message: 'Buyer access required'});
        }

        const amount = Number(req.body.amount);
        if (!Number.isInteger(amount) || amount <= 0 || amount > 100000) {
            return res.status(400).json({
                message: 'Credit amount must be a whole number between 1 and 100000'
            });
        }

        await client.query('BEGIN');

        const user = await addCredits(req.user.id, amount, client);
        await logTransaction(req.user.id, amount, 'credit_purchase', 'completed', client);

        await client.query('COMMIT');

        res.status(200).json({
            message: 'Credits added successfully',
            data: user
        })
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error purchasing credits:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
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

export {getAllUsersController, getUserByIdController, getMeController, getMyTransactionsController, purchaseCreditsController, getSellersController, getBuyersController}
