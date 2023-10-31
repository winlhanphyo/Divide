import { Response, Request } from 'express';
import autobind from 'autobind-decorator';
import { productService } from '../../services/product';
import { PAGINATION_LIMIT } from '../../utils/constant';
import { Op } from 'sequelize';

@autobind
class ProductController {
  /**
   * get all products data.
   * @param req 
   * @param res 
   * @returns 
   */
  async getAllProduct(req: Request, res: Response) {
    let offset = Number(req.query.page) - 1 || 0;
    const size = Number(req.query.size) || PAGINATION_LIMIT;
    const name = req.query.name;
    const status = req.query.status;
    let page = offset * size;
    let otherFindOptions = undefined;
    if (name) {
      otherFindOptions = {
        where: {
          name: {
            [Op.like]: `%${name}%`
          }
        }
      };

      // otherFindOptions = {
      //   where: {
      //     [Op.or]: [
      //       {
      //         name: {
      //           [Op.like]: `%${name}%`
      //         }
      //       },
      //       {
      //         '$media.name$': {
      //           [Op.like]: `%${name}%`
      //         }
      //       }
      //     ]
      //   }
      // };
    }

    const response = await productService.getProductList(undefined, otherFindOptions, page, size, res, status);
    return response;
  }

  /**
   * create product.
   * @param req 
   * @param res 
   */
  async createProduct(req: Request, res: Response) {
    const result = await productService.createProduct(req, res);
    return result;
  }

  /**
   * get top product.
   * @param req 
   * @param res 
   * @returns 
   */
  async getTopProduct(req: Request, res: Response) {
    const result = await productService.getTopProduct(req, res);
    return result;
  }

  /**
   * update Product.
   * @param req 
   * @param res 
   * @returns 
   */
  async updateProduct(req: Request, res: Response) {
    const id = +req.params.id;
    const checkProduct = await productService.getProductById(id, res);

    if (!checkProduct) {
      return res.status(404).send("Product is not found");
    }
    const updateProductData = await productService.updateProduct(req, res);
    return updateProductData;
  }

  /**
    * delete product.
    * @param req 
    * @param res 
    */
  deleteProduct(req: any, res: any) {
    const data = productService.deleteProduct(req, res);
    return data;
  }

  /**
   * product detail.
   * @param req 
   * @param res 
   */
  async detailProduct(req: Request, res: Response) {
    const id = +req.params.id;
    const productData = await productService.getProductById(id, res);
    return productData;
  }

  /**
   * get product with category id.
   * @param req 
   * @param res 
   * @returns 
   */
  async getProductWithCategoryId(req: Request, res: Response) {
    const id = +req.params.id;
    const productData = await productService.getProductWithCategoryId(id, res);
    return productData;
  }
}

export const productController = new ProductController();