import {Router} from 'express'
import {getAllUsersController, getBuyersController, getSellersController, getUserByIdController} from '../controllers/user_controller.js'
import authMiddleware from '../middleware/check_authorized.js'

const userRoutes = Router();

userRoutes.get('/all', getAllUsersController);

userRoutes.get('/seller', getSellersController);

userRoutes.get('/buyer', getBuyersController);

userRoutes.get('/:id', authMiddleware, getUserByIdController);

export default userRoutes;