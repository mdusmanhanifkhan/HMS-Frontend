export const Topbar = () => {
  return (
    <div className="bg-dark h-16 w-full flex items-center justify-end gap-5 pe-5">
      <div className="h-full flex justify-end items-center">
        <input
          type="text"
          className="bg-white border-none outline-none rounded-full py-1.5 px-2"
          placeholder="Search here..."
          name=""
          id=""
        />
      </div>
      <div className="relative cursor-pointer">
        <svg
          className="text-white w-8 h-8"
          viewBox="0 0 12 12"
          fill=""
          xmlns="http://www.w3.org/2000/svg"
        >
          <use href="/assets/svg/notification-icon.svg#notification-icon" />
        </svg>
        <p className="absolute top-0 right-[2px] w-[14px] h-[14px] bg-red text-white rounded-full p-[2px] text-[10px] flex justify-center items-center">
          1
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-white rounded-full w-10 h-10"></div>
        <div className="text-white leading-5">
          <p>Usman</p>
          <p>admin@mail.com</p>
        </div>
      </div>
    </div>
  )
}
