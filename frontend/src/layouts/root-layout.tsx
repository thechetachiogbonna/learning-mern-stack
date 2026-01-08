import { ModeToggle } from "@/components/mode-toggle"
import { NavLink, Outlet } from "react-router"

function RootLayout() {
  return (
    <section>
      <header className="p-4 flex justify-between items-center border-b">
        <h1 className="text-3xl font-bold">Mern Auth</h1>

        <div className="flex items-center gap-4">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/settings">Settings</NavLink>
          <ModeToggle />
        </div>
      </header>
      <Outlet />
    </section>
  )
}

export default RootLayout