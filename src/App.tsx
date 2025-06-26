// src/App.jsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import Scheduler from "./Scheduler";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     children: [
//       {
//         path: "/",
//         element: <h2>Welcome to the App!</h2>,
//       },
//       {
//         path: "scheduler",
//         element: <Scheduler />,
//       },
//       {
//         path: "scheduler-editor",
//         element: <Scheduler />,
//       },
//     ],
//   },
// ]);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<h2>Welcome to the App!</h2>} />
      <Route path="/scheduler" element={<Scheduler />} />
      <Route path="/scheduler-editor" element={<Scheduler />} />
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
