
import bcrypt from "bcrypt";
import path from "path";
import { UserDbModel } from "../../database";
import { PAGINATION_LIMIT } from "../../utils/constant";
import { deleteFile } from "../../utils/utils";
import { Op } from "sequelize";

class UserService {

  /**
   * get users list.
   * @param req 
   * @param res 
   * @returns 
   */
  async getUserList(req: any, res: any): Promise<any> {
    try {
      let offset = Number(req.query.page) - 1 || 0;
      const limit = Number(req.query.size) || PAGINATION_LIMIT;
      const name = req.query.name;
      let page = offset * limit;
      let otherFindOptions = undefined;
      if (name) {
        otherFindOptions = {
          where: {
            [Op.or]: [
              {
                firstName: {
                  [Op.like]: `%${name}%`
                }
              },
              {
                lastName: {
                  [Op.like]: `%${name}%`
                }
              }
            ]
          }
        };
      }

      const userCount = await UserDbModel.count(otherFindOptions);

      const userList = await UserDbModel.findAll({
        limit,
        offset: page,
        ...otherFindOptions
      }) as any;

      return res.json({
        count: userCount,
        data: userList,
        offset: page
      });
    } catch (e: any) {
      console.log('------get User API Error----', e);
      return res.status(400).json({
        message: e.toString()
      });
    }
  }

  /**
   * create user.
   * @param req 
   * @param res 
   * @returns 
   */
  async createUser(req: any, res: any) {
    try {
      const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 12),
        type: req.body.type,
        dob: req.body.dob,
        address: req.body.address,
        phone: req.body.phone,
        updatedAt: new Date().toISOString()
      } as any;

      const createUser = await UserDbModel.create({ ...userData, createdAt: new Date().toISOString() });

      return res.json({
        message: 'User is created successfully',
        data: createUser
      });
    } catch (e: any) {
      console.log("Create User API Error", e);
      return res.status(400).json({
        message: e.toString()
      });
    }
  }

  /**
   * delete file data.
   * @param data 
   * @param dataPath 
   */
  deleteFileData = (data: any, dataPath: string) => {
    if (data) {
      const rootDir = path.join(__dirname, "../../" + dataPath);
      const filePath = path.join(rootDir, data);
      deleteFile(filePath);
    }
  }

  /**
   * update User data.
   * @param req
   * @param res
   */
  async updateUser(req: any, res: any): Promise<any> {
    try {
      const id = +req.params.id
      const checkUser = await this.getUserDataWithId(id, res);
      if (!checkUser) {
        return res.status(404).json({
          message: "User is not found"
        });
      }

      const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 12),
        type: req.body.type,
        dob: req.body.dob,
        address: req.body.address,
        phone: req.body.phone,
        updatedAt: new Date().toISOString()
      } as any;

      userData.id = +req.params.id;
      const updateUser = await UserDbModel.update(userData, {
        where: { id: userData.id as number }
      });

      return res.json({
        message: 'User is updated successfully',
        data: updateUser
      });
    } catch (e: any) {
      console.log("Create User API Error", e);
      return res.status(400).json({
        message: e.toString()
      });
    }
  }

  /**
   * password change.
   * @param req 
   * @param res 
   * @returns 
   */
  async passwordChange(req: any, res: any): Promise<any> {
    try {
      const userData = await this.getUserDataWithId(req.params?.id, res);

      if (!bcrypt.compareSync(req.body?.password, userData?.dataValues?.password)) {
        return res.status(400).send({
          success: false,
          message: 'Incorrect password'
        });
      }

      if (bcrypt.compareSync(req.body.newPassword, userData?.dataValues?.password)) {
        return res.status(400).send({
          success: false,
          message: 'Current Password and New Password must not be same.'
        });
      }

      const param = {
        password: await bcrypt.hash(req.body.newPassword, 12),
        updatedAt: new Date().toISOString()
      }

      const updateUser = await UserDbModel.update(param, {
        where: { id: req.params?.id as number }
      });
      res.json({
        message: "Password is changed successfully!",
        data: updateUser
      });
    } catch (err: any) {
      console.log("Password Change API Error", err);
      return res.status(400).json({
        message: err.toString()
      });
    }
  };

  /**
   * delete user.
   * @param req
   * @param res 
   * @returns 
   */
  async deleteUser(req: any, res: any): Promise<UserDbModel> {
    try {
      const id = req.params.id;

      const detailUser = await UserDbModel.findOne({
        where: {
          id
        }
      }) as any;

      if (!detailUser) {
        return res.status(400).json({
          message: "User is not found by this id"
        });
      }

      const removeUserData = await UserDbModel.destroy(
        {
          where: {
            id
          },
        }
      );

      return res.json({
        message: `Delete User is successful.`,
        data: removeUserData
      });
    } catch (e: any) {
      console.log("Delete User API Error", e);
      return res.status(400).json({
        message: e.toString()
      });
    }
  }

  /**
   * get User by Id.
   * @param req
   * @param res
   * @returns 
   */
  async getUserById(req: any, res: any): Promise<any> {
    try {
      const id = +req.params.id;
      const userData = await this.getUserDataWithId(id, res);
      return res.json({
        data: userData
      });
    } catch (e: any) {
      console.log("--Get User By Id API Error---", e);
      return res.status(400).json({
        message: e.toString(),
      });
    }
  }

  /**
   * get user data with id.
   * @param id 
   * @param res 
   * @returns 
   */
  async getUserDataWithId(id: any, res: any) {
    try {
      const userData = await UserDbModel.findOne({
        where: {
          id
        }
      }) as any;
      console.log('user data', userData);
      if (!userData) {
        return res.status(404).json({
          message: "User data is not found by this id"
        });
      }
      return userData;
    } catch (e: any) {
      console.log("--Get User By Id API Error---", e);
      return res.status(400).json({
        message: e.toString(),
      });
    }
  }

}

export const userService = new UserService();