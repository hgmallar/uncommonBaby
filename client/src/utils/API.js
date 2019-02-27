import axios from "axios";

export default {
    getCount: function (col) {
        return axios.get("/count/" + col);
    },
    findNames: function (query) {
        console.log(query);
        return axios.post("/names", query);
    }
};