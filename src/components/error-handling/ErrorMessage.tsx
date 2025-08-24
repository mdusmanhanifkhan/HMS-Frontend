interface successProps {
  error?: string
}

export default function ErrorMessage({ error }: successProps) {
  return (
    <p className="text-white py-2 px-4 rounded-md mx-auto w-fit font-light text-sm bg-red">
      {error}
    </p>
  )
}
