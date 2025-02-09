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

  const API_URL = "http://localhost:4000/team/create"

  const generateRoomId = async (e) => {
    e.preventDefault();

    try{
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODEzNzkyLTQ2NjAtNDcwOC04NjUxLWY4MDQ1MTEzYjFkZiIsImlhdCI6MTczOTA1NzQxMX0.AfsFCYIwD99FvrUAQXKUfeoukVFemYBrJuhe3Ki_LqI`//${localStorage.getItem("token")}`, // Assuming token-based auth
        },
        body: JSON.stringify({ name: roomId }), // Replace `teamName` with the actual variable containing the team name
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create team");
      }

      setRoomId(data.team.id);
      toast.success("Room ID (Team) successfully created!");
    } catch (error) {
      toast.error(error.message || "An error occurred while creating the team.");
    }
  };
    
  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Both fields are required");
      return;
    }

    // Redirect to editor
    navigate(`/editor/${roomId}`, {
      state: { username },
    });
    toast.success("Room is created");
  };

  // Join room on Enter key
  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <StyledWrapper>
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-md-6">
          <div className="card-body text-center" style={{ backgroundColor: "#010101", padding: "30px", borderRadius: "40px", height: "50vh" }}>
            <h4 style={{ fontFamily: "'Montserrat', sans-serif", paddingTop: "20px", color: "#0ffaf3" }}>Enter the Room ID</h4>

            <div className="form-group">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="form-control mb-2 custom-input"
                placeholder="Room Id"
                style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: "#14151c", borderColor: "#9dfcfa", color: "#fff", borderRadius: "15px", marginTop: "20px" }}
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
                style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: "#14151c", borderColor: "#9dfcfa", color: "#fff", borderRadius: "15px", marginTop: "15px" }}
                onKeyUp={handleInputEnter}
              />
            </div>
            <button
              onClick={joinRoom}
              style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: "#0ffaf3", color: "#010101", marginTop: "30px", borderRadius: "20px", width: "120px" }}
              className="btn btn-success btn-lg btn-block"
            >
              JOIN
            </button>
            <p className="mt-3 text-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Don't have a room ID?
              <span onClick={generateRoomId} className=" text-success p-2" style={{ cursor: "pointer", fontFamily: "'Montserrat', sans-serif" }}>
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
