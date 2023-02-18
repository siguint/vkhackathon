import winston from 'winston'
import logger from './logging'

export default () => {
  process.on('uncaughtException', (ex) => {
    winston.info('......GOT AN UNCAUGHT EXCEPTION.......')
    logger.log({
      level: 'error',
      message: ex.message,
      stack: ex.stack,
    })
  })
  process.on('unhandledRejection', (ex) => {
    winston.info('......GOT AN UNHANDLED REJECTION.......')
    logger.log({
      level: 'error',
      message: ex.message,
      stack: ex.stack,
    })
    process.exit(1)
  })
}
