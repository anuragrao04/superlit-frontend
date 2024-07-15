import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import AlertDialogWrapper from "@/components/ui/alertDialogWrapper"

import { useRef, useState } from "react"
import { useAuth } from "@/lib/authContext"


export default function AssignmentTestCasePanel({ assignmentData, setAssignmentData, currentQuestionIndex, editorData, assignmentID, languages }: { assignmentData: any, setAssignmentData: any, editorData: any, currentQuestionIndex: any, assignmentID: number, languages: string[] }) {
  const dialogRef = useRef(null)
  const [dialog, setDialog] = useState({})
  const { token } = useAuth()
  const handleRun = async () => {
    let tempOutputs: string[] = []
    await Promise.all(assignmentData.questions[currentQuestionIndex].exampleCases.map(async (testCase: any, index: any) => {
      const payload = {
        "code": editorData[currentQuestionIndex],
        "language": languages[currentQuestionIndex],
        "input": testCase["input"]
      }

      const response = await fetch("/api/run", {
        method: "POST",
        headers: {
          "content": "application/json"
        },
        body: JSON.stringify(payload)
      })

      const responseJSON = await response.json()

      if (responseJSON.error) {
        alert("An error occured")
        return
      }

      tempOutputs[index] = responseJSON.output
      outputRef.current.scrollIntoView({ behavior: "smooth" })
    }))


    // update assignmentData state
    setAssignmentData((oldAssignmentData: any) => {
      const newAssignmentData = { ...oldAssignmentData }
      newAssignmentData.questions[currentQuestionIndex].exampleCases.map((testCase: any, index: any) => {
        testCase.userOutput = tempOutputs[index]
        console.log("assigning", index, tempOutputs[index])
      })
      console.log(newAssignmentData)
      return newAssignmentData
    })
  }

  const handleSubmit = async () => {
    console.log("submitting!")
    const payload = {
      "code": editorData[currentQuestionIndex],
      "language": languages[currentQuestionIndex],
      "assignmentID": assignmentID,
      "questionID": assignmentData.questions[currentQuestionIndex].ID,
    }

    const response = await fetch("/api/assignment/submit", {
      method: "POST",
      headers: {
        "content": "Assignmentication/json",
        "Authorization": token.toString()
      },
      body: JSON.stringify(payload)
    })


    const responseJSON = await response.json()
    if (responseJSON.error || !response.ok) {
      setDialog({
        title: "Error",
        description: "An error occured: " + responseJSON.error,
      })
      dialogRef.current.click()
      return
    }

    setDialog({
      title: "Success",
      description: "Your code has been submitted successfully. You scored " + responseJSON.score + " points on this question. Submit the other questions if you haven't already. When you're done, you can close this tab",
    })
    dialogRef.current.click()
  }

  const outputRef = useRef(null)
  return (
    <ScrollArea className="h-full w-full">
      <Tabs className="h-full" defaultValue="case1">
        <div className="m-1">
          {
            assignmentData == null ? "Loading..." : (
              <div>
                <div className="flex h-full w-full items-start justify-between">
                  <TabsList>
                    {
                      assignmentData["questions"][currentQuestionIndex]["exampleCases"].map((testCase: any, index: any) => (
                        <TabsTrigger key={index} value={`case${index + 1}`} className={testCase.userOutput == null ? "text-black dark:text-white" : testCase.userOutput.trim() == testCase.expectedOutput.trim() ? "text-green-500" : "text-red-800"}>
                          Case {index + 1}
                        </TabsTrigger>
                      ))
                    }
                  </TabsList>

                  <div className="flex justify-end items-end m-1">
                    <Button className="mx-2" variant="secondary" onClick={handleRun}>
                      Run
                    </Button>
                    <Button className="mx-2" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </div>
                </div>
                <div>
                  {
                    assignmentData["questions"][currentQuestionIndex]["exampleCases"].map((testCase: any, index: any) => (
                      <TabsContent key={index} value={`case${index + 1}`} className="flex flex-col items-center justify-left w-full">
                        <div className="w-full">
                          <div>Input</div>
                          <Textarea value={testCase["input"]} readOnly></Textarea>
                        </div>

                        <div className="w-full">
                          <div>Expected Output</div>
                          <Textarea value={testCase["expectedOutput"]} readOnly></Textarea>
                        </div>


                        <div className="w-full">
                          <div>Your Output</div>
                          <Textarea ref={outputRef} value={testCase["userOutput"]} readOnly></Textarea>
                        </div>
                      </TabsContent>
                    ))
                  }
                </div>
              </div>
            )
          }
        </div>
      </Tabs>
      <AlertDialogWrapper dialog={dialog} dialogRef={dialogRef} />
    </ScrollArea>
  )
}