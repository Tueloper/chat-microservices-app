import { Express } from 'express';
import { getRepository } from 'typeorm';
import User from '#root/db/entities/User';

const setUpRoutes = (app: Express) => {
  const userRespository = getRepository(User);

  app.get('/users/:userId', async (req, res, next) => {
    try {
      const user = await userRespository.findOne(req.params.userId);

      if (!user) return next(new Error('Invalid User Id!'));
      
      return res.json(user);
    } catch (error) {
      return next(error);
    }
  })
}

export default setUpRoutes;