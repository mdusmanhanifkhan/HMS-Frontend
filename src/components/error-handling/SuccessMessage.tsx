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
      </div>
    </div>
  );
};


export default SuccessMessage
