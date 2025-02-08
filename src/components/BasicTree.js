import "./BasicTree.css";
import FolderTree from "./FolderTree";

function BasicTree() {
  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Folder Tree</h1>
        <FolderTree/>
      </div>
    </div>
  );
}

export default BasicTree;
