import { useState, useRef } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import AlertDialogWrapper from "@/components/ui/alertDialogWrapper"


export default function CreateTest() {
  // dialog stuff
  const dialogRef = useRef(null)
  const formRef = useRef(null)
  const fileUploadRef = useRef(null)
  const [dialog, setDialog] = useState({
    title: "",
    description: "",
  })

  const [formData, setFormData] = useState({
    email: "",
    questions: [
      {
        title: "",
        question: "",
        preWrittenCode: "",
        exampleCases: [
          {
            input: "",
            expectedOutput: "",
            score: 0,
            explanation: "",
          },
        ],
        testCases: [
          {
            input: "",
            expectedOutput: "",
            score: 0,
          },
        ],
      },
    ],
  })

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleQuestionChange = (index: any, field: any, value: any) => {
    setFormData((prevData) => {
      const updatedQuestions = [...prevData.questions]
      updatedQuestions[index][field] = value
      return {
        ...prevData,
        questions: updatedQuestions,
      }
    })
  }
  const handleExampleCaseChange = (questionIndex: any, exampleIndex: any, field: any, value: any) => {
    setFormData((prevData) => {
      const updatedQuestions = [...prevData.questions]
      updatedQuestions[questionIndex].exampleCases[exampleIndex][field] = value
      return {
        ...prevData,
        questions: updatedQuestions,
      }
    })
  }
  const handleTestCaseChange = (questionIndex: any, testIndex: any, field: any, value: any) => {
    setFormData((prevData) => {
      const updatedQuestions = [...prevData.questions]
      updatedQuestions[questionIndex].testCases[testIndex][field] = value
      return {
        ...prevData,
        questions: updatedQuestions,
      }
    })
  }


  const addQuestion = () => {
    setFormData((prevData) => ({
      ...prevData,
      questions: [
        ...prevData.questions,
        {
          title: "",
          question: "",
          preWrittenCode: "",
          exampleCases: [
            {
              input: "",
              output: "",
              score: 0,
              explanation: "",
            },
          ],
          testCases: [
            {
              input: "",
              output: "",
              score: 0,
            },
          ],
        },
      ],
    }))
  }
  const deleteQuestion = (index: number) => {
    setFormData((prevData) => {
      const updatedQuestions = [...prevData.questions]
      updatedQuestions.splice(index, 1)
      return {
        ...prevData,
        questions: updatedQuestions,
      }
    })
  }
  const addExampleCase = (questionIndex: number) => {
    setFormData((prevData) => {
      const updatedQuestions = [...prevData.questions]
      updatedQuestions[questionIndex].exampleCases.push({
        input: "",
        expectedOutput: "",
        score: 0,
        explanation: "",
      })
      return {
        ...prevData,
        questions: updatedQuestions,
      }
    })
  }
  const addTestCase = (questionIndex: number) => {
    setFormData((prevData) => {
      const updatedQuestions = [...prevData.questions]
      updatedQuestions[questionIndex].testCases.push({
        input: "",
        expectedOutput: "",
        score: 0,
      })
      return {
        ...prevData,
        questions: updatedQuestions,
      }
    })
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const response = await fetch("/api/instanttest/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    const responseJSON = await response.json()
    if (responseJSON.error) {
      setDialog({
        title: "Error",
        description: "Failed to create test. Please try again."
      })
      dialogRef.current.click()
    } else {
      setDialog({
        title: "Success",
        description: "Test created successfully! Share the following test code with your students to take the test: " + responseJSON.publicCode + ".The following is the master code for this test. DO NOT share this: " + responseJSON.privateCode + ".The same credentials have been sent to your email and you can safely close this tab or download the test data"
      })
      dialogRef.current.click()
    }

  }

  const downloadTestData = async () => {

    // validate the form:
    if (!formRef.current.reportValidity()) {
      return
    }

    const blob = new Blob([JSON.stringify(formData)], { type: 'application/json' });

    // Create an anchor element and trigger a download
    const a = document.createElement('a');
    a.download = 'test.json'; // Name of the downloaded file
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();

  }

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        console.log(e.target.result)
        const fileData = JSON.parse(e.target.result);
        setFormData(fileData);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6">Create Test</h1>
        <Button variant="outline" onClick={() => fileUploadRef.current.click()}>
          <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" ref={fileUploadRef}>

          </input>
          Upload Test Data
        </Button>
      </div>
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="mb-6">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </div>
        {formData.questions.map((question, index) => (
          <div key={index} className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold mb-4">Question {index + 1}</h2>
              <Button type="button" variant="destructive" onClick={() => deleteQuestion(index)} className="ml-4">
                Delete
              </Button>
            </div>
            <div className="mb-4">
              <Label htmlFor={`question-title-${index}`}>Question Title</Label>
              <Input
                type="text"
                id={`question-title-${index}`}
                value={question.title}
                onChange={(e) => handleQuestionChange(index, "title", e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor={`question-question-${index}`}>Question Description</Label>
              <Textarea
                id={`question-question-${index}`}
                value={question.question}
                onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                rows={4}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor={`question-prewritten-code-${index}`}>Pre-Written Code</Label>
              <Textarea
                id={`question-prewritten-code-${index}`}
                value={question.preWrittenCode}
                onChange={(e) => handleQuestionChange(index, "preWrittenCode", e.target.value)}
                rows={4}
                className="font-mono"
                required
              />
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-4">Example Cases</h3>
              {question.exampleCases.map((example, exampleIndex) => (
                <div key={exampleIndex} className="mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`example-input-${index}-${exampleIndex}`}>Input</Label>
                      <Textarea
                        id={`example-input-${index}-${exampleIndex}`}
                        value={example.input}
                        onChange={(e) => handleExampleCaseChange(index, exampleIndex, "input", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`example-expectedOutput-${index}-${exampleIndex}`}>Expected Output</Label>
                      <Textarea
                        id={`example-expectedOutput-${index}-${exampleIndex}`}
                        value={example.expectedOutput}
                        onChange={(e) => handleExampleCaseChange(index, exampleIndex, "expectedOutput", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor={`example-score-${index}-${exampleIndex}`}>Score</Label>
                      <Input
                        type="number"
                        id={`example-score-${index}-${exampleIndex}`}
                        onChange={(e) => handleExampleCaseChange(index, exampleIndex, "score", Number(e.target.value))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`example-explanation-${index}-${exampleIndex}`}>Explanation</Label>
                      <Textarea
                        id={`example-explanation-${index}-${exampleIndex}`}
                        value={example.explanation}
                        onChange={(e) => handleExampleCaseChange(index, exampleIndex, "explanation", e.target.value)}
                        rows={2}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" onClick={() => addExampleCase(index)} className="mb-4">
                Add Example Case
              </Button>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-4">Test Cases</h3>
              {question.testCases.map((testCase, testIndex) => (
                <div key={testIndex} className="mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`test-input-${index}-${testIndex}`}>Input</Label>
                      <Textarea
                        id={`test-input-${index}-${testIndex}`}
                        value={testCase.input}
                        onChange={(e) => handleTestCaseChange(index, testIndex, "input", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`test-expectedOutput-${index}-${testIndex}`}>Expected Output</Label>
                      <Textarea
                        id={`test-expectedOutput-${index}-${testIndex}`}
                        value={testCase.expectedOutput}
                        onChange={(e) => handleTestCaseChange(index, testIndex, "expectedOutput", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor={`test-score-${index}-${testIndex}`}>Score</Label>
                      <Input
                        type="number"
                        id={`test-score-${index}-${testIndex}`}
                        onChange={(e) => handleTestCaseChange(index, testIndex, "score", Number(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" onClick={() => addTestCase(index)} className="mb-4">
                Add Test Case
              </Button>
            </div>
          </div>
        ))}

        <Button type="button" onClick={addQuestion} className="">
          Add Question
        </Button>
        <div className="mt-8 flex flex-col justify-start items-start space-y-3">
          <Button type="submit">Submit</Button>
          <Button type="button" variant="secondary" onClick={downloadTestData} className="">Download Test Data</Button>
        </div>
      </form>

      <AlertDialogWrapper dialog={dialog} dialogRef={dialogRef} />
    </div>
  )
}
