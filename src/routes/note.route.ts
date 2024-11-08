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

    //route to create a new note
    this.router.post('/create', this.NoteValidator.newNote, userAuth, this.NoteController.newNote);
    this.router.get('/viewbyid/:id', userAuth, redisGetNotes, this.NoteController.viewNoteById);
    this.router.put('/update/:id', userAuth, this.NoteController.updateNote);
    this.router.delete('/delete/:id', userAuth, this.NoteController.deleteNote);
    this.router.delete('/trash/:id', userAuth, this.NoteController.trashNote);
    this.router.get('/viewall', userAuth, redisGetNotes, this.NoteController.viewAllNote);
    this.router.patch('/archive/:id', userAuth, this.NoteController.archiveNote);
    //this.router.get('/restore/:id', userAuth, this.NoteController.restoreNote);


  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default NoteRoutes;
