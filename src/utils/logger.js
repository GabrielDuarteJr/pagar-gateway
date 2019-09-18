const winston = require('winston')

const logFormat = winston.format.printf(({ level, message, label, timestamp }) =>
  `${timestamp} [${label}] ${level}: ${message}`
)

const logger = (label, showInConsole) => {
  const transports = [
    new winston.transports.File({ filename: `logs/${label}.log` })
  ]
  return winston.createLogger({
    transports: showInConsole ? transports.push(new winston.transports.Console()) : transports,
    format: winston.format.combine(
      winston.format.label({ label }),
      winston.format.timestamp(),
      winston.format.prettyPrint(),
      logFormat
    )
  })
}

module.exports = logger
