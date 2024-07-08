import ReactDOM from "react-dom/client";
import Root from "./routes/root.tsx";
import Test from "./routes/test/test.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import "./main.css";
import InstantTest from "./routes/instantTest/instantTest.tsx";
import InputPrivateCode from "./routes/instantTest/teacherPanel/inputPrivateCode.tsx";
import TeacherDashboard from "./routes/instantTest/teacherPanel/slug/teacherDashboard.tsx";
import CreateTest from "./routes/instantTest/createTest/createTest.tsx";
import TeacherHomePage from "./routes/homePages/teacher/teacherHomePage.tsx";
import StudentHomePage from "./routes/homePages/student/studentHomePage.tsx";

import { AuthProvider } from "@/lib/authContext"
import ClassRoomManagement from "./routes/homePages/teacher/classRoomManagement/classroomManagement.tsx";
import NewAssignmentPage from "./routes/homePages/teacher/classRoomManagement/newassignment.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/test/:testID",
    element: <Test />,
  },
  {
    path: "/instantTest/:universityID/:publicCode",
    element: <InstantTest />
  },
  {
    path: "/instantTest/teacherDashboard/",
    element: <InputPrivateCode />
  },
  {
    path: "/instantTest/teacherDashboard/:privateCode",
    element: <TeacherDashboard />
  }, {
    path: "/instantTest/create",
    element: <CreateTest />
  },


  // home page
  {
    path: "/home/teacher",
    element: <TeacherHomePage />
  },
  {
    path: "/home/teacher/classroom/assignment/newassignment",
    element: <NewAssignmentPage />
  },

  {
    path: "/home/teacher/classroom/:classRoomCode",
    element: <ClassRoomManagement />
  },

  {
    path: "/home/student",
    element: <StudentHomePage />
  },
  // 404 path
  {
    path: "*",
    element: (
      <div className="bg-black">
        <div className="text-2xl text-center font-mono p-10 text-white">
          404 Not Found
        </div>
      </div>
    ),
  },
]);




ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </AuthProvider>
);
