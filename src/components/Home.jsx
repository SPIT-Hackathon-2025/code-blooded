// import React, { useState } from "react";
// import { v4 as uuid } from "uuid";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import styled from 'styled-components';

// function Home() {
//   const [roomId, setRoomId] = useState("");
//   const [username, setUsername] = useState("");

//   const navigate = useNavigate();

//   const generateRoomId = (e) => {
//     e.preventDefault();
//     const Id = uuid();
//     setRoomId(Id);
//     toast.success("Room Id is generated");
//   };

//   const joinRoom = () => {
//     if (!roomId || !username) {
//       toast.error("Both the field is requried");
//       return;
//     }

//     // redirect
//     navigate(`/editor/${roomId}`, {
//       state: {
//         username,
//       },
//     });
//     toast.success("room is created");
//   };

//   // when enter then also join
//   const handleInputEnter = (e) => {
//     if (e.code === "Enter") {
//       joinRoom();
//     }
//   };

//   return (
//     <div>
//        <StyledWrapper>
//       <div className="row justify-content-center align-items-center min-vh-100">
//         <div className="col-12 col-md-6">\
//             <div className="card-body text-center" style={{backgroundColor:'#010101', padding:'30px', borderRadius:'40px',height:'50vh'}}>
//               {/* <img
//                 src="/images/codecast.png"
//                 alt="Logo"
//                 className="img-fluid mx-auto d-block"
//                 style={{ maxWidth: "150px" }}
//               /> */}
//               <h4 style={{fontFamily: "'Montserrat', sans-serif", paddingTop:'20px', color:'#0ffaf3'}}>Enter the Room ID</h4>

//               <div className="form-group">
//                 <input
//                   type="text"
//                   value={roomId}
//                   onChange={(e) => setRoomId(e.target.value)}
//                    className="form-control mb-2 custom-input"
//                   placeholder="Room Id"
//                   style={{fontFamily: "'Montserrat', sans-serif", backgroundColor:'#14151c', borderColor:'#9dfcfa', color:'#fff', borderRadius:'15px', marginTop:'20px'}}
//                   onKeyUp={handleInputEnter}
//                 />
//               </div>
//               <div className="form-group">
//                 <input
//                   type="text"
//                   value={username}
//                   style={{fontFamily: "'Montserrat', sans-serif", backgroundColor:'#14151c', borderColor:'#9dfcfa', color:'#fff', borderRadius:'15px', marginTop:'15px'}}
//                   onChange={(e) => setUsername(e.target.value)}
//                  className="form-control mb-2 custom-input"
//                   placeholder="Username"
//                   onKeyUp={handleInputEnter}
//                 />
//               </div>
//               <button
//                 onClick={joinRoom}
//                 style={{fontFamily: "'Montserrat', sans-serif", backgroundColor:'#0ffaf3', color:'#010101', marginTop:'30px', borderRadius:'20px', width:'120px'}}
//                 className="btn btn-success btn-lg btn-block"
//               >
//                 JOIN
//               </button>
//               <p className="mt-3 text-light" style={{fontFamily: "'Montserrat', sans-serif"}}>
//                 Don't have a room ID?
//                 <span
//                   onClick={generateRoomId}
//                   className=" text-success p-2"
//                   style={{ cursor: "pointer", fontFamily: "'Montserrat', sans-serif"}}
//                 >
//                   <p style={{ color:'#0ffaf3'}}>Create New Room</p>
//                 </span>
//               </p>
//             </div>
//           </div>
//       </div>
//       </StyledWrapper>
//     </div>
//   );
// }

// const StyledWrapper = styled.div`
  
//   `;

// export default Home;


//-------------------------------------------------------------


// import React, { useState, useContext } from "react";
// import { v4 as uuid } from "uuid";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import styled from "styled-components";
// import TeamContext from "../components/TeamContext";

// function Home() {
//   const { roomId, setRoomId } = useContext(TeamContext);
//   const [username, setUsername] = useState("");

//   const navigate = useNavigate();

//   const API_URL = "http://localhost:5000/team/create"

//   const generateRoomId = async (e) => {
//     e.preventDefault();

//     try{
//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ3OWViMzZiLWZjNTQtNDQwNC04ZDAzLTEwYjM4ZjNlM2E4NiIsImlhdCI6MTczOTA2NjIxOX0.O_qCMILpqemOB-bRogl9WDi0KoDjYFiqYjmoxcCEZWM`
//           //${localStorage.getItem("token")}`, // Assuming token-based auth
//         },
//         body: JSON.stringify({ name: roomId }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to create team");
//       }

//       setRoomId(data.team.id);
//       toast.success("Room ID (Team) successfully created!");
//     } catch (error) {
//       toast.error(error.message || "An error occurred while creating the team.");
//     }
//   };
    
//   const joinRoom = () => {
//     if (!roomId || !username) {
//       toast.error("Both fields are required");
//       return;
//     }

//     // Redirect to editor
//     navigate(`/editor/${roomId}`, {
//       state: { username },
//     });
//     toast.success("Room is created");
//   };

//   // Join room on Enter key
//   const handleInputEnter = (e) => {
//     if (e.code === "Enter") {
//       joinRoom();
//     }
//   };

//   return (
//     <StyledWrapper>
//       <div className="row justify-content-center align-items-center min-vh-100">
//         <div className="col-12 col-md-6">
//           <div className="card-body text-center" style={{ backgroundColor: "#010101", padding: "30px", borderRadius: "40px", height: "50vh" }}>
//             <h4 style={{ fontFamily: "'Montserrat', sans-serif", paddingTop: "20px", color: "#0ffaf3" }}>Enter the Room ID</h4>

