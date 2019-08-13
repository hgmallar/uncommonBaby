import axios from "axios";

export default {
  findNames: function(query) {
    console.log(query);
    return axios.post("/names", query);
  },
  findName: function(query) {
    console.log(query);
    return axios.post("/name", query);
  },
  send: function(query) {
    console.log("Sending" + query);
    return axios.post("/api/send", query);
  }
};
