import { useRef, useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { useNavigate, useParams } from "react-router-dom"
import AlertDialogWrapper from "@/components/ui/alertDialogWrapper"

export default function TeacherDashboard() {
  const { privateCode } = useParams()
  const [viewToggle, setViewToggle] = useState(true)
  const [dialog, setDialog] = useState({})
  const dialogRef = useRef(null)
  const [studentScores, setStudentScores] = useState(null)
  const navigate = useNavigate()


  async function fetchStudentScores() {
    try {
      const response = await fetch("/api/instanttest/getsubmissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ privateCode: privateCode }),
      })
      const data = await response.json()

      // some sorting logic
      // sort data.submissions by universityID
      data.submissions.sort((a: string, b: string) => a.UniversityID - b.UniversityID)

      // pad the answer array where values are not available for that question
      const minQuestionIndex = Math.min(...(data.questionIDs))
      data.submissions.forEach((submission: any) => {
        const answerArray = new Array(data.questionIDs.length).fill(null)
        submission.Answers.forEach((answer: any) => {
          answerArray[answer.QuestionID - minQuestionIndex] = answer.Score
        })
        submission.AnswersPadded = answerArray
      })



      setStudentScores(data)
      setViewToggle(data.isActive)
    } catch (error) {
      console.log(error)
      setDialog({
        title: "Error",
        description: "Failed to fetch student scores or wrong test code. Please try again."
      })
      dialogRef.current.click()
      setTimeout(() => {
        navigate("/instantTest/teacherDashboard")
      }, 5000)
    }
  }
  useEffect(() => {
    fetchStudentScores()
  }, [])


  async function handleViewToggleChange(newViewToggle: boolean) {
    const response = await fetch("/api/instanttest/changeactive", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ privateCode: privateCode, active: newViewToggle }),
    })

    const data = await response.json()

    if (data.error) {
      setDialog({
        title: "Error",
        description: "Failed to change test status. Please try again."
      })
      setViewToggle(!newViewToggle)
    }
    else {
      setViewToggle(newViewToggle)
    }
  }


  function downloadCSV() {
    const tableId = "scores-table"
    const separator = ","; // Column separator
    const rows = document.querySelectorAll(`#${tableId} tr`);

    // Construct CSV
    let csv = [];
    rows.forEach((row) => {
      let cols = row.querySelectorAll("td, th");
      let rowArray = Array.from(cols).map(col => col.innerText.replace(/(\r\n|\n|\r)/gm, "").replace(/(\s\s)/gm, " "));
      csv.push(rowArray.join(separator));
    });

    // Create CSV string
    let csvString = csv.join("\n");

    // Trigger download
    let filename = "export_" + tableId + "_" + new Date().toLocaleDateString() + ".csv";
    let link = document.createElement("a");
    link.style.display = "none";
    link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvString));
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (!studentScores) return (<div className="bg-gray-100 flex justify-center items-center min-h-screen w-screen">Loading...</div>)

  return (
    <div className="w-screen min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-10 px-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Student Scores</h1>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 dark:text-gray-400">Test status:</span>
            <Switch
              id="view-toggle"
              aria-label="Toggle view"
              checked={viewToggle}
              onCheckedChange={handleViewToggleChange}
              className={`${viewToggle ? "dark:bg-green-500" : "dark:bg-red-500"} focus:ring-green-500 dark:focus:ring-red-500`}
            />
            <Label
              htmlFor="view-toggle"
              className={`font-medium ${viewToggle ? "dark:text-green-500" : "text-gray-500 dark:text-gray-400"
                }`}
            >
              {viewToggle ? "Active" : "Closed"}
            </Label>
          </div>
        </div>
        <div className="relative w-full overflow-auto">
          <Table id="scores-table">
            <TableHeader>
              <TableRow>
                <TableHead className="font-mono">University ID</TableHead>
                {
                  studentScores?.questionIDs.map((questionID: number, index: number) => (
                    <TableHead className="font-mono" key={index}>Question {index + 1}</TableHead>
                  )
                  )
                }
                <TableHead className="font-mono">Total Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                studentScores?.submissions.map((submission: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">{submission.UniversityID}</TableCell>
                    {
                      submission.AnswersPadded.map((answer: any, answerIndex: number) => (
                        <TableCell className="font-mono" key={answerIndex}>{answer != null ? answer : "Didn't Submit"}</TableCell>
                      ))
                    }
                    <TableCell className="font-mono">{submission.TotalScore}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>

          <Button onClick={downloadCSV}>Download as CSV</Button>
        </div>
      </div>

      <AlertDialogWrapper dialog={dialog} dialogRef={dialogRef} />
    </div>
  )
}