//             <div className="form-group">
//               <input
//                 type="text"
//                 value={roomId}
//                 onChange={(e) => setRoomId(e.target.value)}
//                 className="form-control mb-2 custom-input"
//                 placeholder="Room Id"
//                 style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: "#14151c", borderColor: "#9dfcfa", color: "#fff", borderRadius: "15px", marginTop: "20px" }}
//                 onKeyUp={handleInputEnter}
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="form-control mb-2 custom-input"
//                 placeholder="Username"
//                 style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: "#14151c", borderColor: "#9dfcfa", color: "#fff", borderRadius: "15px", marginTop: "15px" }}
//                 onKeyUp={handleInputEnter}
//               />
//             </div>
//             <button
//               onClick={joinRoom}
//               style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: "#0ffaf3", color: "#010101", marginTop: "30px", borderRadius: "20px", width: "120px" }}
//               className="btn btn-success btn-lg btn-block"
//             >
//               JOIN
//             </button>
//             <p className="mt-3 text-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>
//               Don't have a room ID?
//               <span onClick={generateRoomId} className=" text-success p-2" style={{ cursor: "pointer", fontFamily: "'Montserrat', sans-serif" }}>
//                 <p style={{ color: "#0ffaf3" }}>Create New Room</p>
//               </span>
//             </p>
//           </div>
//         </div>
//       </div>
//     </StyledWrapper>
//   );
// }

// const StyledWrapper = styled.div``;

// export default Home;

import React, { useState, useContext } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TeamContext from "../components/TeamContext";

function Home() {
  const { roomId, setRoomId } = useContext(TeamContext);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const API_URL = "http://localhost:5000/team/create";

  const generateRoomId = async (e) => {
    e.preventDefault();

    console.log("Generating Room ID..."); // Debugging log

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ3OWViMzZiLWZjNTQtNDQwNC04ZDAzLTEwYjM4ZjNlM2E4NiIsImlhdCI6MTczOTA3MTQ2OH0.VCYQN80Gq4sm4LkpfLuxHvIFeFYZRAWQdLReEwaHEWU`, // Make sure token is being set
        },
        body: JSON.stringify({ name: roomId }), // Generate a new unique ID if roomId is not provided
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create team");
      }

      setRoomId(data.team.id); // Set roomId only after successful response
      toast.success("Room ID (Team) successfully created!");
    } catch (error) {
      toast.error(error.message || "An error occurred while creating the team.");
    }
  };

  const joinRoom = async (e) => {

    if (!username) {
      toast.error("Please enter a username");
      return;
    }

    e.preventDefault();

    console.log("Generating Room ID..."); // Debugging log

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ3OWViMzZiLWZjNTQtNDQwNC04ZDAzLTEwYjM4ZjNlM2E4NiIsImlhdCI6MTczOTA3MTQ2OH0.VCYQN80Gq4sm4LkpfLuxHvIFeFYZRAWQdLReEwaHEWU`, // Make sure token is being set
        },
        body: JSON.stringify({ name:roomId }), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create team");
      }

      setRoomId(data.team.id); // Set roomId only after successful response
      toast.success("Room ID (Team) successfully created!");
    } catch (error) {
      toast.error(error.message || "An error occurred while creating the team.");
    }
  

    // If roomId is empty, attempt to create a new room
    if (!roomId) {
      console.log("No roomId found, calling generateRoomId..."); // Debugging log
      await generateRoomId();

      if (!roomId) {
        toast.error("Failed to create room. Please try again.");
        return;
      }
    }

    // Proceed with redirecting only if room creation was successful
    navigate(`/editor/${roomId}`, {
      state: { username },
    });

    toast.success("Room is created");
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <StyledWrapper>
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-md-6">
          <div
            className="card-body text-center"
            style={{
              backgroundColor: "#010101",
              padding: "30px",
              borderRadius: "40px",
              height: "50vh",
            }}
          >
            <h4
              style={{
                fontFamily: "'Montserrat', sans-serif",
                paddingTop: "20px",
                color: "#0ffaf3",
              }}
            >
              Enter the Room ID
            </h4>

            <div className="form-group">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="form-control mb-2 custom-input"
                placeholder="Room Id"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  backgroundColor: "#14151c",
                  borderColor: "#9dfcfa",
                  color: "#fff",
                  borderRadius: "15px",
                  marginTop: "20px",
                }}
                onKeyUp={handleInputEnter}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control mb-2 custom-input"
                placeholder="Username"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  backgroundColor: "#14151c",
                  borderColor: "#9dfcfa",
                  color: "#fff",
                  borderRadius: "15px",
                  marginTop: "15px",
                }}
                onKeyUp={handleInputEnter}
              />
            </div>
            <button
              onClick={joinRoom}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                backgroundColor: "#0ffaf3",
                color: "#010101",
                marginTop: "30px",
                borderRadius: "20px",
                width: "120px",
              }}
              className="btn btn-success btn-lg btn-block"
            >
              JOIN
            </button>
            <p
              className="mt-3 text-light"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Don't have a room ID?
              <span
                onClick={generateRoomId}
                className=" text-success p-2"
                style={{
                  cursor: "pointer",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                <p style={{ color: "#0ffaf3" }}>Create New Room</p>
              </span>
            </p>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div``;

export default Home;
