import Editor, { MonacoDiffEditor, loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import AlertDialogWrapper from "@/components/ui/alertDialogWrapper";
import QuestionsPanel from "./components/questionsPanel";
import TestCasePanel from "./components/testCasePanel";

import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

loader.config({
  monaco,
});
// This enables monaco editor to use node_modules instead of a CDN. This enables our app to be fully offline and hosted on a local network

loader.init()

export default function InstantTest() {
  let { publicCode, universityID } = useParams();
  const [testData, setTestData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [editorData, setEditorData] = useState([])
  const dialogRef = useRef(null)
  const [dialog, setDialog] = useState({
  })

  const navigate = useNavigate()


  async function fetchTestData() {
    const response = await fetch("/api/instanttest/get", {
      method: "POST",
      headers: {
        "content": "application/json"
      },
      body: JSON.stringify({
        publicCode
      }),
    })

    const responseJSON = await response.json()

    if (responseJSON.error) {
      setDialog({
        title: "Wrong Test Code",
        description: "The Test Code Is Incorrect Or The Test Is Over. Please Try Again Or Contact Your Teacher.",
        onOk: () => navigate("/")
      })
      dialogRef.current.click()
      return
    }

    setTestData(responseJSON)

    const tempEditorData = responseJSON.questions.map((question: any) => {
      return question.preWrittenCode
    })

    setEditorData(tempEditorData)
    console.log(responseJSON)
  }



  useEffect(() => {
    fetchTestData()
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      event.preventDefault()
      event.returnValue = ''
      setDialog({
        title: "Are You Sure?",
        description: "You Are About To Leave The Test. Make sure you have hit submit on *every* attempted question. Your answer won't be evaluated if you don't submit. Are you sure you want to leave?",
        cancelText: "Yes, I want to leave",
        okText: "Take me back",
        onCancel: () => navigate("/"),
        onOk: () => event.preventDefault()
        // on ok and on cancel are flipped to make the primary button be cancel and stay
      })

      dialogRef.current.click()
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState == "hidden") {
        setDialog({
          title: "No cheating!",
          description: "You are not allowed to cheat. Please stay on the test page. If you leave, your test will be submitted and you will get 0 points. If you think this is a mistake, please contact your teacher.",
        })
        dialogRef.current.click()
      }
    }


    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);





  return (
    <div>

      <ResizablePanelGroup
        direction="horizontal"
        className="min-w-screen min-h-screen rounded-lg border"
      >
        <ResizablePanel defaultSize={25}>
          <QuestionsPanel testData={testData} currentQuestionIndex={currentQuestionIndex} setCurrentQuestionIndex={setCurrentQuestionIndex} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={75}>
              <div className="flex flex-col items-center justify-center h-full">
                <Editor
                  defaultLanguage="c"
                  value={testData == null ? "Loading..." : editorData[currentQuestionIndex]}
                  theme="vs-dark"
                  className="resize-y overflow-auto"
                  onChange={(value: any) => {
                    const tempEditorData: any = editorData
                    tempEditorData[currentQuestionIndex] = value
                    console.log(editorData)
                    setEditorData([...tempEditorData])
                  }}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25}>
              <TestCasePanel testData={testData} setTestData={setTestData} currentQuestionIndex={currentQuestionIndex} editorData={editorData} publicCode={publicCode} universityID={universityID} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>


      {/* alert dialog */}
      <AlertDialogWrapper dialog={dialog} dialogRef={dialogRef} />


    </div>

  );
}
