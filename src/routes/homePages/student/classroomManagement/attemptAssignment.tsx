
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
import AIViva from "./components/AIViva";

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
  let cheatingCount: number
  const dialogRef = useRef(null)
  const AIVivaTriggerRef = useRef(null)
  const editorRef = useRef(null)
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

    let responseJSON
    try {
      responseJSON = await response.json()
    } catch {
      setDialog({
        title: "An error occured",
        description: "Please logout and login again. If this problem persists, please contact your teacher.",
        onOk: () => navigate("/")
      })
      dialogRef.current.click()
      return
    }

    if (responseJSON.error) {
      if (responseJSON.error == "You are blacklisted from this assignment") {
        setDialog({
          title: "You have been disqualified",
          description: "You have been disqualified from the test. Please contact your teacher if you think this is a mistake.",
          onOk: () => navigate("/")
        })
        dialogRef.current.click()
        return
      }
      setDialog({
        title: "An error occured",
        description: "Please logout and login again. If this problem persists, please contact your teacher.",
        onOk: () => navigate("/")
      })
      dialogRef.current.click()
      return
    }

    setAssignmentData(responseJSON)

    const tempEditorData = responseJSON.questions.map((question: any) => {
      const storedEditorData = localStorage.getItem(`question${question.ID}-${token.toString()}`)
      if (storedEditorData) return storedEditorData
      return question.preWrittenCode
    })


    setEditorData(tempEditorData)
    setCurrentLanguage(responseJSON.questions.map((question) => {
      return question.languages[0]
    }))
  }


  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
  };



  useEffect(() => {
    if (token == null) {
      navigate("/")
    }
    cheatingCount = parseInt(localStorage.getItem(`${assignmentID}-cheatingCount`)) || 0
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
      if (cheatingCount >= 1) {
        localStorage.removeItem(`${assignmentID}-cheatingCount`)

        fetch("/api/assignment/addstudenttoblacklist", {
          method: "POST",
          headers: {
            "content": "application/json",
            "Authorization": token.toString()
          },
          body: JSON.stringify({
            assignmentID: parseInt(assignmentID)
          })
        })

        setDialog({
          title: "You have been disqualified",
          description: "You have been disqualified from the test for cheating. Please contact your teacher if you think this is a mistake.",
          onOk: () => navigate("/")
        })
        dialogRef.current.click()
        return
      }

      cheatingCount += 1
      localStorage.setItem(`${assignmentID}-cheatingCount`, cheatingCount)
      setDialog({
        title: "No cheating!",
        description: `You are not allowed to cheat. Please stay on the test page. If you leave, your test will be submitted and you will get 0 points. You have ${1 - cheatingCount} chance(s) left. If you think this is a mistake, please contact your teacher.`,
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



  if (assignmentData == null) return <div className="w-screen h-screen flex justify-center items-center text-center"><AlertDialogWrapper dialog={dialog} dialogRef={dialogRef} />Loading...</div>

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
                    const prevValue: string = editorData[currentQuestionIndex]
                    const delta = value.length - prevValue.length
                    console.log(value.length, prevValue.length, delta)
                    if (delta > 100) {
                      setDialog({
                        title: "Copy Pastes",
                        description: "Large copy pastes are not allowed.",
                      })
                      dialogRef.current.click()
                      editorRef.current.setValue(prevValue)
                      return
                    }
                    const tempEditorData: any = editorData
                    tempEditorData[currentQuestionIndex] = value
                    localStorage.setItem(`question${assignmentData.questions[currentQuestionIndex].ID}-${token.toString()}`, value)
                    setEditorData([...tempEditorData])
                  }}
                  onMount={handleEditorDidMount}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25}>
              <AssignmentTestCasePanel assignmentData={assignmentData} setAssignmentData={setAssignmentData} currentQuestionIndex={currentQuestionIndex} editorData={editorData} languages={currentLanguage} assignmentID={parseInt(assignmentID)} AIVivaTriggerRef={AIVivaTriggerRef} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>


      {/* alert dialog */}
      <AlertDialogWrapper dialog={dialog} dialogRef={dialogRef} />

      {/* AI VIVA */}
      <AIViva triggerRef={AIVivaTriggerRef} code={editorData[currentQuestionIndex]} questionID={parseInt(assignmentData.questions[currentQuestionIndex].ID)} assignmentID={parseInt(assignmentID)} setDialog={setDialog} dialogRef={dialogRef} />

    </div>

  );
}
