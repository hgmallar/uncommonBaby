import axios from "axios";

export default {
    getCount: function (col) {
        return axios.get("/count/" + col);
    },
    getCountMF: function (col, gender) {
        return axios.get("/count/" + col + "/" + gender);
    },
    findNames: function (query) {
        console.log(query);
        return axios.post("/names", query);
    }
};