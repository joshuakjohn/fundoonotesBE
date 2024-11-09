import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/user.util';
import rabbitmq from '../utils/rabbitmq';


class UserService {
  
  //create new user
  public newUser = async (body: IUser): Promise<IUser> => {
    const saltRounds = 10;
    const myPassword = body.password;
    try{
      const res = await User.findOne({email: body.email});
      if(!res){
        try{
          body.password = await bcrypt.hash(myPassword, saltRounds);
        }catch(err){
          throw new Error("Error occured in hash: "+err);
        }
        const data = await User.create(body);
        await rabbitmq.sendToQueue('userRegistrationQueue', data)
        return data;
      }
      else{
        throw new Error("User already exist");
      }
    }catch(error){
      throw new Error(error);
    }
  };

  //signin a user
  public userSignin = async (email: string, password: string) => {

    const res = await User.findOne({email: email});
    if (!res) {
      throw new Error("Invalid email"); // User not found
    }
    const match = await bcrypt.compare(password, res.password);
    if(match){
      const token = jwt.sign({ userId: res._id, email: res.email }, process.env.SECRET_TOKEN);
      return {
        login: "Login Successful",
        token: token
      }   
    }
    else{
      throw new Error("Incorrect password");
    }
  }

  //forgot password
  public forgotPassword = async (email: any) => {
    try{
      const temp = await User.findOne({email});
      if(!temp)
        throw new Error("Email not found")
      const token = jwt.sign({userId: temp._id}, process.env.SECRET_TOKEN2, { expiresIn: '1h' })
      await sendEmail(email, token)
    }catch(error){
      throw new Error("Error occured cannot send email: "+error)
    }
  }

  //reset password
  public resetPassword = async (body: any, userId): Promise<void> => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  };
    
}

export default UserService;
