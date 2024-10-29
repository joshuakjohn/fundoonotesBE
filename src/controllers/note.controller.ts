/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import noteService from '../services/note.service';
import dotenv from 'dotenv'
dotenv.config();

import { Request, Response, NextFunction } from 'express';

class NoteController {
  public NoteService = new noteService();

  //creating a new note
  public newNote = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try { 
      const data = await this.NoteService.createNote(req.body, res.locals.id);
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        data: data,
        message: 'Note created successfully'
      });
    } catch (error) {
        next(error);
    }
  };

  //view note by noteid
  public viewNoteById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try{
        res.status(HttpStatus.CREATED).json({
            code: HttpStatus.CREATED,
            data: await this.NoteService.getNoteById(req.params.id)
        });
    }catch(error){
        next(error);
    }
  }
  
  //update note by noteid
  public updateNote = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try{
        res.status(HttpStatus.CREATED).json({
            code: HttpStatus.CREATED,
            data: await this.NoteService.updateNote(req.params.id, req.body),
            message: "Note updated successfully"
        });
    }catch(error){
        next(error);
    }
  }

  //trash or untrash note
  public trashNote = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try{
        res.status(HttpStatus.CREATED).json({
            code: HttpStatus.CREATED,
            data: await this.NoteService.trashNote(req.params.id),
        });
    }catch(error){
        next(error);
    }
  }

  //permenently delete a note
  public deleteNote = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try{
        await this.NoteService.deleteNote(req.params.id)
        res.status(HttpStatus.CREATED).json({
            code: HttpStatus.CREATED,
            message: "Deleted successfully" 
        });
    }catch(error){
        next(error);
    }
  }

  // public restoreNote = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  //   try{
  //       res.status(HttpStatus.CREATED).json({
  //           code: HttpStatus.CREATED,
  //           data: await this.NoteService.restoreNote(req.params.id)
  //       });
  //   }catch(error){
  //       next(error);
  //   }
  // }

  //view all notes created by a specific user
  public viewAllNote = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try{
        res.status(HttpStatus.CREATED).json({
            code: HttpStatus.CREATED,
            data: await this.NoteService.viewAll(res.locals.id)
        });
    }catch(error){
        next(error);
    }
  }

  //archive or unarchive a note
  public archiveNote = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try{
        res.status(HttpStatus.CREATED).json({
            code: HttpStatus.CREATED,
            data: await this.NoteService.archiveNote(req.params.id)
        });
    }catch(error){
        next(error);
    }
  }

}

export default NoteController;
