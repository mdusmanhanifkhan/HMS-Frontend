import React from 'react'
import Button from '../button/Button'

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
  errorMessage?: string | null
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  errorMessage,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-[#0000008a] z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4 w-[350px]" onClick={(e) => e.stopPropagation()}>
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10 text-red-100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
          <path d="M12 9v4"></path>
          <path d="M12 17h.01"></path>
        </svg>

        <p className="mb-3 text-center text-sm">
          Are you sure you want to delete{' '}
          <strong className="text-red-100">{itemName}</strong>?
        </p>

        {errorMessage && (
          <p className="text-sm text-red text-center">{errorMessage}</p>
        )}

        <div className="flex justify-center gap-4">
          <Button onClick={onClose} className="px-5" varient="outline">
            No, Keep it
          </Button>
          <Button onClick={onConfirm} className="px-5" varient="dangerBtn">
            Yes, Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
