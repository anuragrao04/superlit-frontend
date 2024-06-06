import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./routes/root.tsx";
import Test from "./routes/test/test.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import "./main.css";
import InstantTest from "./routes/instantTest/instantTest.tsx";
import InputPrivateCode from "./routes/instantTest/teacherPanel/inputPrivateCode.tsx";
import TeacherDashboard from "./routes/instantTest/teacherPanel/slug/teacherDashboard.tsx";


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
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <RouterProvider router={router} />
  </ThemeProvider>
);
