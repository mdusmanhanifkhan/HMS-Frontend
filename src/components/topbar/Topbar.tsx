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
      <p className="text-white ">Noti</p>
      <div className="flex items-center gap-2">
        <div className="bg-white rounded-full w-10 h-10"></div>
        <div className="text-white leading-5">
          <p>Usman</p>
          <p>admin@mail.com</p>
        </div>
      </div>
    </div>
  );
};
