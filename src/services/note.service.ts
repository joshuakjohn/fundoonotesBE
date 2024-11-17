import { INote } from "../interfaces/note.interface";
import note from "../models/note.model";
import redisClient from "../config/redis";


class NoteServices{

    //create a note service
    public createNote = async (body: INote, userId: any): Promise<INote> => {
        try{
            body.createdBy = userId;
            const data = await note.create(body);
            redisClient.del(`notes:${userId}`)
            return data;

        }catch(err){
            throw new Error("Error occured during creation: "+err);
        }
    }

    //get a note by id service
    public getNoteById = async (id: string) => {
        try{
            const res = await note.findById({_id: id})
            return res
        }catch(error){
            throw new Error("cannot find by id: "+error)
        }
    }

    //update note service
    public updateNote = async (id: string, data: any, userID: any) => {
        try{
            redisClient.del(`notes:${userID}`)
            return note.findByIdAndUpdate({_id: id}, data, {new: true})
        }catch(error){
            throw new Error("cannot find by id and update: "+error)
        }
    }

    //trash a note service
    public trashNote = async (id: string, userID: any) => {
        const doc: INote = await note.findOne({_id: id});
        redisClient.del(`notes:${userID}`)
        if(doc.isTrash === false){
            return {data: await note.findByIdAndUpdate(id, {isTrash: true}, {new: true}),
                    message: "Note trashed successfully"
                }
        }else{
            return {data: await note.findByIdAndUpdate(id, {isTrash: false}, {new: true}),
                    message: "Note untrashed successfully"
                }
        }
    }

    //delete a trashed note permenetly
    public deleteNote = async (id: string, userID: any) => {
        try{
            const doc: INote = await note.findOne({_id: id, isTrash: true})
            redisClient.del(`notes:${userID}`)
            if(doc){
                await note.findByIdAndDelete(id)
            }
            else
                throw new Error("Nothing in trash with given id")
        }catch(error){
            throw new Error("cannot find by id and delete: "+error)
        }
    }

    //viewall note service
    public viewAll = async (id: string) => {
        try{
            const res = await note.find({createdBy: id});
            await redisClient.setEx(`notes:${id}`, 3600, JSON.stringify(res));
            console.log("from db")
            return res;
        }catch(error){
            throw new Error("cannot find: "+error)
        }
    }

    //archive a note service
    public archiveNote = async (id: string, userID: any): Promise<any> => {
        const doc: INote = await note.findOne({_id: id});
        redisClient.del(`notes:${userID}`)
        if(doc.isArchive === false){
            return {data: await note.findByIdAndUpdate(id, {isArchive: true}, {new: true}),
                    message: "Note archived successfully"
                }
        }else{
            return {data: await note.findByIdAndUpdate(id, {isArchive: false}, {new: true}),
                    message: "Note unarchived successfully"
                }
        }       
    }
}

export default NoteServices;