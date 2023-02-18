class BadRequestError extends Error {
  constructor(error) {
    super(error.message)
    this.statusCode = 400
  }
}

export default BadRequestError
