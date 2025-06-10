import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Styles/ToastrNotify.css"; // Import your custom CSS for the toast

const ToastrNotify = (message, notifyType) => {
    toast[notifyType](message,
        {
            position: "top-right",
            autoClose: 7500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        }
    );
};

export default ToastrNotify;
