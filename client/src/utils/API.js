import axios from "axios";

export default {
  findNames: function(query) {
    console.log(`findNames query: ${query}`);
    return axios.post("/names", query);
  },
  findName: function(query) {
    console.log(`findName query: ${query}`);
    return axios.post("/name", query);
  },
  send: function(query) {
    console.log("send" + query);
    return axios.post("/api/send", query);
  },
  getNames: function() {
    console.log("getNames query");
    return axios.get("/api/names");
  },
};
