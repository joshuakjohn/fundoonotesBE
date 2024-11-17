import { NextFunction, Request, Response } from 'express';
import redisClient from '../config/redis';
import HttpStatus from 'http-status-codes';


const redisGetNotes = async(req:Request, res:Response, next: NextFunction) => {
    
    
    try {
        let cachedPosts
        cachedPosts = await redisClient.get(`notes:${res.locals.id}`);
        if (cachedPosts) {
            console.log("from cache")
            res.status(HttpStatus.CREATED).json({
                code: HttpStatus.CREATED,
                data: await JSON.parse(cachedPosts)
            })
        } else 
            next();

    } catch(error){
        console.log(error)
        }

}

export default redisGetNotes;


