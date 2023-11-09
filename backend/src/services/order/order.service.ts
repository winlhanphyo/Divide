import { FindOptions } from "sequelize";
import path from "path";
import { IOrderModel, MediaDbModel, OrderDbModel, OrderDetailDbModel, ProductDbModel, UserDbModel } from "../../database";
import { PAGINATION_LIMIT, USER_VIDEO_PATH, USER_THUMBNAIL_PATH } from "../../utils/constant";
import { deleteFile } from "../../utils/utils";

class OrderService {
  /**
   * get posts list.
   * @param orderAttributes 
   * @param otherFindOptions 
   * @returns 
   */
  async getOrderList(orderAttributes?: Array<any>, otherFindOptions?: FindOptions, offset?: number, limit?: number, userId?: any, res?: any): Promise<any> {
    try {
      limit = limit && limit > 0 ? limit : undefined;
      let orderList = await OrderDbModel.findAll({
        ...otherFindOptions,
        attributes: orderAttributes,
        limit,
        offset
      });

      const orderCount = await OrderDbModel.count();

      return res.json({
        count: orderCount,
        data: orderList,
        offset: offset
      });

    } catch (e: any) {
      console.log('------get order list API error----', e);
      return res.status(400).json({
        message: e.toString()
      });
    }
  }

  /**
   * create order data.
   * @param req 
   * @param res 
   * @returns 
   */
  async createOrder(req: any, res: any) {
    try {
      const orderData = req.body;
      const orderDetailData = await OrderDetailDbModel.bulkCreate(orderData.orderDetail);
      const mediaList: any = [];
      for (let i = 0; i < orderDetailData.length; i++) {
        const dist: any = orderDetailData[i];
        const media = await MediaDbModel.findOne({
          where: {
            id: dist.mediaId,
          }
        });
        mediaList.push({
          price_data: {
            currency: "eur",
            product_data: {
              name: media?.dataValues?.name
            },
            unit_amount: dist?.amount * 100,
          },
          quantity: 1
        });
      }

      const result = await this.checkOut(mediaList, req, orderDetailData, res);
      return result;
    } catch (e: any) {
      console.log("-----Create Order API error----", e);
      return res.status(400).json({
        message: e.toString()
      });
    }
  }

  /**
   * checkOut
   * @param mediaList 
   * @param req 
   * @param orderDetailData 
   * @param res 
   * @returns 
   */
  async checkOut(mediaList: any, req: any, orderDetailData: any, res: any) {
    try {
      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
      const domainUrl = req?.body?.domainUrl;
      const result = await this.orderCreateData(req, orderDetailData);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: mediaList,
        mode: "payment",
        payment_intent_data: {
          metadata: {
            orderId: result?.dataValues?.id.toString(),
          },
        },
        // shipping_address_collection: {
        //   allowed_countries: ['US', 'SG', "IT"],
        // },
        // custom_text: {
        //   shipping_address: {
        //     message: 'Please note that we can\'t guarantee 2-day delivery for PO boxes at this time.',
        //   },
        //   submit: {
        //     message: 'We\'ll email you instructions on how to get started.',
        //   },
        // },
        success_url: domainUrl + "/payment/success",
        cancel_url: domainUrl + "/payment/cancel",
      });

