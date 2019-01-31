import servic from "react-services/defineService"
import fetch from 'node-fetch';
Service = service("NameService", function() {
  return {
    name: function() {
      return "React + Services"
    }      
  };
})
