import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./routes/root.tsx";
import Test from "./routes/test/test.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./main.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/test/:testID",
    element: <Test />,
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
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
