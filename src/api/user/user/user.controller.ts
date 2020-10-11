import { Request, Response } from 'express';
import * as responses from '../helpers/response.header';
import { User} from './user.class';

var path = require('path');
var appDir = path.dirname(require.main.filename);
const fs = require('fs');

export default class UserController{
    public create =async(req,res,next) : Promise<any> =>{
        console.log(req.body);
        const {id,
            lastName,
            firstName,
            password,
            email,
            role} = req.body;
        let Service = new User({
            id: id,
            lastName:lastName,
            firstName:firstName,
            password:password,
            email:email,
            role:role
        });
        await Service.create()
            .then(data => {
                res.status(200).send(responses.successWithPayload('list', data));
            })
            .catch(err =>{next(err)} );       
    };

}