
import Editor, { MonacoDiffEditor, loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import SuperlitLogo from "@/components/superlitLogo";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import AlertDialogWrapper from "@/components/ui/alertDialogWrapper";
import QuestionsPanel from "@/routes/instantTest/components/questionsPanel";
// resuse the questions panel from the instant test page
import AssignmentTestCasePanel from "./components/testCasePanel";

import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/authContext";
import { useTheme } from "@/components/theme-provider";

loader.config({
  monaco,
});
// This enables monaco editor to use node_modules instead of a CDN.
// This enables our app to be fully offline and hosted on a local network

loader.init()

const languageToEditorLanguageMapping = {
  "c": "c",
  "py": "python"
}

export default function AttemptAssignment() {
  let { classroomCode, assignmentID } = useParams();
  const [assignmentData, setAssignmentData] = useState(null);
  const { token } = useAuth()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [editorData, setEditorData] = useState([])
  const dialogRef = useRef(null)
  const [dialog, setDialog] = useState({
  })
  const [currentLanguage, setCurrentLanguage] = useState([])

  const themeInfo = useTheme()
  const navigate = useNavigate()



  async function fetchAssignmentData() {
    const response = await fetch("/api/assignment/get", {
      method: "POST",
      headers: {
        "content": "application/json",
        "Authorization": token.toString()
      },
      body: JSON.stringify({
        classroomCode,
        assignmentID: parseInt(assignmentID)
      }),
    })
    console.log("Fetch over")

    const responseJSON = await response.json()

    if (responseJSON.error) {
      setDialog({
        title: "An error occured",
        description: "Please logout and login again. If this problem persists, please contact your teacher.",
        onOk: () => navigate("/")
      })
      dialogRef.current.click()
      return
    }

    setAssignmentData(responseJSON)
    console.log(responseJSON)

    const tempEditorData = responseJSON.questions.map((question: any) => {
      const storedEditorData = localStorage.getItem(`question${question.ID}-${token.toString()}`)
      if (storedEditorData) return storedEditorData
      return question.preWrittenCode
    })


    setEditorData(tempEditorData)
    setCurrentLanguage(responseJSON.questions.map((question) => {
      return question.languages[0]
    }))
    console.log(responseJSON)
  }



  useEffect(() => {
    if (token == null) {
      navigate("/")
    }
    fetchAssignmentData()
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
        // on ok and on cancel are flipped to make the primary button be cancel and secondary button be stay
      })

      dialogRef.current.click()
    };

    const handleCheater = () => {
      setDialog({
        title: "No cheating!",
        description: "You are not allowed to cheat. Please stay on the test page. If you leave, your test will be submitted and you will get 0 points. If you think this is a mistake, please contact your teacher.",
      })
      dialogRef.current.click()
    }


    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('blur', handleCheater);


    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('blur', handleCheater);
    };
  }, []);



  if (assignmentData == null) return <div>Loading...</div>

  return (
    <div>
      <div className="min-w-screen min-h-[5vh] flex justify-between items-center">
        <SuperlitLogo />
        <Select value={currentLanguage[currentQuestionIndex]} onValueChange={(value: string) => {
          const tempCurrentLanguage = currentLanguage
          tempCurrentLanguage[currentQuestionIndex] = value
          setCurrentLanguage([...tempCurrentLanguage])
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Language</SelectLabel>
              {assignmentData.questions[currentQuestionIndex].languages.map((language: string, index: number) => (
                <SelectItem value={language} key={index}>{language.toUpperCase()}</SelectItem>
              )
              )
              }
            </SelectGroup>
          </SelectContent>
        </Select>



      </div>

      <ResizablePanelGroup
        direction="horizontal"
        className="min-w-screen min-h-[95vh] rounded-lg border"
      >
        <ResizablePanel defaultSize={25}>
          <QuestionsPanel testData={assignmentData} currentQuestionIndex={currentQuestionIndex} setCurrentQuestionIndex={setCurrentQuestionIndex} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={75}>
              <div className="flex flex-col items-center justify-center h-full">
                <Editor
                  language={languageToEditorLanguageMapping[currentLanguage[currentQuestionIndex]]}
                  value={assignmentData == null ? "Loading..." : editorData[currentQuestionIndex]}
                  theme={themeInfo.theme == "dark" ? "vs-dark" : "vs-light"}
                  className="resize-y overflow-auto"
                  onChange={(value: any) => {
                    const tempEditorData: any = editorData
                    tempEditorData[currentQuestionIndex] = value
                    localStorage.setItem(`question${assignmentData.questions[currentQuestionIndex].ID}-${token.toString()}`, value)
                    setEditorData([...tempEditorData])
                  }}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25}>
              <AssignmentTestCasePanel assignmentData={assignmentData} setAssignmentData={setAssignmentData} currentQuestionIndex={currentQuestionIndex} editorData={editorData} languages={currentLanguage} assignmentID={parseInt(assignmentID)} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>


      {/* alert dialog */}
      <AlertDialogWrapper dialog={dialog} dialogRef={dialogRef} />


    </div>

  );
}
