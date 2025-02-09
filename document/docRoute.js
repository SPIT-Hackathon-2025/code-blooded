// routes/documentRoutes.js

import express from 'express';
import { createDocument,getAllDocuments } from './docController.js';

const router = express.Router();

// Route to create a document
router.post('/documents', createDocument);
router.get('/', getAllDocuments);
export default router;
