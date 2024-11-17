/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import userService from '../services/user.service';
import dotenv from 'dotenv'
dotenv.config();

import { Request, Response, NextFunction } from 'express';

class UserController {
  public UserService = new userService();

  //create a new user controller
  public newUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try { 
      const data = await this.UserService.newUser(req.body);
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        message: 'User created successfully'
      });
    } catch (error) {
        next(error);
    }
  };

  //user signin controller
  public signIn = async (req: Request, res:Response) => {
    try{
      let login = await this.UserService.userSignin(req.body.email, req.body.password)
      res.json(login);
    }catch(error){
      console.log(error.message)
      res.status(HttpStatus.UNAUTHORIZED).send(error.message);
    }
  }

  //forgot password controller
  public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try { 
      await this.UserService.forgotPassword(req.body.email);
      res.status(HttpStatus.CREATED).send("Reset password token sent to registered email id");
    } catch (error) {
        next(error);
    }
  };

  //reset password controller
  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      await this.UserService.resetPassword(req.body, res.locals.id);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Password reset successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
