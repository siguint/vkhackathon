class UnauthorizedError extends Error {
  constructor(error) {
    super(error.message)
    this.statusCode = 401
  }
}

export default UnauthorizedError
