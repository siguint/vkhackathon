class NotAllowdeError extends Error {
  constructor(error) {
    super(error.message)
    this.statusCode = 405
  }
}

export default NotAllowdeError
