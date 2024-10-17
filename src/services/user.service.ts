import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';


class UserService {
  //create new user
  public newUser = async (body: IUser): Promise<IUser> => {
    const saltRounds = 10;
    const myPassword = body.password;

    if(await this.emailCheck(body.email) === false){
      try{
        body.password = await bcrypt.hash(myPassword, saltRounds)
      }catch(err){
        throw new Error("Error occured in hash: "+err)
      }
      const data = await User.create(body);
      return data;
    }
    else{
      throw new Error("User already exist")
    }
  };

  public emailCheck = async(elem: any) => {
    const res = await User.findOne({email: elem});
    if(res){
      return true;
    }
    else{
      return false;
    }
  }

  public userSignin = async (email: string, password: string) => {

    const res = await User.findOne({email: email});
    const match = await bcrypt.compare(password, res.password);
    if(match){
      return "Login Successfull";
    }
    else{
      throw new Error("invalid email or password");
    }
  }

}

export default UserService;
