import { FindOptions } from "sequelize";
import { ProductDbModel, MediaDbModel, ProductMediaDbModel, IMediaModel } from "../../database";

class MediaService {
  /**
   * get events list.
   * @param eventAttributes 
   * @param otherFindOptions 
   * @returns 
   */
  async getMediaList(mediaAttributes?: Array<any>, otherFindOptions?: any, offset?: number, limit?: number, res?: any, catId?: any): Promise<any> {
    try {
      limit = limit && limit > 0 ? limit : undefined;
      catId = catId ? catId : undefined;

      let condition = {};
      if (catId) {
        condition = {
          where: { categoryId: catId }
        };
      }

      let mediaList = await MediaDbModel.findAll({
        attributes: mediaAttributes,
        limit,
        offset,
        ...otherFindOptions,
        include: [
          {
            model: ProductDbModel,
            as: "products",
            ...condition
          }
        ]
      });

      const mediaCount = await MediaDbModel.count({
        ...otherFindOptions,
        include: [
          {
            model: ProductDbModel,
            as: "products",
            ...condition
          }
        ]
      });

        for (let i = 0; i < mediaList?.length; i++) {
          if (mediaList[i]?.dataValues?.type === "video") {
            mediaList[i].dataValues.cover = "upload/user/video/default.jpg";
          } else if (mediaList[i].dataValues.type === "music") {
            mediaList[i].dataValues.cover = "upload/user/music/default.jpg";
          } else if (mediaList[i].dataValues.type === "text") {
            mediaList[i].dataValues.cover = "upload/user/text/default.jpg";
          } else if (mediaList[i].dataValues.type === "photo") {
            mediaList[i].dataValues.cover = mediaList[i]?.dataValues?.url;
          }
        }

      return res.json({
        success: true,
        count: mediaCount,
        data: mediaList,
        offset: offset

      });

    } catch (e: any) {
      console.log('------get media list API error----', e);
      return res.status(400).json({
        success: false,
        message: e.toString()
      });
    }
  }

  async createMedia(req: any, res: any) {
    try {
      const id = req.body.product;
      const productDetail = await ProductDbModel.findOne({
        where: {
          id
        },
        include: [
          {
            model: MediaDbModel,
            as: "media"
          }
        ]
      }) as any;
      if (!productDetail) {
        return res.status(404).json({
          message: "Product data is not found by this id"
        });
      }
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
            type = "video";
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
        await productDetail.setMedia(media);
      }

      return res.json({
        success: true,
        message: 'Media is created successfully',
        data: productDetail
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
   * delete media.
   * @param req
   * @param res 
   * @returns 
   */
  async deleteMedia(req: any, res: any): Promise<MediaDbModel> {
    try {
      const id = req.params.id;

      const detailMedia = await MediaDbModel.findOne({
        where: {
          id
        }
      }) as any;

      if (!detailMedia) {
        return res.status(400).json({
          message: "Media is not found by this id"
        });
      }

      const removeMediaData = await MediaDbModel.destroy(
        {
          where: {
            id
          },
        }
      );

      return res.json({
        success: true,
        message: `Delete Media is successful.`,
        data: removeMediaData
      });
    } catch (e: any) {
      console.log("Delete Media API Error", e);
      return res.status(400).json({
        success: false,
        message: e.toString()
      });
    }
  }

  /**
   * get Media by Id.
   * @param media_id 
   * @returns 
   */
  async getMediaById(media_id: number, res: any = null): Promise<any> {
    try {
      const mediaData = await MediaDbModel.findOne({
        where: {
          id: media_id
        },
        include: [
          {
            model: ProductDbModel,
            as: "products"
          }
        ]
      }) as any;
      if (!mediaData) {
        if (res) {
          return res.status(404).json({
            message: "Media data is not found by this id"
          });
        } else {
          return null;
        }
      }

        if (mediaData?.dataValues?.type === "video") {
          mediaData.dataValues.cover = "upload/user/video/default.jpg";
        } else if (mediaData.dataValues.type === "music") {
          mediaData.dataValues.cover = "upload/user/music/default.jpg";
        } else if (mediaData.dataValues.type === "text") {
          mediaData.dataValues.cover = "upload/user/text/default.jpg";
        } else if (mediaData.dataValues.type === "photo") {
          mediaData.dataValues.cover = mediaData?.dataValues?.url;
        }

      if (res) {
        return res.json({
          success: true,
          data: mediaData
        })
      } else {
        return mediaData;
      }
    } catch (e: any) {
      console.log("--Get Media By Id API Error---", e);
      return res.status(400).json({
        success: false,
        message: e.toString()
      });
    }
  }

  /**
   * get media with category id.
   * @param category_id 
   * @param res 
   */
  async getMediaWithProductId(mediaAttributes?: Array<any>, id?: any, otherFindOptions?: any, offset?: number, limit?: number, res?: any): Promise<any> {
    try {
      limit = limit && limit > 0 ? limit : undefined;
      let mediaData = await MediaDbModel.findAll({
        attributes: mediaAttributes,
        limit,
        offset,
        ...otherFindOptions,
        include: [
          {
            model: ProductDbModel,
            as: "products",
            where: { 
              id: id
            },
          }
        ]
      });
      const mediaCount = await MediaDbModel.count({
        ...otherFindOptions,
        include: [
          {
            model: ProductDbModel,
            as: "products",
            where: { 
              id: id
            },
          }
        ]
      });
      if (!mediaData) {
        return res.status(404).json({
          message: "Media data with product id is not found"
        });
      }

      return res.json({
        success: true,
        data: mediaData,
        count: mediaCount,
        offset: offset
      })
    } catch (e: any) {
      console.log("--Get Media By Id API Error---", e);
      return res.status(400).json({
        success: false,
        message: e.toString()
      });
    }
  }

  /**
   * change media service.
   * @param req 
   * @param res 
   * @returns 
   */
  async changeMedia(req: any, res: any) {
    try {
      const id = +req.params.id;
      const detailMedia = await this.getMediaById(id);

      if (!detailMedia) {
        return res.status(404).send("Media is not found");
      }

      const mediaObj: any = {
        updatedUserId: req.headers['userid'],
        updatedAt: new Date().toISOString()
      } as any;

      req?.body?.name ? mediaObj.name = req.body.name : null;
      req?.body?.status ? mediaObj.status = req.body.status : null;

      console.log('-------mediaObj', mediaObj);

      const updateMediaData = await MediaDbModel.update(mediaObj, {
        where: { id: id as number }
      });
      return res.json({
        success: true,
        message: 'Media status is updated successfully',
        data: updateMediaData
      });
    } catch (e: any) {
      console.log('------update Media status error----', e);
      return res.status(400).json({
        success: false,
        message: e.toString()
      });
    }
  }
}

export const mediaService = new MediaService();