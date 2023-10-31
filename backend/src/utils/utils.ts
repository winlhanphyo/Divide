import fs from "fs";
import nodemailer from "nodemailer";

export const deleteFile = (filePath: string) => {
  console.log('filename', filePath);
  fs.unlink(filePath, (err: any) => {
    if (err) console.log(err);
  });
};

export const sendEmail = async (email: any, subject: any, text: any) => {
  try {
    const transporter = nodemailer.createTransport({
      // host: "gigger-api.orionmmtecheng.com",
      // port: 465,
      // secure: true,
      // auth: {
      //   user: "support@gigger-api.orionmmtecheng.com",
      //   pass: "a0CPCk6n}ho3"
      // },
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: "spprt.oscar@gmail.com",
        pass: "cdbxlblhmnpobpyl"
      }

      // host: "oscar-admin.orionmmtecheng.com",
      // port: 465,
      // secure: true,
      // auth: {
      //   user: "support@oscar-admin.orionmmtecheng.com",
      //   pass: "M4tZjdsKYeTNKaWV"
      // },
    });

    const mailObj: any = {
      from: "spprt.oscar@gmail.com",
      to: email,
      subject: subject
    };
    mailObj.text = text;
    await transporter.sendMail(mailObj);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const sendContactUsEmail = async (email: any, subject: string, text: any) => {
  try {
    const transporter = nodemailer.createTransport({
      // host: 'smtp.gmail.com',
      // port: 587,
      // secure: false,
      // auth: {
      //   user: "spprt.oscar@gmail.com",
      //   pass: "cdbxlblhmnpobpyl"
      // }
      host: "oscar-admin.orionmmtecheng.com",
      port: 465,
      secure: true,
      auth: {
        user: "support@oscar-admin.orionmmtecheng.com",
        pass: "he&#5nvAtZ%J"
      },
    });

    await transporter.sendMail({
      from: "oscar-admin.orionmmtecheng.com",
      to: email,
      subject: subject,
      text: text,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};