import winston from 'winston'
import 'express-async-errors'

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  defaultMeta: {},
  transports: [
    new winston.transports.File({ filename: 'logfile.log' }),
    new winston.transports.Console(),
  ],

  exitOnError: false,
})

export default logger
