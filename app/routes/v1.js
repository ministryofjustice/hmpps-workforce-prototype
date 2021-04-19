const express = require('express')
const router = express.Router()

router.post('/allocate-handler', function (req, res) {
  var allocated = req.session.data['selected']
  if (allocated == "yes") {
    res.redirect('/v2/allocation-complete')
  }
  else {
    res.redirect('/allocation-error')
  }

})


module.exports = router