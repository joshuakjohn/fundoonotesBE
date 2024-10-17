import express, { IRouter } from 'express';
import userController from '../controllers/user.controller';
import UserValidator from '../validators/user.validator';

class UserRoutes {
  userValidator = new UserValidator();
  private UserController = new userController();
  private router = express.Router();

  constructor() {
    this.routes();
  }

  private routes = () => {

    //route to create a new user
    this.router.post('/signup', this.userValidator.newUser, this.UserController.newUser)
      
    //route to signin
    this.router.post('/signin', this.userValidator.signIn, this.UserController.signIn)

  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default UserRoutes;
