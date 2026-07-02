import {Router} from 'express'
import {getAllUsersController, getBuyersController, getMeController, getMyTransactionsController, purchaseCreditsController, getSellersController, getUserByIdController} from '../controllers/user_controller.js'
import authMiddleware from '../middleware/check_authorized.js'

const userRoutes = Router();

userRoutes.get('/me', authMiddleware, getMeController);

userRoutes.get('/me/transactions', authMiddleware, getMyTransactionsController);

userRoutes.post('/me/credits', authMiddleware, purchaseCreditsController);

userRoutes.get('/all', authMiddleware, getAllUsersController);

userRoutes.get('/seller', authMiddleware, getSellersController);

userRoutes.get('/buyer', authMiddleware, getBuyersController);

userRoutes.get('/:id', authMiddleware, getUserByIdController);

export default userRoutes;
