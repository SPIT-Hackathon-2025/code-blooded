// import React, { useEffect, useRef, useState, useContext } from "react";
// import { useNavigate, useLocation, useParams, Navigate } from "react-router-dom";
// import Client from "./Client";
// import Editor from "./MonacoEditor";
// import { initSocket } from "../Socket";
// import { ACTIONS } from "../Actions";
// import FolderStructure from "./FolderStructure";
// import { executeCode } from "../api";
// import { LANGUAGE_VERSIONS } from "../constants";
// import CommitModal from "./CommitModal";
// import { toast } from "react-hot-toast";
// import TeamContext from "../components/TeamContext";

// const LANGUAGES = Object.keys(LANGUAGE_VERSIONS);

// function EditorPage() {
//   const [clients, setClients] = useState([]);
//   const [output, setOutput] = useState("");
//   const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
//   const [isCompiling, setIsCompiling] = useState(false);
//   const [selectedLanguage, setSelectedLanguage] = useState("python");
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   const codeRef = useRef(null);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { fileName } = useParams();
//   const roomId = useContext(TeamContext);
//   const socketRef = useRef(null);

//   const [clientRoles, setClientRoles] = useState({});

// useEffect(() => {
//   // Initialize roles as "Viewer" for new clients
//   setClientRoles((prevRoles) => {
//     const newRoles = { ...prevRoles };
//     clients.forEach(client => {
//       if (!newRoles[client.socketId]) {
//         newRoles[client.socketId] = "Viewer"; 
//       }
//     });
//     return newRoles;
//   });
// }, [clients]);

// const updateRole = (socketId, newRole) => {
//   setClientRoles((prevRoles) => ({
//     ...prevRoles,
//     [socketId]: newRole,
//   }));
// };


//   // Fetch location.state from localStorage
//   const savedState = JSON.parse(localStorage.getItem('locationState'));

//   // If location.state is not present in current location, use savedState
//   const locationState = location.state || savedState;

//   useEffect(() => {
//     // Store location.state in localStorage when it arrives
//     if (location.state) {
//       localStorage.setItem('locationState', JSON.stringify(location.state));
//     }

//     // Debugging logs
//     console.log("location.state:", locationState);  // Check location state
//     console.log("fileName:", fileName);               // Check file name from params
//     console.log("roomId:", roomId);                   // Check room ID from context

//     const init = async () => {
//       socketRef.current = await initSocket();
//       socketRef.current.on("connect_error", handleErrors);
//       socketRef.current.on("connect_failed", handleErrors);

//       function handleErrors(err) {
//         console.error("Socket Error:", err);
//         toast.error("Socket connection failed. Try again later.");
//         navigate("/");
//       }

//       socketRef.current.emit(ACTIONS.JOIN, {
//         roomId,
//         username: locationState?.username,
//       });

//       socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
//         if (username !== locationState?.username) {
//           toast.success(`${username} joined the room.`);
//         }
//         setClients(clients);
//       });

//       socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
//         toast.success(`${username} left the room`);
//         setClients((prev) => prev.filter((client) => client.socketId !== socketId));
//       });
//     };

//     init();

//     return () => {
//       socketRef.current?.disconnect();
//       socketRef.current?.off(ACTIONS.JOINED);
//       socketRef.current?.off(ACTIONS.DISCONNECTED);
//     };
//   }, [navigate]);

//   // Debugging the redirect logic
//   if (!locationState) {
//     console.log("No location.state, redirecting to '/'.");
//     return <Navigate to="/" />;
//   }

//   const runCode = async () => {
//     setIsCompiling(true);
//     try {
//       const response = await executeCode(selectedLanguage, codeRef.current);
//       console.log("Execution response:", response);
//       setOutput(response.run?.output || "No output returned");
//     } catch (error) {
//       console.error("Error executing code:", error);
//       setOutput("An error occurred while executing the code.");
//     } finally {
//       setIsCompiling(false);
//     }
//   };

//   return (
//     <div className="container-fluid vh-100 d-flex flex-column" style={{ backgroundColor: "#010101", overflowX:'hidden' }}>
//       <div className="row flex-grow-1">
//         {/* Client Panel */}
//         <div className="col-2 d-flex flex-column text-light" style={{ backgroundColor: "#14151c" }}>
//           <img src="/images/logo.png" alt="Logo" className="img-fluid mx-auto" style={{ width: "300px", marginTop: "-45px", marginLeft: "30px" }} />
//           <hr style={{ marginTop: "-3rem" }} />
//           {/* <div className="d-flex flex-column flex-grow-1 overflow-auto">
//             <span className="mb-2">Members</span>
//             {clients.map((client) => (
//               <Client key={client.socketId} username={client.username} />
//             ))}
//           </div> */}
//           <div className="d-flex flex-column flex-grow-1 overflow-auto">
//           <span className="mb-2">Members</span>
//           {clients.map((client) => (
//             <Client 
//               key={client.socketId} 
//               username={client.username} 
//               socketId={client.socketId} 
//               role={clientRoles[client.socketId] || "Viewer"} 
//               updateRole={updateRole} 
//             />
//           ))}
//         </div>
//           <hr />
//           <div className="mt-auto mb-3">
//             <button className="btn w-100 mb-2" style={{ backgroundColor: "#0ffaf3", borderRadius: "15px" }} onClick={() => navigator.clipboard.writeText(roomId)}>
//               Copy Room ID
//             </button>
//             <button className="btn w-100" style={{ borderColor: "#0ffaf3", backgroundColor: "#14151c", color: "#fff", borderRadius: "15px" }} onClick={() => navigate("/")}>
//               Leave Room
//             </button>
//           </div>
//         </div>

