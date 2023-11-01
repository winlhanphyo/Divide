import sequelize, { Sequelize } from "sequelize";
import { FindOptions, Op, fn } from "sequelize";
import { CategoryDbModel, IProductModel, ProductDbModel, UserDbModel, MediaDbModel, ProductMediaDbModel } from "../../database";

class ProductService {
  /**
   * get events list.
   * @param eventAttributes 
   * @param otherFindOptions 
   * @returns 
   */
  async getProductList(productAttributes?: Array<any>, otherFindOptions?: any, offset?: number, limit?: number, res?: any, status?: any): Promise<any> {
    try {
      limit = limit && limit > 0 ? limit : undefined;

      let mediaFindOption = status ?
      {
        where: { 
          status
        }
      } : null;

      const productList = await ProductDbModel.findAll({
        attributes: productAttributes,
        ...otherFindOptions,
        limit,
        offset,
        include: [
          {
            model: CategoryDbModel,
            foreignKey: 'categoryId',
            as: 'category'
          },
          {
            model: MediaDbModel,
            as: 'media',
            ...mediaFindOption,
            required: false,
          }
        ]
      });

      for (let i = 0; i < productList.length; i++) {
        const mediaData: any = productList[i]?.dataValues?.media;
        for (let j = 0; j < mediaData?.length; j++) {
          if (mediaData[j]?.dataValues?.type === "video") {
            mediaData[j].dataValues.cover = "upload/user/video/default.jpg";
          } else if (mediaData[j].type === "music") {
            mediaData[j].dataValues.cover = "upload/user/music/default.jpg";
          } else if (mediaData[j].type === "text") {
            mediaData[j].dataValues.cover = "upload/user/text/default.jpg";
          } else if (mediaData[j].type === "photo") {
            mediaData[j].dataValues.cover = mediaData[j]?.url;
          }
        }
      }
      
      const productCount = await ProductDbModel.count({
        ...otherFindOptions // Apply the same OR condition to the count
      });

      return res.json({
        success: true,
        count: productCount,
        data: productList,
        offset: offset

      });

    } catch (e: any) {
      console.log('------get product list API error----', e);
      return res.status(400).json({
        success: false,
        message: e.toString()
      });
    }
  }

  /**
   * get top product.
   * @param req 
   * @param res 
   * @returns 
   */
  async getTopProduct(req: any, res: any) {
    try {
      const productCount = await ProductDbModel.count();
      const randomProductOffset = Math.floor(Math.random() * productCount);

      // Generate a random offset for the media
      const mediaCount = await MediaDbModel.count({
        where: {
          type: "photo" // You may want to filter for photo type here
        }
      });
      const randomMediaOffset: number = Math.floor(Math.random() * mediaCount);

      const productList = await ProductDbModel.findAll({
        limit: 6,
        // offset: 0,
        // offset: randomProductOffset,
        order: Sequelize.literal('rand()'),
        include: [
          {
            model: CategoryDbModel,
            foreignKey: 'categoryId',
            as: 'category'
          },
          {
            model: MediaDbModel,
            as: 'media',
            required: false,
            where: {
              type: "photo"
            },
            // order: Sequelize.literal('rand()'), // Order the media records randomly
            // limit: 1, // Limit to only 1 random media record
            // offset: Number(randomMediaOffset) // Use the random media offset
          }
        ]
      });

      console.log('product list', productList)

      const videoData = await MediaDbModel.findOne({
        where: {
          type: "video"
        },
        order: Sequelize.literal('rand()')
      });

      for (let i = 0; i < productList.length; i++) {
        const mediaData: any = productList[i]?.dataValues?.media;
        for (let j = 0; j < mediaData?.length; j++) {
          if (mediaData[j]?.dataValues?.type === "video") {
            mediaData[j].dataValues.cover = "upload/user/video/default.jpg";
          } else if (mediaData[j].type === "music") {
            mediaData[j].dataValues.cover = "upload/user/music/default.jpg";
          } else if (mediaData[j].type === "text") {
            mediaData[j].dataValues.cover = "upload/user/text/default.jpg";
          } else if (mediaData[j].type === "photo") {
            mediaData[j].dataValues.cover = mediaData[j]?.url;
          }
        }
      }
    
      return res.json({
        success: true,
        data: productList,
        video: videoData
      });

    } catch (e: any) {
      console.log('------get product list API error----', e);
      return res.status(400).json({
        success: false,
        message: e.toString()
      });
    }
  }

