const express = require('express')
const router = express.Router()
const moment = require('moment')
const { generateTeam } = require('../data/generateData')
const {
  getTeamTotals,
  getPractitioner,
  getCasesDueToEnd,
  getSentencesDueToEnd,
  getParoleReportsDue
} = require('../data/filterHelpers')

const team = generateTeam(12, 'N57BRP', 'N57A')

router.use('*', (req, { locals }, next) => {
  Object.assign(locals, { team, teamTotals: getTeamTotals(team), url: req.originalUrl, versionUrl: '/_mvp', moment: moment, longDateFormat: 'D MMMM YYYY' })
  next()
})

router.get('/officer-view/:id', ({ params: { id } }, res) => {
  const probationPractitioner = getPractitioner(id, team)
  Object.assign(res.locals, {
    probationPractitioner,
    id: id,
    casesDueToEnd: getCasesDueToEnd(probationPractitioner),
    sentencesDueToEnd: getSentencesDueToEnd(probationPractitioner),
    paroleReportsDue: getParoleReportsDue(probationPractitioner),
  })
  res.render('_mvp/officer-view')
})

router.get('/officer-view/:id/officer-view-cases', ({ params: { id } }, res) => {
  res.locals.probationPractitioner = getPractitioner(id, team)
  res.locals.id = id
  res.render('_mvp/officer-view-cases')
})

router.post('/allocate-handler', function (req, res) {
  var allocated = req.session.data['selected']
  if (allocated === 'yes') {
    res.redirect('/_mvp/allocation-complete')
  } else {
    res.redirect('/_mvp/allocation-error')
  }

})

module.exports = router
