import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/index';

describe('User and Note APIs Test', () => {
  let userToken: string;
  let createdNoteId: string;

  before(async () => {
    const clearCollections = async () => {
      for (const users in mongoose.connection.collections) {
        await mongoose.connection.collections[users].deleteMany({});
      }
    };

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.DATABASE_TEST);
      await clearCollections();
    } else {
      await clearCollections();
    }
  });

  const mockUser = {
    fname: 'John',
    lname: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123'
  };

  describe('User registeration', () => {
    it('should create a new user with hashed password', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/users/signup')
        .send(mockUser);

      expect(res.statusCode).to.be.equal(201);
      expect(res.body.message).to.equal(`User created successfully`);
    });

    it('should return an error if the email already exists', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/users/signup')
        .send(mockUser);

      expect(res.statusCode).to.be.equal(500);
      expect(res.body.message).to.include('User already exist');
    });

    describe('User Login', () => {
      it('should log in the user successfully', async () => {
        const loginDetails = {
          email: mockUser.email,
          password: mockUser.password
        };
        const res = await request(app.getApp())
          .post('/api/v1/users')
          .send(loginDetails);

        expect(res.statusCode).to.be.equal(200);
        expect(res.body.token).to.be.a('string');
        expect(res.body.message).to.equal(`Login Successful`);
        userToken = res.body.token;
      });

      it('should return error if user does not exist', async () => {
        const invalidUser = {
          email: 'nonexistent.email@example.com',
          password: 'somepassword'
        };
        const res = await request(app.getApp())
          .post('/api/v1/users')
          .send(invalidUser);

        expect(res.statusCode).to.be.equal(401);
        expect(res.text).to.equal('Invalid email');
      });

      it('should return error for incorrect password', async () => {
        const invalidPasswordUser = {
          email: mockUser.email,
          password: 'wrongpassword'
        };
        const res = await request(app.getApp())
          .post('/api/v1/users')
          .send(invalidPasswordUser);

        expect(res.statusCode).to.be.equal(401);
        expect(res.text).to.equal('Incorrect password');
      });
    });
  });

  describe('Note APIs', () => {
    it('should create a new note successfully', async () => {
      const mockNote = {
        title: 'Sample Note',
        description: 'This is a sample note.'
      };
      const res = await request(app.getApp())
        .post('/api/v1/notes')
        .set('Authorization', `Bearer ${userToken}`)
        .send(mockNote);
  
      expect(res.statusCode).to.equal(201);
      expect(res.body.message).to.equal('Note created successfully');
      expect(res.body.data).to.have.property('_id');
      createdNoteId = res.body.data._id;
    });
  
    it('should retrieve all notes for the user', async () => {
      const res = await request(app.getApp())
        .get('/api/v1/notes')
        .set('Authorization', `Bearer ${userToken}`);
  
      expect(res.statusCode).to.equal(201);
      expect(res.body.data).to.be.an('Array');
    });
  
    it('should retrieve a note by ID', async () => {
      const res = await request(app.getApp())
        .get(`/api/v1/notes/${createdNoteId}`)
        .set('Authorization', `Bearer ${userToken}`);
  
      expect(res.statusCode).to.equal(201);
      expect(res.body.data).to.have.property('_id', createdNoteId);
    });
  
    it('should update a note successfully', async () => {
      const updatedNote = {
        title: 'Updated Sample Note',
        description: 'This is an updated note.'
      };
      const res = await request(app.getApp())
        .put(`/api/v1/notes/${createdNoteId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedNote);
  
      expect(res.statusCode).to.be.equal(201);
      expect(res.body.message).to.equal('Note updated successfully');
      expect(res.body.data).to.have.property('title', updatedNote.title);
    });
  
    it('should trash a note successfully', async () => {
      const res = await request(app.getApp())
        .delete(`/api/v1/notes/${createdNoteId}/trash`)
        .set('Authorization', `Bearer ${userToken}`);
    
      expect(res.statusCode).to.be.equal(201);
      expect(res.body.data.message).to.equal('Note trashed successfully');
      expect(res.body.data.data).to.have.property('isTrash', true);
    });
    
    it('should untrash a note successfully', async () => {
      const res = await request(app.getApp())
        .delete(`/api/v1/notes/${createdNoteId}/trash`)
        .set('Authorization', `Bearer ${userToken}`);
    
      expect(res.statusCode).to.be.equal(201);
      expect(res.body.data.message).to.equal('Note untrashed successfully');
      expect(res.body.data.data).to.have.property('isTrash', false);
    });
    
    it('should archive a note successfully', async () => {
      const res = await request(app.getApp())
        .patch(`/api/v1/notes/${createdNoteId}`)
        .set('Authorization', `Bearer ${userToken}`);
    
      expect(res.statusCode).to.be.equal(201);
      expect(res.body.data.message).to.equal('Note archived successfully');
      expect(res.body.data.data).to.have.property('isArchive', true);
    });
    
    it('should unarchive a note successfully', async () => {
      const res = await request(app.getApp())
        .patch(`/api/v1/notes/${createdNoteId}`)
        .set('Authorization', `Bearer ${userToken}`);
    
      expect(res.statusCode).to.be.equal(201);
      expect(res.body.data.message).to.equal('Note unarchived successfully');
      expect(res.body.data.data).to.have.property('isArchive', false);
    });
  
    it('should permanently delete a note', async () => {
      const trashres = await request(app.getApp())
        .delete(`/api/v1/notes/${createdNoteId}/trash`)
        .set('Authorization', `Bearer ${userToken}`);
    
      expect(trashres.statusCode).to.be.equal(201);
      expect(trashres.body.data.message).to.equal('Note trashed successfully');
      expect(trashres.body.data.data).to.have.property('isTrash', true);



      const res = await request(app.getApp())
        .delete(`/api/v1/notes/${createdNoteId}`)
        .set('Authorization', `Bearer ${userToken}`);
  
      expect(res.statusCode).to.equal(201);
      expect(res.body.message).to.equal('Deleted successfully');
    });
  });
});

