import jwt from 'jsonwebtoken';
import bcrypt, { compareSync } from "bcrypt";
import crypto from "crypto";
import { sendEmail } from "../../utils/utils";
import { IUserModel, UserDbModel } from "../../database";
import { PasswordResetDbModel } from '../../database/models/passwordReset.model';

class AuthService {

  /**
   * user signup 
   * @param req
   * @param res 
   * @returns 
   */
  async signup(req: any, res: any) {
    try {
      let user = await UserDbModel.findOne({
        where: {
          email: req.body.email
        }
      }) as any;

      if (user) {
        return res.status(400).json({
          success: false,
          message: "Email is already taken"
        });
      }

      user = await UserDbModel.findOne({
        where: {
          email: req.body.email
        }
      }) as any;

      if (user) {
        return res.status(400).json({
          success: false,
          message: "Email is already taken"
        });
      }

      const userData: IUserModel = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 12),
        dob: req.body.dob,
        address: req.body.address
      } as any;
      const createUser: any = await UserDbModel.create({ ...userData, createdAt: new Date().toISOString() });
      res.json({
        success: true,
        message: 'User sign up successfully and Verification email is sent to your account.',
        user: createUser,
        // token: loginToken
      });
    } catch (e: any) {
      console.log('------get signup API error----', e);
      return res.status(400).json({
        success: false,
        message: e.toString()
      });
    }
  }

  /**
   * user login service.
   * @param req
   * @param res 
   * @returns 
   */
  async loginUser(req: any, res: any): Promise<any> {
    try {
      const email = req.body.email as any;
      const userData = await UserDbModel.findOne({
        where: {
          email: email
        }
      }) as any;

      if (!userData) {
        return res.status(404).send("Email is not found");
      }
      if (!compareSync(req.body.password, userData.password)) {
        return res.status(400).send({
          success: false,
          message: 'Incorrect Password'
        })
      }

      const payload = {
        email: userData.email,
        id: userData.id
      }
      const token = jwt.sign(payload, 'secrect', { expiresIn: '1d' });

      return res.status(200).send({
        success: true,
        message: 'Login Successfully!',
        user: userData,
        token: token
      });
    } catch (e: any) {
      console.log('user login API Error', e.toString());
      return res.status(400).json({
        success: false,
        message: e.toString()
      });
    }
  }

  /**
   * user logout
   * @param id 
   * @returns 
   */
  async logoutUser(id: any): Promise<any> {
    try {
      return await UserDbModel.findOne({
        where: {
          id
        }
      }) as any;
    } catch (err) {
      return {
        success: false,
        message: "Logout API error"
      }
    }
  }

  /**
   * forget password.
   * @param req 
   * @param res 
   * @returns 
   */
  async forgetPassword(req: any, res: any): Promise<any> {
    try {
      const user = await UserDbModel.findOne({
        where: {
          email: req.body.email
        }
      }) as any;
      if (!user)
        return res.status(400).send("Email does not exist");
  
      let passwordReset = await PasswordResetDbModel.findOne({ 
        where: {
          email: req.body.email
        }
      });
      let token = passwordReset?.dataValues?.token;
      if (!passwordReset?.dataValues?.token) {
        token =  crypto.randomBytes(16).toString("hex");
        const passwordResetData = {
          email: req.body.email,
          token,
        };

        const createPasswordReset: any = await PasswordResetDbModel.create({ ...passwordResetData, createdAt: new Date().toISOString() });
      }

      const link = `${req.body.domainUrl}/forget-password-update/${user.dataValues.id}/${token}`;
      const msg = `Here is the password reset link \n ${link}`;
      const mail = await sendEmail(user.email, "Oscar Password Reset", msg);
  
      res.status(200).json({
        message: "Password reset link sent to your email account."
      });
    } catch (err: any) {
      console.log('error');
      res.status(400).send("An error occured" + err.toString());
    }
  }

  /**
   * reset password.
   * @param req 
   * @param res 
   */
  async resetPassword (req: any, res: any) {
    try {
      const user = await UserDbModel.findOne({
        where: {
          id: req.params.userId
        }
      });
      if (!user) return res.status(400).send("User Id does not exist");
  
      const passwordReset = await PasswordResetDbModel.findOne({
        where: {
          token: req.params.token
        }
      });
      if (!passwordReset) return res.status(400).send("Invalid link or expired");
  
      const userData = {
        password: await bcrypt.hash(req.body.password, 12),
      } as any;
      const updateUser = await UserDbModel.update(userData, {
        where: { id: user.dataValues.id as number }
      });
      await passwordReset.destroy();
  
      res.json({
        message: "Password reset sucessfully."
      });
    } catch (err: any) {
      res.status(400).send("An error occured " + err.toString());
    }
  }

}

export const authService = new AuthService();