      return res.json({ id: session.id });
    } catch (err: any) {
      console.log('Stripe API Error', err);
      throw err.toString();
    }
  }

  /**
   * order create data.
   * @param req 
   * @param orderDetailData 
   * @returns 
   */
  async orderCreateData(req: any, orderDetailData: any) {
    // for (let i = 0; i < orderDetailData.length; i++) {
    //   const param = orderDetailData[i];
    //   const product = await ProductDbModel.findOne(
    //     {
    //       where: {
    //       id: param.product
    //       }
    //     });
    //   if (param?.qty) {
    //     product.count = Number(product.count) - Number(param.qty);
    //     const response = await product.save();
    //   }
    // }

    const orderDetailIds = orderDetailData.map((data: any) => data?.dataValues?.id);
    const orderObj: any = {
      customer: req.headers['userid'],
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      country: req.body.country,
      company: req.body.company,
      address: req.body.address,
      additionalInfo: req.body.additionalInfo,
      city: req.body.city,
      postalCode: req.body.postalCode,
      phone: req.body.phone,
      status: req.body.status,
      totalAmount: req.body.totalAmount,
      orderDetailId: JSON.stringify(orderDetailIds)
    } as any;

    const createOrder = await OrderDbModel.create({ ...orderObj, createdAt: new Date().toISOString() });
    // orderData.orderDetail = orderDetailIds;
    // const result = await Order.insertMany(orderData);
    return createOrder;
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
   * update Order data.
   * @param req 
   * @param res 
   */
  async updateOrder(req: any, res: any): Promise<any> {
    try {
      const id = +req.params.id;
      const detailOrder = await orderService.getOrderById(id);

      if (!detailOrder) {
        return res.status(404).send("Order is not found");
      }

      const orderObj: any = {
        customer: req.headers['userid'],
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        country: req.body.country,
        company: req.body.company,
        address: req.body.address,
        additionalInfo: req.body.additionalInfo,
        city: req.body.city,
        postalCode: req.body.postalCode,
        phone: req.body.phone,
        status: req.body.status,
        totalAmount: req.body.totalAmount
      } as any;

      orderObj.id = +req.params.id;

      const updateOrderData = await OrderDbModel.update(orderObj, {
        where: { id: orderObj.id as number }
      });

      return res.json({
        message: 'Order is updated successfully',
        data: updateOrderData
      });
    } catch (e: any) {
      console.log('------update order error----', e);
      return res.status(400).json({
        message: e.toString()
      });
    }
  }

  /**
   * get Order by Id.
   * @param order_id 
   * @returns 
   */
  async getOrderById(order_id: number, res: any = null, userId: any = null): Promise<any> {
    try {
      const orderData = await OrderDbModel.findOne({
        where: {
          id: order_id
        },
        include: [
          {
            model: UserDbModel,
            foreignKey: "customer",
            as: "customerData"
          }
        ]
      }) as any;

      if (!orderData) {
        return res.status(404).json({
          message: "Order data is not found by this id"
        });
      }

      const orderDetailId = orderData?.dataValues?.orderDetailId || [];
      const orderDetail = await OrderDetailDbModel.findAll({
        where: { id: orderDetailId },
        include: [
          {
            model: MediaDbModel,
            foreignKey: "id",
            as: "mediaData"
          }
        ]
      });

      for (let i = 0; i < orderDetail.length; i++) {
        let mediaList = orderDetail[i]?.dataValues;
        if (mediaList?.mediaData?.dataValues?.type === "video") {
          mediaList.mediaData.dataValues.cover = "upload/user/video/default.jpg";
        } else if (mediaList?.mediaData?.dataValues?.type === "music") {
          mediaList.mediaData.dataValues.cover = "upload/user/music/default.jpg";
        } else if (mediaList?.mediaData?.dataValues?.type === "text") {
          mediaList.mediaData.dataValues.cover = "upload/user/text/default.jpg";
        } else if (mediaList?.mediaData?.dataValues?.type === "photo") {
          mediaList.mediaData.dataValues.cover = mediaList?.mediaData?.dataValues.url;
        }
      }

      if (orderDetail) {
        orderData.dataValues.orderDetail = orderDetail;
      }

      if (res) {
        return res.json({
          data: orderData
        })
      } else {
        return orderData;
      }

    } catch (e: any) {
      console.log("--Get Order By Id API Error---", e);
      if (res) {
        return res.status(400).json({
          message: e.toString()
        });
      } else {
        return null;
      }
    }
  }

  /**
   * get user order data with userId.
   * @param req 
   * @param res 
   */
  async getUserOrder(orderAttributes?: Array<any>, otherFindOptions?: FindOptions, offset?: number, limit?: number, res?: any): Promise<any> {
    try {
      limit = limit && limit > 0 ? limit : undefined;
      let orderList = await OrderDbModel.findAll({
        ...otherFindOptions,
        attributes: orderAttributes,
        limit,
        offset
      });

      const orderCount = await OrderDbModel.count();

      for (let i = 0; i < orderList?.length; i++) {
        let orderData = orderList[i];

        const orderDetailId = orderData?.dataValues?.orderDetailId || [];
        const orderDetail = await OrderDetailDbModel.findAll({
          where: { id: orderDetailId },
          include: [
            {
              model: MediaDbModel,
              foreignKey: "id",
              as: "mediaData"
            }
          ]
        });

        for (let i = 0; i < orderDetail.length; i++) {
          let mediaList = orderDetail[i]?.dataValues;
          if (mediaList?.mediaData?.dataValues?.type === "video") {
            mediaList.mediaData.dataValues.cover = "upload/user/video/default.jpg";
          } else if (mediaList?.mediaData?.dataValues?.type === "music") {
            mediaList.mediaData.dataValues.cover = "upload/user/music/default.jpg";
          } else if (mediaList?.mediaData?.dataValues?.type === "text") {
            mediaList.mediaData.dataValues.cover = "upload/user/text/default.jpg";
          } else if (mediaList?.mediaData?.dataValues?.type === "photo") {
            mediaList.mediaData.dataValues.cover = mediaList?.mediaData?.dataValues.url;
          }
        }

        if (orderDetail) {
          orderData.dataValues.orderDetail = orderDetail;
        }
      }

      return res.json({
        count: orderCount,
        data: orderList,
        offset: offset
      });

    } catch (err: any) {
      console.log("Get User Order API Error", err);
      return res.status(400).json({
        message: err.toString()
      });
    }
  }

  /**
   * delete order.
   * @param req
   * @param res 
   * @returns 
   */
  async deleteOrder(req: any, res: any): Promise<OrderDbModel> {
    try {
      const id = req.params.id;
      const userId = req.headers["userid"];
      const detailOrder = await this.getOrderById(id);
      if (!detailOrder) {
        return res.status(400).json({
          message: "Order is not found by this id"
        });
      }

      const removeOrderData = await OrderDbModel.destroy(
        {
          where: {
            id
          },
        }
      );

      return res.json({
        message: `Delete Order is successful.`,
        data: removeOrderData
      });
    } catch (e: any) {
      console.log("Delete Order API Error", e);
      return res.status(400).json({
        message: e.toString()
      });
    }
  }

  /**
   * support the post.
   * @param req 
   * @param res 
   */
  async support(req: any, res: any): Promise<any> {
    try {
      const param = req.body;
      const userId = req.headers['userid'];
      const id = +req.params.id;
      let mediaList = [
        {
          price_data: {
            currency: "EUR",
            product_data: {
              donatorId: userId,
              postId: id
            },
            unit_amount: param.amount,
          },
          // quantity: 1,
        }
      ];
      // const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
      // const domainUrl = param.domainUrl;
      // delete param?.domainUrl;

      // const domainUrl = orderData.domainUrl;
      // delete orderData?.domainUrl;
      const dist: any = {
        donatorId: Number(userId),
        postId: id,
        message: param.message,
        amount: param.amount,
        paymentDone: true
      };

      console.log('---------dist', dist);

      // const result = await this.paymentCreate(dist);
      // console.log('order result', result.dataValues.id);

      // const session = await stripe.checkout.sessions.create({
      //   payment_method_types: ["card"],
      //   line_items: mediaList,
      //   mode: "payment",
      //   payment_intent_data: {
      //     metadata: {
      //       paymentId: param.paymentId,
      //     },
      //   },
      //   // shipping_address_collection: {
      //   //   allowed_countries: ['US', 'SG', "IT"],
      //   // },
      //   // custom_text: {
      //   //   shipping_address: {
      //   //     message: 'Please note that we can\'t guarantee 2-day delivery for PO boxes at this time.',
      //   //   },
      //   //   submit: {
      //   //     message: 'We\'ll email you instructions on how to get started.',
      //   //   },
      //   // },
      //   // success_url: domainUrl + "/payment/success",
      //   // cancel_url: domainUrl + "/payment/cancel",
      // });
      // return res.json({ id: session.id });
      return res.json({ msg: "Payment success" });

      // res.json(session);

    } catch (err: any) {
      console.log('Stripe API Error', err);
      throw err.toString();
    }
  }

  /**
   * success payment.
   * @param orderId
   * @returns 
   */
  async successPayment(orderId: any): Promise<any> {
    try {
      const order = await OrderDbModel.findOne(
        {
          where: {
            id: orderId
          }
        });
      if (!order) {
        const error: any = new Error("Not Found!");
        error.statusCode = 404;
        throw error;
      }

      const orderData = {
        paymentDone: true
      } as any;

      const updateOrder = await OrderDbModel.update(orderData, {
        where: { id: orderId as number }
      });

      return {
        message: "Order payment successful!"
      };
    } catch (err: any) {
      console.log('success Payment function failed', err);
      return {
        message: "Payment API Error!" + err.toString(),
      };
    }
  }

}

export const orderService = new OrderService();