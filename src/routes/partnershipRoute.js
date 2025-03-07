import express from 'express';
import {contactController} from '../controllers/partnershipContactController.js';

const partnershipRouter = express.Router();

// Submit contact form
partnershipRouter.post("/", contactController.submitContact);


export default partnershipRouter;