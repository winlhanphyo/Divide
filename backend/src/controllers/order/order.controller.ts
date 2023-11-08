import { Response, Request } from 'express';
import autobind from 'autobind-decorator';
import { orderService } from '../../services/order';
import { IOrderModel } from '../../database';
import { PAGINATION_LIMIT } from '../../utils/constant';
import { Op } from 'sequelize';

@autobind
class OrderController {
  /**
   * get all order data.
   * @param req 
   * @param res 
   * @returns 
   */
  async getAllOrder(req: Request, res: Response) {
    let offset = Number(req.query.page) - 1 || 0;
    const size = Number(req.query.size) || PAGINATION_LIMIT;
    let page = offset * size;
    const userId = req.headers['userid'];
    const name = req.query.name;
    let otherFindOptions = undefined;
    console.log('offset: --------------', page, offset);

    if (name) {
      otherFindOptions = {
        where: {
          name: {
            [Op.like]: `%${name}%`
          }
        }
      };
    }
    const response = await orderService.getOrderList(undefined, otherFindOptions, page, size, userId, res);
    return response;
  }

  /**
   * create Order.
   * @param req 
   * @param res 
   */
  async createOrder(req: Request, res: Response) {
    const result = await orderService.createOrder(req, res);
    return result;
  }

  /**
   * update Order.
   * @param req 
   * @param res 
   * @returns 
   */
  async updateOrder(req: Request, res: Response) {
    const updatePostData = await orderService.updateOrder(req, res);
    return updatePostData;
  }

  /**
   * order Detail
   * @param req 
   * @param res 
   */
  async detailOrder(req: Request, res: Response) {
    const id = +req.params.id;
    const userId = req.headers["userid"];
    const orderData = await orderService.getOrderById(id, res, userId);
    return orderData;
  }

  /**
   * order Detail
   * @param req 
   * @param res 
   */
  async getUserOrder(req: Request, res: Response) {
    let offset = Number(req.query.page) - 1 || 0;
    const size = Number(req.query.size) || PAGINATION_LIMIT;
    let page = offset * size;
    const userId = req.headers['userid'];
    let otherFindOptions = undefined;

    if (userId) {
      otherFindOptions = {
        where: {
          customer: userId
        }
      };
    }
    const response = await orderService.getUserOrder(undefined, otherFindOptions, page, size, res);
    return response;
  }

  /**
   * delete order video.
   * @param req 
   * @param res 
   */
  deleteOrder(req: any, res: any) {
    const data = orderService.deleteOrder(req, res);
    return data;
  }

  /**
   * success payment.
   * @param orderId 
   * @returns 
   */
  async successPayment(orderId: any) {
    const data = await orderService.successPayment(orderId);
    return data;
  }

}

export const orderController = new OrderController();