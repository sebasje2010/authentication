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
    async sendEmail(email){
        const user = await service.findByEmail(email);
        if(!user){
            throw boom.unauthorized('Invalid username');
        }
        const transporter = nodemailer.createTransport({
            secure: true, // true for 465, false for other ports
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: config.emailUser,
                pass: config.emailPass
            }
        });
        await transporter.sendMail({
            from: config.emailUser, // sender address
            to: `${user.email}`, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        })
        return { message: 'Email sent' };
    }
}
module.exports = AuthService;