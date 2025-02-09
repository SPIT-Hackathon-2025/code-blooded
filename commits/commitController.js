import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a commit
export async function createCommit(req, res) {
  const { message, authorId, documentId, changes } = req.body;

  try {
    // Get the current content of the document
    const document = await prisma.codeDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Create a new commit with the document's current content
    const newCommit = await prisma.commit.create({
      data: {
        message,
        authorId,
        documentId,
        content: document.content, // Store the full content of the document in the commit
        changes, // The changes made in this commit
      },
    });

    res.status(201).json(newCommit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create commit' });
  }
}

// Get all commits for a specific document
export async function getCommitsForDocument(req, res) {
  const { documentId } = req.params;

  try {
    const commits = await prisma.commit.findMany({
      where: { documentId },
      include: {
        author: true,  // Include author info in the response
        document: true, // Include document info
      },
      orderBy: {
        createdAt: 'desc', // Order commits by timestamp, latest first
      },
    });

    res.status(200).json(commits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch commits' });
  }
}

// Get a specific commit by ID
export async function getCommitById(req, res) {
  const { commitId } = req.params;

  try {
    const commit = await prisma.commit.findUnique({
      where: { id: commitId },
      include: {
        author: true,
        document: true,
      },
    });

    if (commit) {
      res.status(200).json(commit);
    } else {
      res.status(404).json({ error: 'Commit not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch commit' });
  }
}

// Get all commits for a user (author)
export async function getCommitsForUser(req, res) {
  const { userId } = req.params;

  try {
    const commits = await prisma.commit.findMany({
      where: { authorId: userId },
      include: {
        document: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(commits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch commits' });
  }
}

// Revert to a previous commit (restore a previous version of the document)
export async function revertToCommit(req, res) {
  const { commitId } = req.params;

  try {
    const commit = await prisma.commit.findUnique({
      where: { id: commitId },
    });

    if (!commit) {
      return res.status(404).json({ error: 'Commit not found' });
    }

    // Since each commit stores the document's full content, we can simply update the document with the commit's content
    await prisma.codeDocument.update({
      where: { id: commit.documentId },
      data: { content: commit.content }, // Restore the content from the commit
    });

    res.status(200).json({ message: 'Document reverted to this commit' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to revert commit' });
  }
}