  /**
   * create product data.
   * @param productObj 
   * @returns 
   */
  async createProduct(req: any, res: any): Promise<ProductDbModel> {
    try {

      const productData: IProductModel = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quote: req.body.quote,
        note: req.body.note,
        categoryId: req.body.categoryId,
        createdUserId: req.headers['userid']
      } as any;

      const createProduct: any = await ProductDbModel.create({ ...productData, createdAt: new Date().toISOString() });

      if (req?.files?.media?.length > 0) {
        const files = req.files;
        const mediaData = [];
        for (let i = 0; i < files?.media?.length; i++) {
          let type = null;
          const url = files?.media[i].path?.split("\\").join("/");
          console.log('file', files?.media[i].originalname);
          const splitUrl = url.split("/");
          if (files.media[i].mimetype.startsWith('image')) {
            type = "photo";
          } else if (files?.media[i].mimetype.startsWith('audio')) {
            type = "music";
          } else if (files?.media[i].mimetype.startsWith('video')) {
            type = "video"
          } else if (files?.media[i].mimetype.startsWith('application/pdf')) {
            type = "text";
          }
          const filename = files?.media[i].originalname.split(".");
          mediaData.push({
            name: filename[0],
            type,
            url,
            status: req.body.status
          });
        }
        const media = await MediaDbModel.bulkCreate(mediaData);

        await createProduct.setMedia(media);
      }

      return res.json({
        success: true,
        message: 'Product is created successfully',
        data: createProduct
      });
    } catch (e: any) {
      console.log("-----Create Product API error----", e);
      return res.status(400).json({
        success: false,
        message: e.toString()
      });
    }
  }

  /**
   * update Product data.
   * @param req 
   * @param res 
   */
  async updateProduct(req: any, res: any): Promise<any> {
    try {
      const id = +req.params.id;

      const productData: IProductModel = {
        name: req.body.name,
        description: req.body.description,
        price: req?.body?.price || 1,
        quote: req?.body?.quote,
        note: req.body.note,
        categoryId: req.body.categoryId,
        updatedUserId: req.headers['userid']
      } as any;

      const updateProduct = await ProductDbModel.update(productData, {
        where: { id: id as number }
      });

      return res.json({
        success: true,
        message: 'Product is updated successfully',
        data: updateProduct
      });
    } catch (e: any) {
      console.log('------update product error----', e);
      return res.status(400).json({
        success: false,
        message: e.toString()
      });
    }
  }

  /**
   * delete product.
   * @param req
   * @param res 
   * @returns 
   */
  async deleteProduct(req: any, res: any): Promise<ProductDbModel> {
    try {
      const id = req.params.id;

      const detailProduct = await ProductDbModel.findOne({
        where: {
          id
        }
      }) as any;

      if (!detailProduct) {
        return res.status(400).json({
          message: "Product is not found by this id"
        });
      }

      const removeProductData = await ProductDbModel.destroy(
        {
          where: {
            id
          },
        }
      );

      return res.json({
        success: true,
        message: `Delete Product is successful.`,
        data: removeProductData
      });
    } catch (e: any) {
      console.log("Delete Product API Error", e);
      return res.status(400).json({
        success: false,
        message: e.toString()
      });
    }
  }

  /**
   * get Product by Id.
   * @param product_id 
   * @returns 
   */
  async getProductById(product_id: number, res: any): Promise<any> {
    try {
      const productData = await ProductDbModel.findOne({
        where: {
          id: product_id
        },
        include: [
          {
            model: CategoryDbModel,
            foreignKey: "categoryId",
            as: "category"
          },
          // {
          //   model: UserDbModel,
          //   through: { attributes: [] },
          //   as: "createdProductUser",
          //   attributes: []
          // }
        ]
      }) as any;
      if (!productData) {
        return res.status(404).json({
          message: "Product data is not found by this id"
        });
      }

      return res.json({
        success: true,
        data: productData
      })
    } catch (e: any) {
      console.log("--Get Product By Id API Error---", e);
      return res.status(400).json({
        success: false,
        message: e.toString()
      });
    }
  }

  /**
   * get product with category id.
   * @param category_id 
   * @param res 
   */
  async getProductWithCategoryId(category_id: number, res: any): Promise<any> {
    try {
      const productData = await ProductDbModel.findAll({
        where: {
          categoryId: category_id
        },
        include: [
          {
            model: CategoryDbModel,
            foreignKey: "categoryId",
            as: "category"
          },
          {
            model: MediaDbModel,
            as: "media",
          }
        ]
      }) as any;
      if (!productData) {
        return res.status(404).json({
          message: "Product data with category id is not found"
        });
      }

      for (let i = 0; i < productData.length; i++) {
        const mediaData: any = productData[i]?.dataValues?.media;
        for (let j = 0; j < mediaData?.length; j++) {
          if (mediaData[j]?.dataValues?.type === "video") {
            mediaData[j].dataValues.cover = "upload/user/video/default.jpg";
          } else if (mediaData[j].type === "music") {
            mediaData[j].dataValues.cover = "upload/user/music/default.jpg";
          } else if (mediaData[j].type === "text") {
            mediaData[j].dataValues.cover = "upload/user/text/default.jpg";
          } else if (mediaData[j].type === "photo") {
            mediaData[j].dataValues.cover = mediaData[j]?.url;
          }
        }
      }

      return res.json({
        success: true,
        data: productData
      })
    } catch (e: any) {
      console.log("--Get Product By Id API Error---", e);
      return res.status(400).json({
        success: false,
        message: e.toString()
      });

    }
  }
}

export const productService = new ProductService();