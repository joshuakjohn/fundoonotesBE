import express, { IRouter } from 'express';
const router = express.Router();

import userRoute from './user.route';
import noteRoutes from './note.route';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger/openapi.json';

/**
 * Function contains Application routes
 *
 * @returns router
 */
const routes = (): IRouter => {
  router.get('/', (req, res) => {
    res.json('Welcome');
  });
  router.use('/users', new userRoute().getRoutes());
  router.use('/notes', new noteRoutes().getRoutes())
  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  return router;
};

export default routes;
