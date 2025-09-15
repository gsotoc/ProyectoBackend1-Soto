const path = require('node:path');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 8080;


module.exports = {
  PORT: port,
  getFilePath: (fileName) => path.join(__dirname, `../data/${fileName}`), 
};
  

  
