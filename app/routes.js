const { get } = require('browser-sync')
const express = require('express')
const router = express.Router()
const routesAllocations0 = require('./routesAllocations0')
const v2 = require('./routes/v2.js')

// Add your routes here - above the module.exports line

router.use('/allocations/0', routesAllocations0)

// Call in routes file from routes folder to keep routes.js cleaner
router.use('/v2', v2)

router.post('/allocate-handler', function (req, res) {
  var allocated = req.session.data['selected']
  if (allocated == "yes") {
    res.redirect('/v2/allocation-complete')
  }
  else {
    res.redirect('/v2/allocation-error')
  }

})


module.exports = router
