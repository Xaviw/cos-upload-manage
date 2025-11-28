import { useSessionContext } from "@/contexts/session-provider"
import Header from "@/layouts/header"
import { Navigate, Outlet } from "react-router"

export default function MainLayout() {
  const { session } = useSessionContext()
  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}
