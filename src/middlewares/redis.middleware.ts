import { NextFunction, Request, Response } from 'express';
import redisClient from '../config/redis';


const redisGetNotes = async(req:Request, res:Response, next: NextFunction) => {
    
    
    try {
        let cachedPosts
        cachedPosts = await redisClient.get(`notes:${res.locals.id}`);
        if (cachedPosts) {
            console.log("from cache")
            res.json(JSON.parse(cachedPosts));
        } else 
            next();

    } catch(error){
        console.log(error)
        }

}

export default redisGetNotes;


