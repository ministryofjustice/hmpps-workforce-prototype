const { generateTeam, generateServiceUsers, calculatePointsUsed } = require('./generateData')

describe('calculate Points Used', () => {
  it('should calculate the points used for a given probation practitioner', () => {
    expect(calculatePointsUsed(
      {
        "CommTierC2": 1,
        "CustTierC1": 3,
      }
    )).toEqual(122)
  })
})

describe('generate team', () => {

  let generatedData
  beforeEach(() => {
    generatedData = generateTeam(3, 'Team_Code', 'OM_Key')
  })
  it('should return an array with a length equivalent to the number of practitioners', () => {
    expect(generatedData.length).toBe(3)
  })
  it('should return an array of probation practitioners', () => {
    expect(generatedData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          'OM_Grade_Code': expect.any(String),
        })
      ])
    )
  })
  describe('generate Probation Practitioner', () => {
    let generatedProbationPractitioner
    beforeEach(() => {
      generatedProbationPractitioner = generatedData[0]
    })
    it('should return an probation practitioner object', () => {
      expect(generatedProbationPractitioner).toMatchObject({
        'OM_Surname': expect.any(String),
        'OM_Forename': expect.any(String),
        'Team_Code': 'Team_Code',
        'OM_Key': 'OM_Key00',
      })
    })
    describe('generating service users from probation practitioners', () => {
      it('should generate service users for a probation practitioner', () => {
        expect(generatedProbationPractitioner).toMatchObject({
          'serviceUsers': expect.any(Array),
        })
      })
    })
    describe('generating service users', () => {
      let generatedServiceUsers
      beforeEach(() => {
        generatedServiceUsers = generateServiceUsers("N57A301", { "CustTierC1": 1, "CommTierC2": 2 })
      })
      it('should generate the correct number of service users', () => {
        expect(generatedServiceUsers.length).toEqual(3)
      })
      it('should generate the different users based on tier information', () => {
        expect(generatedServiceUsers).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              'tier': 'C1',
              'receivingFrom': 'Custody',
              'name': expect.any(String),
              'postcode': expect.any(String),
              'crn': expect.any(String),
              'pnc': expect.any(String),
            }),
            expect.objectContaining({
              'tier': 'C2',
              'receivingFrom': 'Community',
            }),
            expect.objectContaining({
              'tier': 'C2',
              'receivingFrom': 'Community',
            }),
          ])
        )
      })
    })
  })
})
