class FourOFourError extends Error {
  constructor(error) {
    super(error.message)
    this.statusCode = 404
  }
}

export default FourOFourError
