import React, { createContext, useState } from "react";

const FileContext = createContext(); // ✅ Create the context

export const FileProvider = ({ children }) => {
  const [fileName, setFileName] = useState(""); // ✅ State to store file name

  return (
    <FileContext.Provider value={{ fileName, setFileName }}>
      {children}
    </FileContext.Provider>
  );
};

export default FileContext; // ✅ Default export
