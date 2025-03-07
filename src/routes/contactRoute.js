import express from 'express';

import { sendContactInfo } from '../controllers/contactController.js';

const router = express.Router();

router.post('/', sendContactInfo);

export default router;
