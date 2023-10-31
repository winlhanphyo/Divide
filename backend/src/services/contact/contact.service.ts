import { sendContactUsEmail } from "../../utils/utils";

class ContactService {

  async postMessage(req: any, res: any) {
    try {
      let msg = req.body.email;
      msg = msg + "\n" + req.body.msg;
      const mail = await sendContactUsEmail(process.env.contactMail, "Contact From Customer", msg);

      return res.json({
        msg: "Contact mail is sent successfully",
        status: 1
      });
    } catch (err: any) {
      return res.status(400).json({
        message: err.toString(),
        success: false
      })
      // logger.postErrorLogger.log('error', 'Error User Lists', err.toString());
    }
  };

}

export const contactService = new ContactService();