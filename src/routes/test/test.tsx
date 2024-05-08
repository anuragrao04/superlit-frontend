import Editor, { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import { useParams } from "react-router-dom";

loader.config({
  monaco,
});

loader.init().then((editorInstance) => {
  console.log("Editor Loaded!");
  console.log(editorInstance);
});

export default function Test() {
  let { testID } = useParams();

  return (
    <div className="bg-black h-screen">
      <Editor
        height="100vh"
        defaultLanguage="c"
        defaultValue={"// test: " + testID}
        theme="vs-dark"
      />
    </div>
  );
}
