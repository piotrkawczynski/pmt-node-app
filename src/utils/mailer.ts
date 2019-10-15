import * as nodemailer from "nodemailer"
import * as Mail from "nodemailer/lib/mailer"

type MailType = "changePassword" | "registration"

export class Mailer {
  private transport: nodemailer.Transporter
  private mailTemplate: Mail.Options
  private email: string

  constructor(email: string, mailType: MailType) {
    this.createTransport()
    this.email = email
    return this
  }

  public changePasswordTemplate = (url: string) => {
    this.mailTemplate = {
      from: "pmt.support@adres.pl",
      to: `${this.email}`,
      subject: "Change password",
      html: `<h1>Change password</h1><a href="${url}">Click to change password</a>`,
    }

    return this
  }

  private createTransport = () => {
    this.transport = nodemailer.createTransport({
      host: "smtp.poczta.onet.pl",
      port: 465,
      secure: true,
      auth: {
        user: "pmt.support@adres.pl",
        pass: "Elfisz911",
      },
    })

    return this
  }

  public sendMail = () => {
    if (!this.mailTemplate) {
      throw Error("template error")
    }

    this.transport.sendMail(
      this.mailTemplate,
      (err, info) => {
        if (err) {
          console.log(err)
        }
      },
    )
  }
}
