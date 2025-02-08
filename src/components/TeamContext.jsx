import React, { createContext, useState } from "react";

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const [roomId, setRoomId] = useState("");

  return (
    <TeamContext.Provider value={{roomId, setRoomId }}>
      {children}
    </TeamContext.Provider>
  );
};

export default TeamContext;
