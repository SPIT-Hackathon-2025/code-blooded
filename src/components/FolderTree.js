import { useState } from "react";
import "./FolderTree.css"; // Importing the external CSS file

const FolderTree = () => {
  const [openFolders, setOpenFolders] = useState({});

  const toggleFolder = (folderName) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  const folders = [
    {
      name: "Project Files",
      children: [
        { name: "index.html", type: "file" },
        { name: "styles.css", type: "file" },
      ],
    },
    {
      name: "src",
      children: [
        {
          name: "components",
          type: "folder",
          children: [
            { name: "Header.jsx", type: "file" },
            { name: "Footer.jsx", type: "file" },
          ],
        },
        { name: "App.jsx", type: "file" },
      ],
    },
    {
      name: "images",
      type: "folder",
      children: [{ name: "logo.png", type: "file" }],
    },
    {
      name: "fonts",
      type: "folder",
      children: [],
    },
    {
      name: "docs",
      children: [
        { name: "README.md", type: "file" },
        { name: "API.md", type: "file" },
      ],
    },
    {
      name: "tests",
      children: [
        { name: "App.tests.js", type: "file" },
        { name: "utils.test.js", type: "file" },
      ],
    },
  ];

  const renderItem = (item, level = 0) => {
    const paddingLeft = `${level * 20}px`;

    if (item.type === "file") {
      return (
        <div key={item.name} className="file-item" style={{ paddingLeft }}>
          <span>📄</span>
          <span className="file-name">{item.name}</span>
        </div>
      );
    }

    return (
      <div key={item.name}>
        <div
          className="folder-item"
          style={{ paddingLeft }}
          onClick={() => toggleFolder(item.name)}
        >
          <span>{openFolders[item.name] ? "📂" : "📁"}</span>
          <span className="folder-name">{item.name}</span>
        </div>
        {openFolders[item.name] && item.children && (
          <div className="folder-children">
            {item.children.map((child) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return <div className="folder-container">{folders.map((folder) => renderItem(folder))}</div>;
};

export default FolderTree;
