import React, { useState } from "react";
import "./FolderStructure.css"; // Add custom styling if needed

const folderStructure = [
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
        children: [
          { name: "Header.jsx", type: "file" },
          { name: "Footer.jsx", type: "file" },
        ],
      },
      { name: "App.jsx", type: "file" },
    ],
  },
  {
    name: "public",
    children: [{ name: "logo.png", type: "file" }],
  },
  {
    name: "docs",
    children: [
      { name: "README.md", type: "file" },
      { name: "API.md", type: "file" },
    ],
  },
];

const FolderStructure = () => {
  const [openFolders, setOpenFolders] = useState({});

  const toggleFolder = (folderName) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  const renderFolderTree = (items, level = 0) => {
    return items.map((item) => {
      if (item.children) {
        return (
          <div key={item.name} className="folder-container">
            <div
              className="folder-item"
              onClick={() => toggleFolder(item.name)}
              style={{ paddingLeft: `${level * 15}px` }}
            >
              <span>{openFolders[item.name] ? "📂" : "📁"}</span>
              {item.name}
            </div>
            {openFolders[item.name] && (
              <div className="folder-children">
                {renderFolderTree(item.children, level + 1)}
              </div>
            )}
          </div>
        );
      }
      return (
        <div key={item.name} className="file-item" style={{ paddingLeft: `${level * 15}px` }}>
          📄 {item.name}
        </div>
      );
    });
  };

  return (
    <div
      className="col-md-2 text-light d-flex flex-column overflow-auto"
      style={{
        backgroundColor: "#14151c",
        borderLeft: "2px solid #0ffaf3",
        padding: "10px",
      }}
    >
      <h5 className="p-2" style={{ fontSize: "16px", color: "#0ffaf3" }}>
        📁 Project Structure
      </h5>
      <div className="folder-tree">{renderFolderTree(folderStructure)}</div>
    </div>
  );
};

export default FolderStructure;
