import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = ".."; // Replace with your API key

function CommitModal({ show, handleClose, code }) {
  const [commitMessage, setCommitMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const generateCommitMessage = async () => {
    if (!code) {
      alert("No code found to generate commit message.");
      return;
    }

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Analyze the following code and generate a concise commit message (max 6 words):\n\n${code}`;
      const response = await model.generateContent(prompt);
      const commitText = response.response.text().trim().split("\n")[0];

      setCommitMessage(commitText);
    } catch (error) {
      console.error("Error generating commit message:", error);
      alert("Failed to generate AI commit message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Commit Changes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Commit Message</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a commit message"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="secondary"
            className="w-100 mb-2"
            onClick={generateCommitMessage}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate AI Commit Message"}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => console.log("Commit: ", commitMessage)}>
          Commit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CommitModal;
