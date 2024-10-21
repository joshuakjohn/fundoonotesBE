/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import noteService from '../services/note.service';
import dotenv from 'dotenv'
dotenv.config();

import { Request, Response, NextFunction } from 'express';
import { http } from 'winston';

class NoteController {
  public NoteService = new noteService();

  public newNote = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try { 
      const data = await this.NoteService.createNote(req.body);
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        data: data,
        message: 'Note created successfully'
      });
    } catch (error) {
        next(error);
    }
  };

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
  
  public updateNote = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try{
        res.status(HttpStatus.CREATED).json({
            code: HttpStatus.CREATED,
            data: await this.NoteService.updateNote(req.params.id, req.body)
        });
    }catch(error){
        next(error);
    }
  }

  public deleteNote = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try{
        res.status(HttpStatus.CREATED).json({
            code: HttpStatus.CREATED,
            data: await this.NoteService.deleteNote(req.params.id)
        });
    }catch(error){
        next(error);
    }
  }

}

export default NoteController;
