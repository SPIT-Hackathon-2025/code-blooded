import React, { useEffect, useRef, useState } from "react";
import Client from "./Client";
import Editor from "./MonacoEditor";
import { initSocket } from "../Socket";
import { ACTIONS } from "../Actions";
import { executeCode } from "../api";
import { LANGUAGE_VERSIONS } from "../constants";
import { useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import FolderStructure from "./FolderStructure";

// List of supported languages
const LANGUAGES = Object.keys(LANGUAGE_VERSIONS);

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

function EditorPage() {
  const [clients, setClients] = useState([]);
  const [output, setOutput] = useState("");
  const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [openFolders, setOpenFolders] = useState({});

  const codeRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const socketRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", handleErrors);
      socketRef.current.on("connect_failed", handleErrors);

      function handleErrors(err) {
        console.error("Socket Error:", err);
        toast.error("Socket connection failed. Try again later.");
        navigate("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room.`);
        }
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        });
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => prev.filter((client) => client.socketId !== socketId));
      });
    };

    init();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
    };
  }, [navigate, roomId, location.state]);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied!");
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Unable to copy the Room ID.");
    }
  };

  const leaveRoom = () => {
    navigate("/");
  };

  const runCode = async () => {
    setIsCompiling(true);
    try {
      const response = await executeCode(selectedLanguage, codeRef.current);
      console.log("Execution response:", response);
      setOutput(response.run?.output || "No output returned");
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput("An error occurred while executing the code.");
    } finally {
      setIsCompiling(false);
    }
  };

  const toggleCompileWindow = () => {
    setIsCompileWindowOpen(!isCompileWindowOpen);
  };

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
    <div className="container-fluid vh-100 d-flex flex-column" style={{ backgroundColor: "#111518" }}>
      <div className="row flex-grow-1" style={{ backgroundColor: "#010101" }}>
        {/* Client Panel */}
        <div className="col-md-2 text-light d-flex flex-column" style={{ backgroundColor: "#14151c" }}>
          <img src="/images/logo.png" alt="Logo" className="img-fluid mx-auto" style={{ width: "300px", marginTop: "-45px", marginLeft: "30px" }} />
          <hr />
          <div className="d-flex flex-column flex-grow-1 overflow-auto">
            <span>Members</span>
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
          <hr />
          <button className="btn btn-primary w-100 mb-2" onClick={copyRoomId}>Copy Room ID</button>
          <button className="btn btn-danger w-100" onClick={leaveRoom}>Leave Room</button>
        </div>

        {/* Editor Panel */}
        <div className="col-md-8 text-light d-flex flex-column">
          <div className="p-2 d-flex justify-content-end">
            <select className="form-select w-auto" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => { codeRef.current = code; }} />
        </div>

        

{/* Folder Panel */}
<FolderStructure />

      </div>
    </div>
  );
}

export default EditorPage;
