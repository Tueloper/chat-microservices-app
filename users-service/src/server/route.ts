import { Express } from 'express';
import { getRepository, getConnection } from 'typeorm';
import dayjs from 'dayjs';
import config from 'config';

import User from '#root/db/entities/User';
import UserSession from '#root/db/entities/UserSession';

import passwordCompareSync from '#root/helpers/passwordCompareSync';
import generateUUID from '#root/helpers/generateUUID';

const USERS_SESSION_HOUR_COUNT = <number>config.get('USERS_SESSION_HOUR_COUNT');

const setUpRoutes = (app: Express) => {

  const connection = getConnection();
  // defining typeorm query methods
  const userRespository = getRepository(User);

  // create sessions
  app.post('/session', async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(new Error('Invalid Body!'));
    }

    try {
      const user = await userRespository.findOne(
        { username }, { 
          select: ['id', 'password']
        }
      );

      if (!user) return next(new Error('Invalid username!'));

      if (!passwordCompareSync(password, user.password)) {
        return next(new Error("Invalid Password"))
      }

      const expiredAt = dayjs().add(USERS_SESSION_HOUR_COUNT, 'hour').toISOString();

      const session = generateUUID();

      const userSession = {
        userId: user.id,
        expiredAt,
        id: session
      }

      await connection.createQueryBuilder().insert().into(UserSession).values([userSession]);
      return res.json(userSession);
    } catch (error) {
      return next(error)
    }
  })

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