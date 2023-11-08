import { Op, Sequelize } from "sequelize";
import { ProductDbModel, MediaDbModel, ProductMediaDbModel, IMediaModel, OrderDbModel, OrderDetailDbModel, CategoryDbModel, UserDbModel } from "../../database";

class DashboardService {

  /**
   * get dashboard data.
   * @param eventAttributes 
   * @param otherFindOptions 
   * @returns 
   */
  async getDashboardData(req: any, res?: any): Promise<any> {
    try {
      const data: any = {
        order: null,
        sale: null
      };

      data.order = await this.getOrderData();
      data.sale = await this.getSalesData();
      data.overview = await this.getOverviewData();
      data.bestSellingProducts = await this.getBestSellingProducts();
      data.graph = await this.getGraphData();

      return res.json({
        data,
        status: 1
      });
    } catch (err: any) {
      console.log(err);
      return res.status(400).json({
        message: err.toString(),
        success: false
      })
      // logger.postErrorLogger.log('error', 'Error User Lists', err.toString());
    }
  }

  async getOrderData() {
    try {
      // Calculate counts for today, weekly, and monthly
      const today = new Date();

      const totalCount = await OrderDbModel.count();

      const todayCount = await OrderDbModel.count({
        where: {
          createdAt: { $gte: today.setHours(0, 0, 0, 0) }
        }
      });

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Assuming Sunday is the start of the week
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

      // Get the start and end of the current month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      // Get the start and end of the current year
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59); // End of December

      const thisWeekCount = await OrderDbModel.count({
        where: {
          createdAt: { $gte: startOfWeek, $lte: endOfWeek }
        }
      });

      const thisMonthCount = await OrderDbModel.count({
        where: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }
      });

      const thisYearCount = await OrderDbModel.count({
        where: {
          createdAt: { $gte: startOfYear, $lte: endOfYear }
        }
      });

      return {
        totalCount,
        todayCount,
        thisWeekCount,
        thisMonthCount,
        thisYearCount
      };
    } catch (err: any) {
      throw new Error(err.toString())
    }
  }

  /**
   * get sale data.
   * @returns 
   */
  async getSalesData() {
    try {
      const today = new Date();
      var startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      let condition = {
        createdAt: {
          [Op.gte]: startOfToday,
        }
      };

      const orders = await OrderDetailDbModel.findAll({
        where: {
          ...condition
        }
      });

      const totalOrders = await OrderDetailDbModel.findAll({
        // where: {
        //   paymentDone: true
        // }
      });

      const totalSaleAmount = this.calculateSaleAmount(totalOrders);

      const todaySaleAmount = this.calculateSaleAmount(orders);

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Assuming Sunday is the start of the week
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

      // const thisWeekOrders = orders.filter(order => order.createdAt >= startOfWeek && order.createdAt <= endOfWeek);
      const thisWeekOrders = await OrderDetailDbModel.findAll({
        where: {
          createdAt: { $gte: startOfWeek, $lte: endOfWeek }
        }
      });
      const thisWeekSaleAmount = this.calculateSaleAmount(thisWeekOrders);

      // Get the start and end of the current month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const thisMonthOrders = await OrderDetailDbModel.findAll({
        where: {
          createdAt: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        }
      });

      const thisMonthSaleAmount = this.calculateSaleAmount(thisMonthOrders);

      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59);


      const thisYearOrders = await OrderDetailDbModel.findAll({
        where: {
          createdAt: {
            [Op.between]: [startOfYear, endOfYear],
          },
        }
      });
      const thisYearSaleAmount = this.calculateSaleAmount(thisYearOrders);

      return {
        totalSaleAmount,
        todaySaleAmount,
        thisWeekSaleAmount,
        thisMonthSaleAmount,
        thisYearSaleAmount
      };
    } catch (err: any) {
      throw new Error(err.toString())
    }
  }

  /**
   * get overview data.
   * @returns 
   */
  async getOverviewData() {
    try {
      const categoryCount = await CategoryDbModel.count();

      const productCount = await ProductDbModel.count();

      const userCount = await UserDbModel.count({
        where: {
          type: "User"
        }
      });

      return {
        categoryCount,
        productCount,
        userCount
      }
    } catch (err: any) {
      throw new Error(err.toString());
    }
  }

  /**
   * best selling products.
   * @returns 
   */
  async getBestSellingProducts(limit = 10) {
    try {
      const today = new Date();
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59);

      // Find orders for the year with payment=true
      const orders = await OrderDbModel.findAll({
        where: {
          paymentDone: true,
          createdAt: {
            [Op.between]: [startOfYear, endOfYear],
          },
        }
      });

      const orderDetailIdList = orders.map((order: any) => JSON.parse(order?.dataValues?.orderDetailId));

      const bestSellingProducts = await OrderDetailDbModel.findAll({
        attributes: [
          'mediaId',
          [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmountSold'],
        ],
        group: ['mediaId'],
        limit,
        order: [[Sequelize.literal('totalAmountSold'), 'DESC']],
        where: {
          createdAt: {
            [Op.between]: [startOfYear, endOfYear],
          },
          id: orderDetailIdList
        },
        include: [
          {
            model: MediaDbModel,
            foreignKey: "id",
            as: "mediaData"
          }
        ]
      });
      return bestSellingProducts;
    } catch (err: any) {
      throw new Error(err.toString())
    }
  }

  /**
   * calculate sale amount.
   * @param orders 
   * @returns 
   */
  calculateSaleAmount(orders: any) {
    return orders.reduce((totalSale: any, order: any) => {
      const amount = order?.dataValues?.amount;
      return totalSale + amount;
    }, 0);
  };

  /**
   * get graph data.
   * @returns 
   */
  async getGraphData() {
    try {
      const products = await this.getBestSellingProducts(5);
      const sales = await this.getGraphSales();
      let data: any = {};
      data.product = products;
      data.sales = sales;
      return data;
    } catch (err: any) {
      throw new Error(err.toString());
      // logger.postErrorLogger.log('error', 'Error Product Lists')
    }
  }

  /**
   * get graph data.
   * @returns 
   */
  async getGraphSales() {
    // Get the start and end of the current month
    const today = new Date();
    console.log('month', today.getMonth());
    const months = [
      [1, 4],
      [4, 7],
      [7, 10],
      [10, 13]
    ];
    const labels = [
      "Jan-Mar",
      "Apr-Jun",
      "July-Sept",
      "Oct-Dec"
    ];
    const saleAmount = [];

    for (let i = 0; i < months.length; i++) {
      const startOfMonth = new Date(today.getFullYear(), months[i][0], 1);
      const endOfMonth = months[i][1] === 13 ? new Date(today.getFullYear() + 1, 1, 0)
        : new Date(today.getFullYear(), months[i][1], 0);

      // Find orders for the year with payment=true
      const orders = await OrderDbModel.findAll({
        where: {
          paymentDone: true,
          createdAt: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        }
      });

      const orderDetailIdList = orders.map((order: any) => JSON.parse(order?.dataValues?.orderDetailId));

      const thisMonthOrders = await OrderDetailDbModel.findAll({
        where: {
          createdAt: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
          id: orderDetailIdList
        }
      });

      const thisMonthSaleAmount = this.calculateSaleAmount(thisMonthOrders);
      console.log('this month sale amount', thisMonthSaleAmount);
      saleAmount.push(thisMonthSaleAmount);
    }

    return {
      labels,
      saleAmount
    }
  }

}

export const dashboardService = new DashboardService();