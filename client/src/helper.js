import authAPI from "./api/authAPI";
import Swal from "sweetalert2";

export const Send = async (data) => {
    let sendingData = {
        data:data
    }
    let res = await authAPI.predict(sendingData);
    return res;
};


