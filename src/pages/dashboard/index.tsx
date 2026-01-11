import { useNavigate } from 'react-router-dom'
import { routePaths } from '../../constants/routePaths'
import { useEffect, useState, type ReactNode } from 'react'

interface DashboardCard {
  title: string
  icon: ReactNode
  path: string
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState<string | null>(null)

  const cards: DashboardCard[] = [
    {
      title: 'Patients',
      path: routePaths.PATIENTS,
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-red)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />
        </svg>
      ),
    },

    {
      title: 'Departments',
      path: routePaths.DEPARTMENTS,
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-red)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 4h18v4H3z" />
          <path d="M3 8h18v4H3z" />
          <path d="M3 12h18v4H3z" />
        </svg>
      ),
    },

    {
      title: 'Procedures',
      path: routePaths.PROCEDURE,
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-red)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M3 10h18" />
        </svg>
      ),
    },

    {
      title: 'Doctors',
      path: routePaths.DOCTORS,
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-red)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="6" r="4" />
          <path d="M6 22v-2a6 6 0 0 1 12 0v2" />
        </svg>
      ),
    },

    {
      title: 'Doctor Fee',
      path: routePaths.DOCTOR_FEE,
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-red)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 1v22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 1 1 0 7H6" />
        </svg>
      ),
    },

    {
      title: 'Appointments',
      path: routePaths.APPOINTMENTS,
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-red)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <path d="M16 2v4" />
          <path d="M8 2v4" />
          <path d="M3 10h18" />
        </svg>
      ),
    },
  ]

useEffect(() => {
  const storedUser = localStorage.getItem('user')

  const roleName = storedUser
    ? JSON.parse(storedUser)?.role
    : null

  setUserRole(roleName)
}, [])

  const visibleCards =
    userRole === 'superadmin'
      ? cards
      : cards.filter((card) => card.title === 'Patients')

  return (
    <div className="min-h-screen ">
      <h1
        className="text-xl font-semibold mb-8 tracking-wide underline"
        style={{ color: 'var(--color-dark)' }}
      >
        Dashboard
      </h1>

      {/* Small Boxes Grid */}
      <div className="grid grid-cols-4 gap-6">
        {visibleCards.map((card: DashboardCard, index: number) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            className="
              cursor-pointer 
              rounded-xl p-5 
              bg-white 
              shadow-md 
              hover:shadow-lg 
              transition-all 
              flex flex-col items-center 
              hover:-translate-y-1
            "
          >
            <div className="mb-2">{card.icon}</div>

            <h2
              className="text-sm font-semibold text-center"
              style={{ color: 'var(--color-dark)' }}
            >
              {card.title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
