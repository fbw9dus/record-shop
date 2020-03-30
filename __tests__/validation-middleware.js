const { validateInputs } = require("../middleware/validator")
const { body } = require("express-validator")
const userValidationRules = [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Your email looks funky..."),
    body("password")
      .isLength({ min: 10 })
      .withMessage("Minimum password length is 10"),
    body("firstName")
      .exists()
      .trim()
      .escape()
      .withMessage("Please give us your first name.")
  ]

describe('Validation Middleware', () => {
    test('should have correct structure', async done => {
        const valMiddleware = validateInputs(userValidationRules)
        expect(valMiddleware).toEqual(expect.arrayContaining(userValidationRules))
        expect(typeof valMiddleware.slice(-1)[0]).toBe('function')
        done()
    })
})