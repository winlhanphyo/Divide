import { Response, Request } from 'express';
import autobind from 'autobind-decorator';
import { mediaService } from '../../services/media';
import { PAGINATION_LIMIT } from '../../utils/constant';
import { Op } from 'sequelize';

@autobind
class MediaController {

  /**
   * get all media data.
   * @param req 
   * @param res 
   * @returns 
   */
  async getAllMedia(req: Request, res: Response) {
    let offset = Number(req.query.page) - 1 || 0;
    const size = Number(req.query.size) || PAGINATION_LIMIT;
    const name = req.query.name;
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
    }
    const response = await mediaService.getMediaList(undefined, otherFindOptions, page, size, res);
    return response;
  }

  /**
   * create media.
   * @param req 
   * @param res 
   * @returns 
   */
  async createMedia(req: Request, res: Response) {
    const result = await mediaService.createMedia(req, res);
    return result;
  }

  /**
    * delete media.
    * @param req 
    * @param res 
    */
  deleteMedia(req: any, res: any) {
    const data = mediaService.deleteMedia(req, res);
    return data;
  }

  /**
   * media detail.
   * @param req 
   * @param res 
   */
  async detailMedia(req: Request, res: Response) {
    const id = +req.params.id;
    const mediaData = await mediaService.getMediaById(id, res);
    return mediaData;
  }

  /**
   * get media with product id.
   * @param req 
   * @param res 
   * @returns 
   */
  async getMediaWithProductId(req: Request, res: Response) {
    const id = +req.params.id;
    let offset = Number(req.query.page) - 1 || 0;
    const size = Number(req.query.size) || PAGINATION_LIMIT;
    const name = req.query.name;
    let page = offset * size;
    let otherFindOptions: any = undefined;

    if (name) {
      otherFindOptions = {
        where: {
          name: {
            [Op.like]: `%${name}%`
          }
        }
      };
    }
    const mediaData = await mediaService.getMediaWithProductId(undefined, id, otherFindOptions, page, size, res);

    return mediaData;
  }

  /**
   * change media with media id.
   * @param req 
   * @param res 
   * @returns 
   */
  async changeMedia(req: any, res: any) {
    const data = mediaService.changeMedia(req, res);
    return data;
  }
  
}

export const mediaController = new MediaController();