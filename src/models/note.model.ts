import { required } from '@hapi/joi';
import { INote } from '../interfaces/note.interface';
import { Types, model, Schema } from 'mongoose';
const ObjectId = Types.ObjectId;


const noteSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{ 
        type: String,
        required: true
    },
    color:{
        type: String,
        required: false
    },
    isArchive:{
        type: Boolean,
        required: true
    }, 
    isTrash:{
        type: Boolean,
        required: true
    }, 
    createdBy:{
        type: ObjectId,
        ref: 'Note',
        required: true
    } 
})

export default model<INote>('Note', noteSchema); 