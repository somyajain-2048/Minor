import "react-toastify/dist/ReactToastify.css"; 
// import "./notification.css";
import { ToastContainer } from "react-toastify";

const Notification = () =>{
  return (
    <div className="cd">
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default Notification;

