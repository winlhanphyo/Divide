import { Response, Request } from 'express';
import autobind from 'autobind-decorator';
import { userService } from '../../services/user';

@autobind
class UserController {

  /**
   * get all user data.
   * @param req 
   * @param res 
   * @returns 
   */
  async getAllUser(req: Request, res: Response) {
    const user = await userService.getUserList(req, res);
    return user;
  }

  /**
   * create user.
   * @param req 
   * @param res 
   * @returns 
   */
  async createUser(req: Request, res: Response) {
    const result = await userService.createUser(req, res);
    return result;
  }

  /**
   * update User.
   * @param req 
   * @param res 
   * @returns 
   */
  async updateUser(req: any, res: Response) {
    const updateUserData = await userService.updateUser(req, res);
    return updateUserData;
  }

  /**
   * password change with user id.
   * @param req 
   * @param res 
   * @returns 
   */
  async passwordChange(req: Request, res: Response) {
    const data = await userService.passwordChange(req, res);
    return data;
  }

  /**
  * delete event.
  * @param req 
  * @param res 
  */
  deleteUser(req: any, res: any) {
    const data = userService.deleteUser(req, res);
    return data;
  }

  /**
   * user Detail
   * @param req 
   * @param res 
   */
  async detailUser(req: Request, res: Response) {
    const userData = await userService.getUserById(req, res);
    return userData;
  }
}

export const userController = new UserController();