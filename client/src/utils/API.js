import axios from "axios";

export default {
    getCount: function (col) {
        return axios.get("/count/" + col);
    }
};