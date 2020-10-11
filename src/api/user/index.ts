import { Router } from 'express';
import user from './user/user.route';

const router: Router = Router();
router.use('/user', user);

export default router;