import { Response, Request } from 'express';
import autobind from 'autobind-decorator';
import { categoryService } from '../../services/category';
import { ICategoryModel } from '../../database';
import { PAGINATION_LIMIT } from '../../utils/constant';
import { Op } from 'sequelize';

@autobind
class CategoryController {

  /**
   * get all category data.
   * @param req 
   * @param res 
   * @returns 
   */
  async getAllCategory(req: Request, res: Response) {
    let offset = Number(req.query.page) - 1 || 0;
    const size = Number(req.query.size) || PAGINATION_LIMIT;
    const name = req.query.name;
    let page = offset * size;
    let otherFindOptions = undefined;
    console.log('query', req.query);
    
    if (name) {
      otherFindOptions = {
        where: {
          name: {
            [Op.like]: `%${name}%`
          }
        }
      };
    }
    const response = await categoryService.getCategoryList(undefined, otherFindOptions, page, size, res);
    return response;
  }

  /**
   * create Category.
   * @param req 
   * @param res 
   */
  async createCategory(req: Request, res: Response) {
    const result = await categoryService.createCategory(req, res);
    return result;
  }

  /**
   * update Category.
   * @param req 
   * @param res 
   * @returns 
   */
  async updateCategory(req: Request, res: Response) {
    const updateCategoryData = await categoryService.updateCategory(req, res);
    return updateCategoryData;
  }

  /**
   * category Detail
   * @param req 
   * @param res 
   */
  async detailCategory(req: Request, res: Response) {
    const id = +req.params.id;
    const categoryData = await categoryService.getCategoryById(id, res);
    return categoryData;
  }

  /**
   * delete category video.
   * @param req 
   * @param res 
   */
  deleteCategory(req: any, res: any) {
    const data = categoryService.deleteCategory(req, res);
    return data;
  }

}

export const categoryController = new CategoryController();