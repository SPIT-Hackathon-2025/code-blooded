import React from "react";
import Avatar from "react-avatar";

function Client({ username, socketId, role, updateRole }) {
  return (
    <div className="d-flex align-items-center mb-3 justify-content-between">
      <div className="d-flex align-items-center">
        <div 
          className="avatar-container d-flex align-items-center justify-content-center" 
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #00faf3, #2e6a76)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar 
            name={username.toString()} 
            size={46} 
            round 
            textSizeRatio={1.6} 
            fgColor="#fff"  // White text for better contrast
            color="transparent" // Makes the Avatar background transparent so the gradient is visible
          />
        </div>
        <span className="mx-2">{username.toString()}</span>
      </div>
      <select
        className="form-select form-select-sm"
        value={role}
        onChange={(e) => updateRole(socketId, e.target.value)}
        style={{ width: "100px", fontSize: "14px" }}
      >
        <option value="Viewer">Viewer</option>
        <option value="Editor">Editor</option>
      </select>
    </div>
  );
}

export default Client;
