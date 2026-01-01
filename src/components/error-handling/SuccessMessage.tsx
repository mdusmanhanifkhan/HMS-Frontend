import "../../assets/css/error-handling.css"

type SuccessNotificationProps = {
  msg: string
}

const SuccessMessage = ({ msg }: SuccessNotificationProps) => {
  return (
    <div className="toast-wrapper">
      <div className="toast toast--success">
        <div className="toast__icon">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11
              11-4.9 11-11S18.1 1 12 1zm-2 15-4-4
              1.4-1.4L10 13.2l6.6-6.6L18 8l-8 8z" />
          </svg>
        </div>

        <div className="toast__title">{msg}</div>

        {/* <div className="toast__close" >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M5.3 5.3 10 10l4.7-4.7L16.4 6
              11.7 10.7l4.7 4.7-1.7 1.6L10 12.3
              5.3 16.9 3.6 15.3l4.7-4.6L3.6 6z" />
          </svg>
        </div> */}
      </div>
    </div>
  );
};


export default SuccessMessage
