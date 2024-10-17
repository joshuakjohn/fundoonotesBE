import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import { any } from '@hapi/joi';

class UserService {

  //get all users
  public getAllUsers = async (): Promise<IUser[]> => {
    const data = await User.find();
    return data;
  };

  //create new user
  public newUser = async (body: IUser): Promise<IUser> => {
    const data = await User.create(body);
    return data;
  };

  //update a user
  public updateUser = async (_id: string, body: IUser): Promise<IUser> => {
    const data = await User.findByIdAndUpdate(
      {
        _id
      },
      body,
      {
        new: true
      }
    );
    return data;
  };

  //delete a user
  public deleteUser = async (_id: string): Promise<string> => {
    await User.findByIdAndDelete(_id);
    return '';
  };

  //get a single user
  public getUser = async (_id: string): Promise<IUser> => {
    const data = await User.findById(_id);
    return data;
  };

  public emailCheck = async(elem: string) => {
    const res = await User.findOne({email: elem});
    if(res){
      return true;
    }
    else{
      return false;
    }
  }

  public userSignin = async (email: string, password: string) => {
    const res = await User.findOne({email: email, password: password});
    if(res){
      return true;
    }
    else{
      return false;
    }
  }

}

export default UserService;
