const { get } = require('browser-sync')
const express = require('express')
const router = express.Router()
const routesAllocations0 = require('./routesAllocations0')

// Add your routes here - above the module.exports line

router.use('/allocations/0', routesAllocations0)

// Call in routes file from routes folder to keep routes.js cleaner
router.use('/', require('./routes/test.js'))

module.exports = router