//         {/* Editor Panel */}
//         <div className="col-8 d-flex flex-column text-light">
//           <div className="p-2 d-flex justify-content-between align-items-center" style={{ backgroundColor: "#010101" }}>
//             <button className="btn" style={{ backgroundColor: "#0ffaf3", fontSize: "14px", fontWeight: 500, fontFamily: "'Montserrat', sans-serif" }} onClick={() => setIsModalOpen(true)}>
//               Commit Changes
//             </button>
//             <select className="form-select w-auto" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
//               {LANGUAGES.map((lang) => (
//                 <option key={lang} value={lang}>{lang}</option>
//               ))}
//             </select>
//           </div>

//           {/* Code Editor - Always Fresh When File Changes */}
//           {/* <Editor socketRef={socketRef} roomId={roomId} key={fileName}
//           onCodeChange={(code) => { codeRef.current = code; }}  /> */}
//             {fileName ? (
//               <Editor 
//                 socketRef={socketRef} 
//                 roomId={roomId} 
//                 key={fileName} 
//                 onCodeChange={(code) => { codeRef.current = code; }}  
//               />
//             ) : (
//               <div className="d-flex align-items-center justify-content-center flex-grow-1 text-light">
//                 <h4 style={{fontFamily: "'Montserrat', sans-serif"}}>Select a file from the folder structure to start editing</h4>
//               </div>
//             )}
//         </div>


//         {/* Folder Structure Panel */}
//         <div className="col-2 d-flex flex-column" style={{backgroundColor:'#010101'}}>
//           <FolderStructure />
//         </div>
//       </div>

//       {/* Compiler */}
//       <button className="btn position-fixed bottom-0 end-0 m-3" onClick={() => setIsCompileWindowOpen(!isCompileWindowOpen)} style={{ zIndex: 1050, backgroundColor: "#0ffaf3", fontFamily: "'Montserrat', sans-serif", fontSize: "14px", fontWeight: 500, borderRadius: "15px"  }}>
//         {isCompileWindowOpen ? "Close Compiler" : "Open Compiler"}
//       </button>
//       <div className={`text-light p-3 ${isCompileWindowOpen ? "d-block" : "d-none"}`} style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: isCompileWindowOpen ? "30vh" : "0", transition: "height 0.3s ease-in-out", overflowY: "auto", backgroundColor: '#010101', zIndex: 1040 }}>
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 className="m-0" style={{color:'#0ffaf3'}}>Compiler Output ({selectedLanguage})</h5>
//           <div>
//             <button className="btn me-2" onClick={runCode} disabled={isCompiling} style={{backgroundColor:'#0ffaf3', fontFamily: "'Montserrat', sans-serif", fontSize: "14px", fontWeight: 500, borderRadius: "15px" }}>
//               {isCompiling ? "Compiling..." : "Run Code"}
//             </button>
//           </div>
//         </div>
//         <pre className="p-3 rounded" style={{backgroundColor:'#14151c'}}>{output || "Output will appear here after compilation"}</pre>
//       </div>

//       {/* Commit Modal */}
//       <CommitModal show={isModalOpen} handleClose={() => setIsModalOpen(false)} code={""} />
//     </div>
//   );
// }

// export default EditorPage;


import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useLocation, useParams, Navigate } from "react-router-dom";
import Client from "./Client";
import Editor from "./MonacoEditor";
import { initSocket } from "../Socket";
import { ACTIONS } from "../Actions";
import FolderStructure from "./FolderStructure";
import { executeCode } from "../api";
import { LANGUAGE_VERSIONS } from "../constants";
import CommitModal from "./CommitModal";
import { toast } from "react-hot-toast";
import TeamContext from "../components/TeamContext";
import axios from "axios"; // Import axios for HTTP requests

const LANGUAGES = Object.keys(LANGUAGE_VERSIONS);

