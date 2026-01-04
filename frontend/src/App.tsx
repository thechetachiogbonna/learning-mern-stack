import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Home } from "./pages";

function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
    </>
  ));

  return <RouterProvider router={router} />
}

export default App