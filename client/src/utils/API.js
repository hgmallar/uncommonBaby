import axios from "axios";

export default {
  findNames: function(query) {
    console.log(query);
    return axios.post("/names", query);
  },
  findName: function(query) {
    console.log(query);
    return axios.post("/name", query);
  }
};
