import {IUser} from './user.interface';
import * as db from '../../../app/db/database/models';
import {Role} from '../roles/role.class';

let Db = db.user;
const Op =db.Sequelize;

export class User implements IUser{
    id: string;
    lastName:string;
    firstName:string;
    password:string;
    email:string;
    role:[string];
    
    constructor(payload?:any){
        Object.assign(this,payload);
    }

    async create(){
        return new Promise(async (resolve, reject) => {
            const t = await db.sequelize.transaction();
            try{
                const body = {
                    id: this.id,
                    lastName:this.lastName,
                    firstName:this.firstName,
                    password:this.password,
                    email:this.email,
                }
                let data = await Db.create(body,{transaction: t })
                let role = new Role({
                    userId: this.id,
                    createdById: this.id
                });
                await role.createTrans(this.role,t);
                await t.commit();
                //--------------------
                //let data1 = await this.getAllRms (this.id);
                var obj = data.dataValues;
                //obj["role"] = data1;
                //--------------------
                //var obj = data.dataValues;
                
                resolve(obj);
            }
            catch(error){
            console.log(error);
            await t.rollback();
            reject(error); 
            }        
        });

    }

    async getAllRms (id) {
        return new Promise(async (resolve, reject) => {
            db.sequelize.query(`SELECT rm_id,manager_name FROM relationship_managers WHERE rm_id IN (
                SELECT userId FROM userroles WHERE id = '`+id+`')`,{ type: db.sequelize.QueryTypes.SELECT})
                .then(data => {resolve(data);})
                .catch(err => {reject(err); });
        });
    }
}

