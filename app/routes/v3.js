const express = require('express')
const router = express.Router()

router.post('/form-handler', function (req, res) {

  // Make a variable and give it the value from 'how-many-balls'
  var willWork = req.session.data['will-this-work']

  // Check whether the variable matches a condition
  if (willWork == "yes") {
    // Send user to next page
    res.redirect('/v1/team-view')
  }
  else {
    // Send user to ineligible page
    res.redirect('/index')
  }

})


module.exports = router