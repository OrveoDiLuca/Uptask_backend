import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string,
    name: string, 
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        //enviar el email
        const info = await transporter.sendMail({
            from: 'Uptask <admin@uptask.com>',
            to: user.email,
            subject: 'Uptask - Confirm your account',
            text: 'Uptask - Confirm your account',
            html: `<p>Hello: ${user.name}, your account is already created in UpTask, confirmed your account.</p>
                <p>Check the link.</p>
                <a href="${process.env.FRONT_END_URL}/auth/confirm-account">Confirm your account</a>
                <p>Put the code: <b>${user.token}</b></p>
                <p>This Token expire in 10 minutes.</p>
            `
        })

        
    }

    static sendPasswordResetToken = async (user: IEmail) => {
        //enviar el email
        const info = await transporter.sendMail({
            from: 'Uptask <admin@uptask.com>',
            to: user.email,
            subject: 'Uptask - Reset your password',
            text: 'Uptask - Reset your password',
            html: `<p>Hello: ${user.name}, has send reset your password.</p>
                <p>Check the link.</p>
                <a href="${process.env.FRONT_END_URL}/auth/new-password">Reset password</a>
                <p>Put the code: <b>${user.token}</b></p>
                <p>This Token expire in 10 minutes.</p>
            `
        })

        
    }
}