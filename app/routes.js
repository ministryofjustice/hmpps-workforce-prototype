const { get } = require('browser-sync')
const express = require('express')
const router = express.Router()
const routesAllocations0 = require('./routes/allocationsV0.js')
const v1 = require('./routes/v1.js')
const v2 = require('./routes/v2.js')
const v3 = require('./routes/v3.js')

// Add your routes here - above the module.exports line
router.use('/allocations/0', routesAllocations0)

// Call in routes file from routes folder to keep routes.js cleaner
router.use('/v1', v1)
router.use('/v2', v2)
router.use('/v3', v3)

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
