import { ModeToggle } from "@/components/mode-toggle"
import { Outlet } from "react-router"

function RootLayout() {
  return (
    <div>
      <ModeToggle />
      <Outlet />
    </div>
  )
}

export default RootLayout