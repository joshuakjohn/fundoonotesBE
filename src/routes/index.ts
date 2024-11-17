import express, { IRouter } from 'express';
import userRoute from './user.route';
import noteRoutes from './note.route';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger/openapi.json';


const router = express.Router();

/**
 * Function contains Application routes
 *
 * @returns router
 */
const routes = (): IRouter => {

  //user routes
  router.use('/users', new userRoute().getRoutes());

  //notes routes
  router.use('/notes', new noteRoutes().getRoutes())

  //swagger route
  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  return router;
};

export default routes;
