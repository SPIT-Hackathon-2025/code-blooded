import React, { useState } from "react";
import "./FolderStructure.css";

const FolderStructure = () => {
  const [folderStructure, setFolderStructure] = useState([
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
  ]);
  const [openFolders, setOpenFolders] = useState({});

  const toggleFolder = (folderName) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  const addFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      setFolderStructure([...folderStructure, { name: folderName, children: [] }]);
    }
  };

  const addFile = (parentFolderName) => {
    const fileName = prompt("Enter file name:");
    if (fileName) {
      setFolderStructure((prevStructure) =>
        prevStructure.map((folder) =>
          folder.name === parentFolderName
            ? { ...folder, children: [...folder.children, { name: fileName, type: "file" }] }
            : folder
        )
      );
    }
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
              <span>{openFolders[item.name] ? "📂" : "📁"}</span> {item.name}
              <button className="btn  " style={{ zIndex: 1050, backgroundColor: "#0ffaf3", fontSize:"10px"}} onClick={(e) => { e.stopPropagation(); addFile(item.name); }}>Add File</button>
            </div>
            {openFolders[item.name] && (
              <div className="folder-children">{renderFolderTree(item.children, level + 1)}</div>
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
    <div className="text-light d-flex flex-column" style={{ backgroundColor: "#010101", padding: "10px" }}>
      <h5 className="p-2" style={{ fontSize: "16px", color: "#0ffaf3" }}>Project Structure</h5>
      <div>
        <button onClick={addFolder} className="btn bottom-0 end-0 m-3" style={{ zIndex: 1050, backgroundColor: "#0ffaf3", fontFamily: "'Montserrat', sans-serif", fontSize: "14px", fontWeight: 500 }}>📁Add Folder</button>
      </div>
      <div className="folder-tree">{renderFolderTree(folderStructure)}</div>
    </div>
  );
};

export default FolderStructure;
