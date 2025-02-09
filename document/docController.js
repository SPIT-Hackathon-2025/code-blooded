// controllers/documentController.js

import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Controller for creating a document
export const createDocument = async (req, res) => {
  const { teamId, content, language,name } = req.body;

  try {
    const newDocument = await prisma.codeDocument.create({
      data: {
        teamId,
        content,
        language,
        name
      },
    });

    return res.status(201).json({ message: 'Document created successfully!', document: newDocument });
  } catch (error) {
    console.error('Error creating document:', error);
    return res.status(500).json({ error: 'Failed to create document' });
  }
};

export const getAllDocuments = async (req, res) => {
  try {
    const documents = await prisma.codeDocument.findMany({
      include: {
        team: true, // Optionally include the team details
      },
    });

    if (documents.length > 0) {
      return res.status(200).json(documents);
    } else {
      return res.status(404).json({ error: 'No documents found' });
    }
  } catch (error) {
    console.error('Error fetching documents:', error);
    return res.status(500).json({ error: 'Failed to fetch documents' });
  }
};