import { INote } from "../interfaces/note.interface";
import note from "../models/note.model";

class NoteServices{
    public createNote = async (body: INote): Promise<INote> => {
        try{
            const data = await note.create(body);
            return data;

        }catch(err){
            throw new Error("Error occured during creation: "+err);
        }
    }

    public getNoteById = async (id: string) => {
        try{
            return await note.findById({_id: id})
        }catch(error){
            throw new Error("cannot find by id: "+error)
        }
    }

    public updateNote = async (id: string, data: any) => {
        try{
            return note.findByIdAndUpdate({_id: id}, data, {new: true})
        }catch(error){
            throw new Error("cannot find by id and update: "+error)
        }
    }

    public deleteNote = async (id: string) => {
        try{
            return note.findByIdAndDelete({_id: id})
        }catch(error){
            throw new Error("cannot find by id and delete: "+error)
        }
    }
}

export default NoteServices;