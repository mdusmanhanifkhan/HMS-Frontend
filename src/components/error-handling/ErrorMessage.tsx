import "../../assets/css/error-handling.css"
interface successProps {
  msg?: string
}


const ErrorMessage = ({ msg }: successProps) => {
  return (
    <div className="toast-wrapper">
      <div className="toast toast--error">
        <div className="toast__icon">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 1 0 0 20
              10 10 0 0 0 0-20zm1 5v6h-2V7h2zm0 8v2h-2v-2h2z" />
          </svg>
        </div>

        <div className="toast__title">{msg}</div>

        {/* <div className="toast__close" onClick={onClose}>
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


export default ErrorMessage
