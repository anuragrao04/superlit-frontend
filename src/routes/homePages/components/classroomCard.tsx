import { useRef } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alertDialog"

import { Input } from "@/components/ui/input"

export default function ClassroomCard({ name, code }: { name: string, code: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md p-5 flex flex-col items-center justify-center space-y-5 rounded-lg hover:outline transition-all cursor-pointer select-none">
      <div className="text-3xl font-bold">{name}</div>
      <div className="text-xl font-bold text-gray-700 dark:text-gray-100">Joining Code: <span className="font-mono">{code}</span></div>
    </div>
  )
}

export function CreateClassroomCard({ token, dialogRef, setDialog, fetchUserData }: { token: string, dialogRef: any, setDialog: any, fetchUserData: () => void }) {

  const classroomNameRef = useRef(null)

  const createClassroom = async () => {
    const classroomName = classroomNameRef.current.value
    try {
      const response = await fetch("/api/classroom/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({ name: classroomName }),
      })
      const data = await response.json()
      if (data.error) {
        setDialog({
          title: "Error",
          description: "Something went wrong: " + data.error,
        })
        dialogRef.current.click()
      } else {
        fetchUserData()
        setDialog({
          title: "Success",
          description: "Classroom was created successfully!"
        })
        dialogRef.current.click()
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="bg-white dark:bg-gray-800 shadow-md p-5 flex flex-col items-center justify-center space-y-5 rounded-lg hover:outline transition-all cursor-pointer select-none" onClick={createClassroom}>
          <div className="text-5xl font-bold">+</div>
          <div className="text-xl font-bold text-gray-700 dark:text-gray-100">Create New Classroom</div>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enter the name of your new classroom</AlertDialogTitle>
          <AlertDialogDescription>
            <Input type="text" placeholder="Enter Name Here" ref={classroomNameRef}></Input>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={createClassroom}>Create Classroom</AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>


  )
}
