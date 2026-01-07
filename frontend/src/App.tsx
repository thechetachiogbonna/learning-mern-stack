import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Home, SignUp } from "./pages";
import RootLayout from "./layouts/root-layout";
import AuthLayout from "./layouts/auth-layout";

function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <>
      {/* Public Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="sign-up" element={<SignUp />} />
      </Route>

      {/* Protected Routes */}
      <Route
        path="/"
        element={<RootLayout />}
      // middleware={}
      >
        <Route index element={<Home />} />
      </Route>
    </>
  ));

  return <RouterProvider router={router} />
}

export default App