import express from 'express';
const router = express.Router();
import { sendContactInfo } from '../controllers/contactController.js';


router.post('/', sendContactInfo);

export default router;
