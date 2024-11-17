import express, { IRouter } from 'express';
import noteController from '../controllers/note.controller';
import noteValidator from '../validators/note.validator';
import { userAuth } from '../middlewares/auth.middleware';
import redisGetNotes from '../middlewares/redis.middleware';


class NoteRoutes {
  NoteValidator = new noteValidator();
  private NoteController = new noteController();
  private router = express.Router();

  constructor() {
    this.routes();
  }

  private routes = () => {

    //route to view all notes
    this.router.get('', userAuth, redisGetNotes, this.NoteController.viewAllNote);

    //route to create a new note
    this.router.post('', this.NoteValidator.newNote, userAuth, this.NoteController.newNote);

    //route to view a note by id
    this.router.get('/:id', userAuth, this.NoteController.viewNoteById);

    //route to update a note by id
    this.router.put('/:id', userAuth, this.NoteController.updateNote);

    //route to delete a note by id
    this.router.delete('/:id', userAuth, this.NoteController.deleteNote);

    //route to trash a note by id
    this.router.delete('/:id/trash', userAuth, this.NoteController.trashNote);

    //route to archive a note by id
    this.router.patch('/:id', userAuth, this.NoteController.archiveNote);


  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default NoteRoutes;
