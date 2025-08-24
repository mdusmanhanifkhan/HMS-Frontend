interface successProps {
  success?: string
}

export default function SuccessMessage({ success }: successProps) {
  return (
    <p className="text-white py-2 px-4 rounded-md mx-auto w-fit font-light text-sm bg-green">
      {success}
    </p>
  )
}
