
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CardContent, CardFooter, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"
import AlertDialogWrapper from "./ui/alertDialogWrapper"
import { useNavigate } from "react-router-dom"

export default function SignInForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    universityID: "",
    password: "",
    isTeacher: false,
  })
  const [dialog, setDialog] = useState({
    title: "",
    description: "",
  })

  const dialogRef = useRef(null)

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type == "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (formData.universityID === "" || formData.password === "") {
      setDialog({
        title: "Empty Fields",
        description: "Please fill in all the fields"
      })
      dialogRef.current.click()
      return
    }



    // we send a post request to the backend server with the form Data.
    const response = await fetch("/api/auth/signinwithuniversityid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })

    const responseJson = await response.json()
    console.log(responseJson)
    if (responseJson.error) {
      setDialog({
        title: "Error",
        description: responseJson.error
      })
    } else {
      // redirect to /home with props 'userData' being the response we just received
      navigate("/home/teacher", { state: { userData: responseJson } })
    }
    dialogRef.current.click()
  }


  return (
    <div className="">
      <div className="mx-auto max-w-lg space-y-6 py-12 px-7 dark:bg-gray-800 dark:text-gray-50 rounded-md">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome to Superlit <img src="rocket.png" width="30" className="inline"></img></h1>
          <p className="text-gray-500 dark:text-gray-400">Enter your credentials to sign in</p>
        </div>
        <Card className="dark:bg-gray-850 dark:text-gray-50 py-2">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="dark:text-gray-400" htmlFor="university-id">
                University ID
              </Label>
              <Input
                className="dark:bg-gray-800 dark:text-gray-50 dark:placeholder:text-gray-400"
                id="university-id"
                placeholder="Enter your university ID"
                name="universityID"
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="dark:text-gray-400" htmlFor="password">
                Password
              </Label>
              <Input
                className="dark:bg-gray-800 dark:text-gray-50 dark:placeholder:text-gray-400"
                id="password"
                placeholder="Enter your password"
                name="password"
                onChange={handleChange}
                required
                type="password"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="dark:bg-gray-50 dark:border-gray-400 dark:checked:bg-gray-50 dark:checked:border-gray-400" id="is-teacher" name="isTeacher" onChange={handleChange} />
              <Label className="dark:text-gray-400" htmlFor="is-teacher">
                I am a teacher
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700" type="submit" onClick={handleSubmit}>
              Sign In
            </Button>
          </CardFooter>
        </Card>



        {/* alert dialog */}
        <AlertDialogWrapper dialog={dialog} dialogRef={dialogRef} />
      </div>
    </div >
  )
}
