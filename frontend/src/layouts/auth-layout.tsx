import { Outlet } from "react-router"

function AuthLayout() {
  return (
    <section className="h-dvh flex justify-center items-center">
      <Outlet />
    </section>
  )
}

export default AuthLayout