// routes/commitsRoutes.js
import express from 'express';
import { createCommit, getCommitsForDocument, getCommitById, getCommitsForUser, revertToCommit } from './commitController.js';

const router = express.Router();

// Route to create a commit
router.post('/newcommit', createCommit);

// Route to get all commits for a specific document
router.get('/document/:documentId', getCommitsForDocument);

// Route to get a specific commit by ID
router.get('/:commitId', getCommitById);

// Route to get all commits for a user (author)
router.get('/user/:userId', getCommitsForUser);

// Route to revert to a specific commit
router.post('/revert/:commitId', revertToCommit);

export default router;
