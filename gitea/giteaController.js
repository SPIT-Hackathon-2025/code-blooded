const GITEA_API_URL = "http://localhost:3000/api/v1";
const GITEA_TOKEN = process.env.GITEA_TOKEN; 

export const createFile = async (req, res) => {
    try {
      const { repoName, filePath, content, authorName, authorEmail } = req.body;
  
      const response = await axios.put(
        `${GITEA_API_URL}/repos/your_username/${repoName}/contents/${filePath}`,
        {
          content: Buffer.from(content).toString("base64"), // Convert content to Base64
          message: `Created ${filePath}`,
          committer: {
            name: authorName,
            email: authorEmail,
          },
        },
        {
          headers: { Authorization: `token ${GITEA_TOKEN}` },
        }
      );
  
      return res.status(201).json(response.data);
    } catch (error) {
      console.error("Error creating file:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const createFolder = async (req, res) => {
    try {
      const { repoName, folderPath, authorName, authorEmail } = req.body;
      const filePath = `${folderPath}/.gitkeep`;
  
      const response = await axios.put(
        `${GITEA_API_URL}/repos/your_username/${repoName}/contents/${filePath}`,
        {
          content: "",
          message: `Created folder ${folderPath}`,
          committer: {
            name: authorName,
            email: authorEmail,
          },
        },
        {
          headers: { Authorization: `token ${GITEA_TOKEN}` },
        }
      );
  
      return res.status(201).json(response.data);
    } catch (error) {
      console.error("Error creating folder:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
};  

export const commitRepoChanges = async (req, res) => {
    try {
      const { owner, repo, message, changes } = req.body; // changes = array of modified files
  
      // Step 1: Get the latest commit SHA
      const latestCommitRes = await axios.get(
        `${GITEA_URL}/repos/${owner}/${repo}/git/commits/master`,
        { headers: { Authorization: `token ${GITEA_TOKEN}` } }
      );
      const latestCommitSha = latestCommitRes.data.sha;
      const latestTreeSha = latestCommitRes.data.tree.sha;
  
      // Step 2: Create a new tree with modified files
      const treeRes = await axios.post(
        `${GITEA_URL}/repos/${owner}/${repo}/git/trees`,
        {
          base_tree: latestTreeSha,
          tree: changes.map((file) => ({
            path: file.path,
            mode: "100644",
            type: "blob",
            content: file.content,
          })),
        },
        { headers: { Authorization: `token ${GITEA_TOKEN}` } }
      );
      const newTreeSha = treeRes.data.sha;
  
      // Step 3: Create a new commit
      const commitRes = await axios.post(
        `${GITEA_URL}/repos/${owner}/${repo}/git/commits`,
        {
          message,
          tree: newTreeSha,
          parents: [latestCommitSha],
        },
        { headers: { Authorization: `token ${GITEA_TOKEN}` } }
      );
      const newCommitSha = commitRes.data.sha;
  
      // Step 4: Update the branch reference (move HEAD to new commit)
      await axios.patch(
        `${GITEA_URL}/repos/${owner}/${repo}/git/refs/heads/master`,
        { sha: newCommitSha },
        { headers: { Authorization: `token ${GITEA_TOKEN}` } }
      );
  
      return res.status(200).json({ message: "Repo committed successfully", commitSha: newCommitSha });
    } catch (error) {
      console.error("Error committing repo:", error.response?.data || error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const commitChanges = async (req, res) => {
    try {
      const { repoName, filePath, content, commitMessage, authorName, authorEmail } = req.body;
  
      const response = await axios.put(
        `${GITEA_API_URL}/repos/your_username/${repoName}/contents/${filePath}`,
        {
          content: Buffer.from(content).toString("base64"),
          message: commitMessage,
          committer: {
            name: authorName,
            email: authorEmail,
          },
        },
        {
          headers: { Authorization: `token ${GITEA_TOKEN}` },
        }
      );
  
      return res.status(200).json(response.data);
    } catch (error) {
      console.error("Error committing changes:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
};  

// export const fetchRepoContents = async (req, res) => {
//     try {
//       const { repoName } = req.params;
  
//       const response = await axios.get(
//         `${GITEA_API_URL}/repos/your_username/${repoName}/contents`,
//         {
//           headers: { Authorization: `token ${GITEA_TOKEN}` },
//         }
//       );
  
//       return res.status(200).json(response.data);
//     } catch (error) {
//       console.error("Error fetching repo contents:", error);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
// };

export const fetchRepoContents = async (owner, repo, path = "") => {
  try {
    const response = await axios.get(
      `${GITEA_URL}/repos/${owner}/${repo}/contents/${path}`,
      { headers: { Authorization: `token ${GITEA_TOKEN}` } }
    );

    let allFiles = [];

    for (const item of response.data) {
        if (item.type === "file") {
            // Fetch file content
            const fileContent = await axios.get(item.download_url);
            allFiles.push({ path: item.path, content: fileContent.data });
        } else if (item.type === "dir") {
            // Recursively fetch folder contents
            const subfolderFiles = await fetchRepoContents(owner, repo, item.path);
            allFiles = [...allFiles, ...subfolderFiles];
        }
    }

        return allFiles;
    } catch (error) {
        console.error("Error fetching repo contents:", error.response?.data || error.message);
        return [];
    }
};


