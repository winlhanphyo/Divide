import { FindOptions } from "sequelize";
import { ICategoryModel, CategoryDbModel, UserDbModel } from "../../database";
import { PAGINATION_LIMIT } from "../../utils/constant";
import { deleteFile } from "../../utils/utils";

class CategoryService {
  /**
   * get category list.
   * @param categoryAttributes 
   * @param otherFindOptions 
   * @returns 
   */
  async getCategoryList(categoryAttributes?: Array<any>, otherFindOptions?: FindOptions, offset?: number, limit?: number, res?: any): Promise<any> {
    try {
      limit = limit && limit > 0 ? limit : PAGINATION_LIMIT;
      let categoryList = await CategoryDbModel.findAll({
        ...otherFindOptions,
        attributes: categoryAttributes,
        limit,
        offset,
        include: [
          {
            model: UserDbModel,
            foreignKey: "createdUserId",
            as: "createdCategoryByUser"
          },
          {
            model: UserDbModel,
            foreignKey: "updatedUserId",
            as: "updatedCategoryByUser"
          }
        ]
      });
      const categoryCount = await CategoryDbModel.count();

      return res.json({
        success: true,
        count: categoryCount,
        offset,
        data: categoryList
      });

    } catch (e: any) {
      console.log('------get category list API error----', e);
      return res.status(400).json({
        success: false,
        message: e.toString()
      });
    }
  }

  /**
   * create category data.
   * @param categoryObj 
   * @returns 
   */
  async createCategory(req: any, res: any): Promise<CategoryDbModel> {
    try {
      const categoryObj: ICategoryModel = {
        name: req.body.name,
        createdUserId: req.headers['userid']
      } as any;

      const createCategory = await CategoryDbModel.create({ ...categoryObj, createdAt: new Date().toISOString() });
      return res.json({
        success: true,
        message: 'Category is created successfully',
        data: createCategory
      });
    } catch (e: any) {
      console.log("-----Create Category API error----", e);
      return res.status(400).json({
        success: false,
        message: e.toString()
      });
    }
  }

  /**
   * update Category data.
   * @param req 
   * @param res 
   */
  async updateCategory(req: any, res: any): Promise<any> {
    try {
      const id = +req.params.id;
      const detailCategory = await this.getCategoryById(id);

      if (!detailCategory) {
        return res.status(404).send("Category is not found");
      }

      const categoryObj: ICategoryModel = {
        name: req.body.name,
        updatedUserId: req.headers['userid'],
        updatedAt: new Date().toISOString()
      } as any;

      const updateCategoryData = await CategoryDbModel.update(categoryObj, {
        where: { id: id as number }
      });
      return res.json({
        success: true,
        message: 'Category is updated successfully',
        data: updateCategoryData
      });
    } catch (e: any) {
      console.log('------update Category error----', e);
      return res.status(400).json({
        success: false,
        message: e.toString()
      });
    }
  }

  /**
   * get Category by Id.
   * @param category_id 
   * @returns 
   */
  async getCategoryById(category_id: number, res: any = null): Promise<any> {
    try {
      const categoryData = await CategoryDbModel.findOne({
        where: {
          id: category_id
        },
        include: [
          {
            model: UserDbModel,
            foreignKey: "createdUserId",
            as: "createdCategoryByUser"
          },
          {
            model: UserDbModel,
            foreignKey: "updatedUserId",
            as: "updatedCategoryByUser"
          }
        ]
      }) as any;
      console.log('Category Data', categoryData);
      if (!categoryData) {
        return res.status(404).json({
          success: false,
          message: "Category data is not found by this id"
        });
      }

      if (res) {
        return res.json({
          data: categoryData
        })
      } else {
        return categoryData;
      }

    } catch (e: any) {
      console.log("--Get Category By Id API Error---", e);
      if (res) {
        return res.status(400).json({
          success: false,
          message: e.toString()
        });
      } else {
        return null;
      }
    }
  }

  /**
   * delete category.
   * @param req
   * @param res 
   * @returns 
   */
  async deleteCategory(req: any, res: any): Promise<CategoryDbModel> {
    try {
      const id = req.params.id;
      const detailCategory = await this.getCategoryById(id);
      if (!detailCategory) {
        return res.status(400).json({
          message: "Category is not found by this id"
        });
      }

      const removeCategoryData = await CategoryDbModel.destroy(
        {
          where: {
            id
          },
        }
      );

      return res.json({
        success: true,
        message: `Delete Category is successful.`,
        data: removeCategoryData
      });
    } catch (e: any) {
      console.log("Delete Category API Error", e);
      return res.status(400).json({
        success: false,
        message: e.toString()
      });
    }
  }

}

export const categoryService = new CategoryService();