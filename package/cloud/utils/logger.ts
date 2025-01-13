import winston from "winston";

// Create a logger instance using winston
const logger = winston.createLogger({
  level: "info", // Set the default log level
  format: winston.format.combine(
    winston.format.colorize(), // Color the log level
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Add a timestamp to the logs
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
    )
  ),
  transports: [
    // Console output
    new winston.transports.Console({ level: "info" }),
    // Optionally, log to a file
    new winston.transports.File({ filename: "logs/app.log", level: "info" }),
  ],
});

// Example of how to use the logger
logger.info("Logger initialized successfully");
logger.error("This is an error message");
logger.warn("This is a warning message");

// You can also create custom logging levels if needed
// logger.debug('This is a debug message');

// Export the logger instance for use in other files
export { logger };
