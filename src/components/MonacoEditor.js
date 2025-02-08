import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { ACTIONS } from "../Actions";

function MonacoEditor({ socketRef, roomId, onCodeChange }) {
  const editorRef = useRef(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null && code !== value) {
          setValue(code);
        }
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      }
    };
  }, [socketRef, value]);

  const handleEditorChange = (newValue) => {
    setValue(newValue);
    onCodeChange(newValue);
    if (socketRef.current) {
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code: newValue,
      });
    }
  };

  return (
    <div style={{ height: "600px" }}>
      <Editor
        options={{
          minimap: { enabled: false },
          automaticLayout: true,
        }}
        height="100%"
        theme="vs-dark"
        language="javascript"
        value={value}
        onChange={handleEditorChange}
        onMount={(editor) => {
          editorRef.current = editor;
          editor.focus();
        }}
      />
    </div>
  );
}

export default MonacoEditor;