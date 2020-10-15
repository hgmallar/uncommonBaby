import axios from "axios";

export default {
  findNames: function(query) {
    console.log(`query1: ${query}`);
    return axios.post("/names", query);
  },
  findName: function(query) {
    console.log(`query: ${query}`);
    return axios.post("/name", query);
  },
  send: function(query) {
    console.log("Sending" + query);
    return axios.post("/api/send", query);
  },
  getNames: function() {
    console.log("HERE");
    return axios.get("/api/names");
  },
};
