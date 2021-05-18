const { get } = require('browser-sync')
const express = require('express')
const router = express.Router()
const routesAllocations0 = require('./routes/allocationsV0.js')
const v3 = require('./routes/v3.js')
const v6 = require('./routes/v6.js')
const v7 = require('./routes/v7.js')

// Add your routes here - above the module.exports line
router.use('/allocations/0', routesAllocations0)

// Call in routes file from routes folder to keep routes.js cleaner
router.use('/v3', v3)
router.use('/v6', v6)
router.use('/v7', v7)

router.post('/allocate-handler', function (req, res) {
  var allocated = req.session.data['selected']
  if (allocated == "yes") {
    res.redirect('/v7/allocation-complete')
  }
  else {
    res.redirect('/v7/allocation-error')
  }

})


module.exports = router
