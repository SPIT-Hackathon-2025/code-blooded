const express = require("express");
const {
  createFile,
  createFolder,
  commitRepoChanges,
  commitChanges,
  fetchRepoContents,
} = require("../controllers/giteaController");

const router = express.Router();

// Route to create a file in a repo
router.post("/create-file", createFile);

// Route to create a folder in a repo
router.post("/create-folder", createFolder);

// Route to commit multiple changes to a repo
router.post("/commit-repo", commitRepoChanges);

// Route to commit a single file change
router.post("/commit-file", commitChanges);

// Route to fetch all repo contents
router.get("/fetch-repo/:owner/:repo", async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const files = await fetchRepoContents(owner, repo);
    return res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching repo contents:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/commits/:owner/:repo", getAllCommits);

router.post("/rollback", rollbackToCommit);


module.exports = router;