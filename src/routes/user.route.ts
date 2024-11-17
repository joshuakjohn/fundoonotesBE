import express, { IRouter } from 'express';
import userController from '../controllers/user.controller';
import UserValidator from '../validators/user.validator';
import { resetPasswordAuth } from '../middlewares/auth.middleware';

class UserRoutes {
  userValidator = new UserValidator();
  private UserController = new userController();
  private router = express.Router();

  constructor() {
    this.routes();
  }

  private routes = () => {

    //route to signin
    this.router.post('', this.userValidator.signIn, this.UserController.signIn)

    //route to create a new user
    this.router.post('/signup', this.userValidator.newUser, this.UserController.newUser)
    
    //forgot password route
    this.router.post('/forgotpw', this.UserController.forgotPassword)

    // Reset password route
    this.router.post('/resetpw', resetPasswordAuth, this.UserController.resetPassword);

  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default UserRoutes;
