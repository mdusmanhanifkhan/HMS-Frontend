import { useState } from "react"
import Notification from "../notification/Notification"

type StoredUser = {
  name: string
  email: string
  role: string
}

export const Topbar = () => {
  const [user] = useState<StoredUser | null>(() => {
    try {
      const raw =
        localStorage.getItem("user") ||
        localStorage.getItem("authUser") ||
        localStorage.getItem("currentUser")

      if (!raw) return null

      const parsed = JSON.parse(raw)

      // handle possible shapes
      if (parsed?.data?.user) return parsed.data.user
      if (parsed?.user) return parsed.user

      return parsed
    } catch {
      return null
    }
  })

  return (
    <div className="bg-dark h-16 w-full flex items-center justify-between gap-5 pe-5">
      <div className="flex items-center gap-3" />

      <div className="flex items-center gap-5">
        <Notification />

        <div className="flex items-center gap-2">
          <div className="bg-white rounded-full w-9 h-9 flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              className="w-8 h-8 mt-3 text-dark"
            >
              <use href="/assets/svg/profile-icon.svg#profile-icon" />
            </svg>
          </div>

          <div className="text-white leading-5">
            <p className="text-sm">
              {user?.name ?? "Guest"}
            </p>

            <p className="text-xs">
              {user?.email ?? "guest@example.com"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
