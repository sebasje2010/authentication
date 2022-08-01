const UserService=require('./user.service');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')
const boom = require('@hapi/boom');
const {config}=require('../config/config')
const service= new UserService()
const nodemailer=require('nodemailer')
class AuthService {
    async getUser(email,password) {
        const user = await service.findByEmail(email);
        if(!user){
            throw boom.unauthorized('Invalid username');
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            throw boom.unauthorized('Invalid credentials');
        }
        delete user.dataValues.password;
        return user;
    }
    signToken(user){
        const payload={
            sub:user.id,
            role:user.role
        }
        const token=jwt.sign(payload,config.jwtSecret,{expiresIn:'1d'})
        return{
            user,
            token
        };
    }

    async sendRecovery(email){
        const user = await service.findByEmail(email);
        if(!user){
            throw boom.unauthorized('Invalid username');
        }
        const payload={sub:user.id}
        const token=jwt.sign(payload,config.jwtSecret,{expiresIn:'15min'})
        const link=`http://localhost:3000/resetPassword?token=${token}`
        await service.update(user.id,{recoveryToken:token})
        const mail={
            from: config.emailUser, // sender address
            to: `${user.email}`, // list of receivers
            subject: "Recupera tu contraseña", // Subject line
            // text: "Hello world?", // esto poner si quiero algo en texto plano
            html: `<b>Ingresa a este link para recuperar tu contraseña => ${link}</b>`, // html body
        }
        const rta = await this.sendEmail(mail)
        return rta
    }

    async sendEmail(infoMail){
        const transporter = nodemailer.createTransport({
            secure: true, // true for 465, false for other ports
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: config.emailUser,
                pass: config.emailPass
            }
        });
        await transporter.sendMail(infoMail)
        return { message: 'Email sent' };
    }
}
module.exports = AuthService;