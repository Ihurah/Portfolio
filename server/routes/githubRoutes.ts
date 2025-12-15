import { Router } from 'express';
import githubController from '../controllers/githubController';

const router = Router();

router.get('/user/:username', githubController.getUser);
router.get('/repos/:username', githubController.getRepos);

export default router;
