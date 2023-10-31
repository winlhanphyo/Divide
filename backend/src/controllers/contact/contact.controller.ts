import { Response, Request } from 'express';
import autobind from 'autobind-decorator';
import { contactService } from '../../services/contact';

@autobind
class ContactController {

  /**
   * create Category.
   * @param req 
   * @param res 
   */
  async postMessage(req: Request, res: Response) {
    const result = await contactService.postMessage(req, res);
    return result;
  }
}

export const contactController = new ContactController();