import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";

export default function Test() {
  let { testID } = useParams();
  return (
    <div className="bg-black h-screen">
      <div className="text-2xl text-center font-mono p-10 text-white">
        <Editor
          height="90vh"
          defaultLanguage="c"
          defaultValue={"// test: " + testID}
          theme="vs-dark"
        />
      </div>
    </div>
  );
}
