const moment = require("moment")
const { probationPractitionerTemplates } = require('./probation_practitioner_templates.json')
const { referenceDate, serviceUserTemplates, forenames, surnames, postCodes } = require('./service_user_templates.json')
const tierConversion = require('./tier_conversion.json')
const tierPoints = require('./points_constants.json')
const tierKeys = Object.keys(tierConversion)

let uniqueCount = 0
const getUnique = () => uniqueCount++

const updateServiceUserDates = (serviceUser, timeOffsetMilliseconds) => {
  serviceUser.sentenceStart = moment(new Date(serviceUser.sentenceStart)).add(timeOffsetMilliseconds, 'ms')
  serviceUser.sentenceEnd = moment(new Date(serviceUser.sentenceEnd)).add(timeOffsetMilliseconds, 'ms')
  serviceUser.DOB = moment(new Date(serviceUser.DOB)).add(timeOffsetMilliseconds, 'ms')
}

const updateDates = () => {
  const timeOffsetMilliseconds = moment().diff(moment(new Date (referenceDate)))
  for(let serviceUserKey in serviceUserTemplates){
    const serviceUser = serviceUserTemplates[serviceUserKey]
    Array.isArray(serviceUser) ? serviceUser.forEach(su => updateServiceUserDates(su, timeOffsetMilliseconds) ) : updateServiceUserDates(serviceUser, timeOffsetMilliseconds)
  }
  probationPractitionerTemplates.forEach(probationPractitioner => probationPractitioner.lastAllocated = moment(new Date(probationPractitioner.lastAllocated)).add(timeOffsetMilliseconds, 'ms'))
}
updateDates()

const generateServiceUsers = (OM_Key, practitionerTemplate) => {
  const serviceUsers = new Array()
  tierKeys.filter(key => practitionerTemplate[key]).forEach(
    key => {
      for(let index=0; index<practitionerTemplate[key]; index++){
        const unique = getUnique()
        const template = serviceUserTemplates[key]?.length > 0 ? serviceUserTemplates[key][Math.floor(Math.random() * serviceUserTemplates[key].length)] : serviceUserTemplates['blank']
        serviceUsers.push(Object.assign(template, 
          { 
            tier: tierConversion[key].tier,
            receivingFrom: tierConversion[key].receivingFrom,
            name: `${forenames[unique%forenames.length]} ${surnames[unique%surnames.length]}`, 
            postcode: postCodes[unique%postCodes.length], 
            crn: `J${678911 + (unique*3)}`,
            pnc: `2012/${123100000+(unique*131)}F`,
          }))
      }
    }
  )
  return serviceUsers
}

const calculatePointsUsed = probationPractitioner => tierKeys.reduce( (accumulator, key) =>
    (probationPractitioner?.[key] ? tierPoints[key] * probationPractitioner[key] : 0) + accumulator, 0 )

const generateProbationPractitioner = (index, teamCode, OM_KeyPrefix) => {
  const practitionerTemplate = probationPractitionerTemplates[index % probationPractitionerTemplates.length]
  const OM_Key = OM_KeyPrefix+String(index).padStart(2, '0')
  const serviceUsers = generateServiceUsers(OM_Key, practitionerTemplate)
  const pointsUsed = calculatePointsUsed(practitionerTemplate)
  return Object.assign(practitionerTemplate, 
    { 
      Team_Code: teamCode, 
      OM_Key,
      serviceUsers,
      pointsUsed,
      pointsAvailable: 2176,
    }
  )
}

const generateTeam = (noOfProbationPractitioners, teamCode, OM_KeyPrefix) => 
  [ ...new Array(noOfProbationPractitioners)].map( (_currentValue, index) => generateProbationPractitioner(index, teamCode, OM_KeyPrefix) )

module.exports = { generateTeam, generateServiceUsers, calculatePointsUsed }
