/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import userService from '../services/user.service';

import { Request, Response, NextFunction } from 'express';

class UserController {
  public UserService = new userService();

  public newUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try { 
      const data = await this.UserService.newUser(req.body);
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        data: data,
        message: 'User created successfully'
      });
    } catch (error) {
        next(error);
    }
  };

  public signIn = async (req: Request, res:Response) => {
    try{
      let login = await this.UserService.userSignin(req.body.email, req.body.password)
      res.send(login);
    }catch(error){
      res.status(HttpStatus.UNAUTHORIZED).send("Invalid email or password");
    }
  }
}

export default UserController;
