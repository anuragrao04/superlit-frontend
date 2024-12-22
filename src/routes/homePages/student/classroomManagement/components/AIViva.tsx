import { Ref, RefObject, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alertDialog"
import { useAuth } from "@/lib/authContext"
import { useNavigate } from "react-router-dom"
import { ScrollArea } from "@/components/ui/scroll-area"


interface question {
  question: string,
  options: string[],
  correctOption: number
}

export default function AIViva({ triggerRef, code, questionID, assignmentID, setDialog, dialogRef }: { triggerRef: RefObject<HTMLElement>, code: string, questionID: number, assignmentID: number, setDialog: any, dialogRef: RefObject<HTMLElement> }) {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([])
  const { token } = useAuth()
  const [questions, setQuestions] = useState<question[] | null>(null)
  const navigate = useNavigate()
  const closeVivaRef = useRef(null)

  const fetchData = async () => {
    const response = await fetch("/api/aiviva", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token.toString()
      },
      body: JSON.stringify({
        code,
        questionID
      })
    })

    let responseJSON

    try {
      responseJSON = await response.json()
    } catch {
      setDialog({
        "title": "Error",
        "description": "An error occured during AI Viva. Please submit again or contact your teacher."
      })
      dialogRef.current.click()
      return
    }

    if (responseJSON.error) {
      setDialog({
        "title": "Error",
        "description": responseJSON.error
      })
      dialogRef.current.click()
      return
    }

    setQuestions(responseJSON.questions)


    // setQuestions([
    //   {
    //     question: "in non consequat esse aliquip incididunt voluptate mollit et in duis mollit magna eu dolor esse duis consequat deserunt mollit do irure adipisicing labore amet incididunt ad et elit eiusmod exercitation ut adipisicing enim veniam incididunt deserunt ad consequat commodo labore duis fugiat occaecat eiusmod ut culpa consequat ad culpa",
    //     options: ["1", "2", "3", "4"],
    //     correctOption: 0
    //   },
    //   {
    //     question: "in non consequat esse aliquip incididunt voluptate mollit et in duis mollit magna eu dolor esse duis consequat deserunt mollit do irure adipisicing labore amet incididunt ad et elit eiusmod exercitation ut adipisicing enim veniam incididunt deserunt ad consequat commodo labore duis fugiat occaecat eiusmod ut culpa consequat ad culpa",
    //     options: ["1", "2", "3", "4"],
    //     correctOption: 0
    //   },
    //   {
    //     question: "in non consequat esse aliquip incididunt voluptate mollit et in duis mollit magna eu dolor esse duis consequat deserunt mollit do irure adipisicing labore amet incididunt ad et elit eiusmod exercitation ut adipisicing enim veniam incididunt deserunt ad consequat commodo labore duis fugiat occaecat eiusmod ut culpa consequat ad culpa",
    //     options: ["1", "2", "3", "4"],
    //     correctOption: 0
    //   },
    //   {
    //     question: "in non consequat esse aliquip incididunt voluptate mollit et in duis mollit magna eu dolor esse duis consequat deserunt mollit do irure adipisicing labore amet incididunt ad et elit eiusmod exercitation ut adipisicing enim veniam incididunt deserunt ad consequat commodo labore duis fugiat occaecat eiusmod ut culpa consequat ad culpa",
    //     options: ["1", "2", "3", "4"],
    //     correctOption: 0
    //   },
    // ])
  }

  useEffect(() => {
    if (token == null) {
      navigate(-1) // how did this guy get here? go back
    }
  }, [])


  const handleOptionSelect = (index: number, optionIndex: number) => {
    setSelectedOptions((prevSelectedOptions) => {
      let updatedOptions = [...prevSelectedOptions]
      updatedOptions[index] = optionIndex
      return updatedOptions
    })
  }

  const handleSubmit = async (event: any) => {
    let score = 0
    for (let i = 0; i < questions.length; i++) { // 4 questions in total
      if (selectedOptions[i] == undefined) {
        setDialog({
          "title": "Error",
          "description": "Please answer all questions"
        })
        dialogRef.current.click()
        // stop propagation
        event.stopPropagation()
        return
      }

      if (selectedOptions[i] == questions[i].correctOption) {
        score += 1
      }
    }

    const response = await fetch("/api/aiviva/setvivascore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token.toString()
      },
      body: JSON.stringify({
        questionID,
        assignmentID,
        score
      })
    })

    let responseJSON

    try {
      responseJSON = await response.json()
    } catch {
      setDialog({
        "title": "Error",
        "description": "An error occured during AI Viva. Please submit again or contact your teacher."
      })

      // reset variables
      setSelectedOptions([])
      setQuestions(null)
      dialogRef.current.click()
      closeVivaRef.current.click()
      return
    }

    if (responseJSON.error) {
      setDialog({
        "title": "Error",
        "description": "An error occured in AI Viva: " + responseJSON.error
      })

      // reset variables
      setSelectedOptions([])
      setQuestions(null)
      dialogRef.current.click()
      closeVivaRef.current.click()
      return
    }

    // everything went well
    // reset variables
    setSelectedOptions([])
    setQuestions(null)
    closeVivaRef.current.click()
  }


  return (
    <AlertDialog>

      {/* <AlertDialogTrigger asChild hidden className="h-0 w-0 p-0 absolute -left-10 -top-10"> */}
      {/*   <Button variant="outline" id="alertDialogTrigger" ref={triggerRef} className="h-0 w-0 p-0"></Button> */}
      {/* </AlertDialogTrigger> */}

      <AlertDialogTrigger asChild className="h-0 w-0 p-0 absolute -left-10 -top-10">
        <Button variant="outline" id="alertDialogTrigger" ref={triggerRef} className="h-0 w-0 p-0" onClick={() => fetchData()}>trigger</Button>
      </AlertDialogTrigger>


      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>AI Viva</AlertDialogTitle>
          <AlertDialogDescription>
            Answer the following questions to test your knowledge
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Put everything into a single scrollable area */}
        <div className="overflow-auto max-h-[70vh]">
          {questions == null ? (
            <p>Loading...</p>
          ) : (
            questions.map((question, index) => (
              <div key={index} className="space-y-2 mb-4">
                <p className="text-card-foreground">{question.question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {question.options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      className={`bg-muted px-4 py-2 rounded-md transition-colors ${selectedOptions[index] === optionIndex
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted/80"
                        }`}
                      onClick={() => handleOptionSelect(index, optionIndex)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
          <Button className="w-full" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
