import { createBrowserRouter, createRoutesFromElements, redirect, Route } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Home, SignIn, SignUp } from "./pages";
import RootLayout from "./layouts/root-layout";
import AuthLayout from "./layouts/auth-layout";
import useUserStore from "./store/useUserStore";

function App() {
  const { getUser } = useUserStore();

  const authLoader = async () => {
    const user = await getUser();
    if (!user) {
      throw redirect("/auth/sign-in");
    }
    return user;
  }


  const router = createBrowserRouter(createRoutesFromElements(
    <>
      {/* Public Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="sign-up" element={<SignUp />} />
        <Route path="sign-in" element={<SignIn />} />
      </Route>

      {/* Protected Routes */}
      <Route
        path="/"
        element={<RootLayout />}
        loader={authLoader}
      >
        <Route index element={<Home />} />
      </Route>
    </>
  ));

  return <RouterProvider router={router} />
}

export default App