function EditorPage() {
  const [clients, setClients] = useState([]);
  const [output, setOutput] = useState("");
  const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const codeRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { fileName } = useParams();
  const roomId = useContext(TeamContext);
  const socketRef = useRef(null);

  const [clientRoles, setClientRoles] = useState({});

  useEffect(() => {
    // Initialize roles as "Viewer" for new clients
    setClientRoles((prevRoles) => {
      const newRoles = { ...prevRoles };
      clients.forEach(client => {
        if (!newRoles[client.socketId]) {
          newRoles[client.socketId] = "Viewer"; 
        }
      });
      return newRoles;
    });
  }, [clients]);

  // Function to handle role change and send the POST request
  const updateRole = async (socketId, newRole) => {
    setClientRoles((prevRoles) => ({
      ...prevRoles,
      [socketId]: newRole,
    }));

    try {
      // Send POST request to update role
      await axios.post("/team/update-role", {
        roomId,
        userId: socketId, // Assuming `socketId` is the userId
        role: newRole
      });
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role.");
    }
  };

  // Fetch location.state from localStorage
  const savedState = JSON.parse(localStorage.getItem('locationState'));
  const locationState = location.state || savedState;

  useEffect(() => {
    if (location.state) {
      localStorage.setItem('locationState', JSON.stringify(location.state));
    }

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
        username: locationState?.username,
      });

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== locationState?.username) {
          toast.success(`${username} joined the room.`);
        }
        setClients(clients);
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
  }, [navigate]);

  if (!locationState) {
    console.log("No location.state, redirecting to '/'");
    return <Navigate to="/" />;
  }

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

  return (
    <div className="container-fluid vh-100 d-flex flex-column" style={{ backgroundColor: "#010101", overflowX:'hidden' }}>
      <div className="row flex-grow-1">
        {/* Client Panel */}
        <div className="col-2 d-flex flex-column text-light" style={{ backgroundColor: "#14151c" }}>
          <img src="/images/logo.png" alt="Logo" className="img-fluid mx-auto" style={{ width: "300px", marginTop: "-45px", marginLeft: "30px" }} />
          <hr style={{ marginTop: "-3rem" }} />
          <div className="d-flex flex-column flex-grow-1 overflow-auto">
            <span className="mb-2">Members</span>
            {clients.map((client) => (
              <Client 
                key={client.socketId} 
                username={client.username} 
                socketId={client.socketId} 
                role={clientRoles[client.socketId] || "Viewer"} 
                updateRole={updateRole} 
              />
            ))}
          </div>
          <hr />
          <div className="mt-auto mb-3">
            <button className="btn w-100 mb-2" style={{ backgroundColor: "#0ffaf3", borderRadius: "15px" }} onClick={() => navigator.clipboard.writeText(roomId)}>
              Copy Room ID
            </button>
            <button className="btn w-100" style={{ borderColor: "#0ffaf3", backgroundColor: "#14151c", color: "#fff", borderRadius: "15px" }} onClick={() => navigate("/")}>
              Leave Room
            </button>
          </div>
        </div>

        {/* Editor Panel */}
        <div className="col-8 d-flex flex-column text-light">
          <div className="p-2 d-flex justify-content-between align-items-center" style={{ backgroundColor: "#010101" }}>
            <button className="btn" style={{ backgroundColor: "#0ffaf3", fontSize: "14px", fontWeight: 500, fontFamily: "'Montserrat', sans-serif" }} onClick={() => setIsModalOpen(true)}>
              Commit Changes
            </button>
            <select className="form-select w-auto" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {fileName ? (
            <Editor 
              socketRef={socketRef} 
              roomId={roomId} 
              key={fileName} 
              onCodeChange={(code) => { codeRef.current = code; }}  
            />
          ) : (
            <div className="d-flex align-items-center justify-content-center flex-grow-1 text-light">
              <h4 style={{fontFamily: "'Montserrat', sans-serif"}}>Select a file from the folder structure to start editing</h4>
            </div>
          )}
        </div>

        {/* Folder Structure Panel */}
        <div className="col-2 d-flex flex-column" style={{backgroundColor:'#010101'}}>
          <FolderStructure />
        </div>
      </div>

      {/* Compiler */}
      <button className="btn position-fixed bottom-0 end-0 m-3" onClick={() => setIsCompileWindowOpen(!isCompileWindowOpen)} style={{ zIndex: 1050, backgroundColor: "#0ffaf3", fontFamily: "'Montserrat', sans-serif", fontSize: "14px", fontWeight: 500, borderRadius: "15px" }}>
        {isCompileWindowOpen ? "Close Compiler" : "Open Compiler"}
      </button>
      <div className={`text-light p-3 ${isCompileWindowOpen ? "d-block" : "d-none"}`} style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: isCompileWindowOpen ? "30vh" : "0", transition: "height 0.3s ease-in-out", overflowY: "auto", backgroundColor: '#010101', zIndex: 1040 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0" style={{color:'#0ffaf3'}}>Compiler Output ({selectedLanguage})</h5>
          <div>
            <button className="btn me-2" onClick={runCode} disabled={isCompiling} style={{backgroundColor:'#0ffaf3', fontFamily: "'Montserrat', sans-serif", fontSize: "14px", fontWeight: 500, borderRadius: "15px" }}>
              {isCompiling ? "Compiling..." : "Run Code"}
            </button>
          </div>
        </div>
        <pre className="p-3 rounded" style={{backgroundColor:'#14151c'}}>{output || "Output will appear here after compilation"}</pre>
      </div>

      {/* Commit Modal */}
      <CommitModal show={isModalOpen} handleClose={() => setIsModalOpen(false)} code={""} />
    </div>
  );
}

export default EditorPage;
