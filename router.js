const express = require('express');
const router = express.Router();
const { displayuser, loginauth, insertData } = require('./dbController');

router.get('/displayUsers', displayuser);
router.post('/login', loginauth);
router.post('/insertData', insertData); // Route for inserting data
console.log('Router initialized.'); 

module.exports = router;
