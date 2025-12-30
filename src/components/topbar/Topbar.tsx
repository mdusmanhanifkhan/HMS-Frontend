import { useEffect, useState } from 'react'
import Notification from '../notification/Notification'

export const Topbar = () => {
  const [user, setUser] = useState<{
    name: string
    email: string
    role: string
  } | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return (
    <div className="bg-dark h-16 w-full flex items-center justify-between gap-5 pe-5">
      <div className="flex items-center gap-3">
        {/* <div className="h-full flex justify-end items-center">
        <input
          type="text"
          className="bg-white border-none outline-none rounded-full py-1.5 px-2 text-sm w-full placeholder:text-gray-100 min-w-[300px]"
          placeholder="Search here..."
        />
      </div> */}
      </div>

      <div className="flex items-center gap-5">
       <Notification/>

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
            <p className="text-sm">{user?.name || 'Guest'}</p>
            <p className="text-xs">{user?.email || 'guest@example.com'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
