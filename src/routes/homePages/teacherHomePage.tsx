import { Boxes } from "@/components/ui/background-boxes"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export default function TeacherHomePage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)


  useEffect(() => {
    if (!state) {
      navigate('/')
    } else {
      const { userData } = state
      // this userData is different than the userData on the outside
      // scope bullshit
      setUserData(userData)
    }
  }, []);

  return (
    <div>
      <Boxes className="-z-50" />
      <h1>Home Page</h1>
      <div>{userData == null ? 'loading' : JSON.stringify(userData)}</div>
    </div>
  )
}
