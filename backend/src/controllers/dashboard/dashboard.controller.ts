import { Response, Request } from 'express';
import autobind from 'autobind-decorator';
import { dashboardService } from '../../services/dashboard';
import { PAGINATION_LIMIT } from '../../utils/constant';

@autobind
class DashboardController {

  /**
   * get all media data.
   * @param req 
   * @param res 
   * @returns 
   */
  async getDashboardData(req: Request, res: Response) {
    const response = await dashboardService.getDashboardData(req, res);
    return response;
  }

}

export const dashboardController = new DashboardController();