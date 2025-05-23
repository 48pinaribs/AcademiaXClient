import { toast } from "react-toastify"

const ToastrNotify = (message, notifyType) => {
    toast.error(message, {
        type: notifyType,
        position: "top-right",
        autoClose: 7500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
    })
}

export default ToastrNotify