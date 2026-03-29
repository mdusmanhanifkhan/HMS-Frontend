import { useState, useEffect, useRef } from 'react'

const Notification = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [notifications, setNotifications] = useState<string[]>([]) 
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpenModal(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  console.log(setNotifications)

  return (
    <div className="relative">
      {/* Notification Bell */}
      <div
        className="relative cursor-pointer"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpenModal(!isOpenModal)
        }}
      >
        <svg
          className="text-white w-8 h-8"
          viewBox="0 0 12 12"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <use href="/assets/svg/notification-icon.svg#notification-icon" />
        </svg>
        {notifications.length > 0 && (
          <p className="absolute top-[1px] right-[1px] w-[16px] h-[16px] bg-red text-white rounded-full p-[2px] text-[10px] flex justify-center items-center">
            {notifications.length}
          </p>
        )}
      </div>

      {/* Dropdown */}
      {isOpenModal && (
        <div
          ref={dropdownRef}
          className="absolute top-10 -left-60 bg-white rounded-xl min-w-76 max-w-76 w-full min-h-32 z-50 shadow-2xl p-4"
          onClick={(e) => e.stopPropagation()} 
        >
          {/* Header with Title and Close Button */}
          <div className="flex justify-between items-center border-b border-gray pb-2 mb-3">
            <p className="text-lg font-medium text-dark">Notifications</p>
            <button
              onClick={() => setIsOpenModal(false)}
              className="text-gray hover:text-dark transition cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-100">
              <svg
                className="w-12 h-12 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <p className="text-center text-sm font-medium text-dark">
                You have no new notifications at this time.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {notifications.map((note, index) => (
                <li
                  key={index}
                  className="p-2 border rounded-lg border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                >
                  {note}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default Notification
