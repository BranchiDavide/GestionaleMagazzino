/**
 * Middleware per loggare sulla console tutte le richieste
 * che arrivano al server
 */
const morgan = require("morgan");

morgan.token('date', (req, res, tz) => {
    const date = new Date().toLocaleString('it-CH', { timeZone: 'Europe/Zurich' });
    return date.replace(/,/, '');
});

const morganMiddleware = morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]',
    {
      stream: {
        write: (message) => console.log(message.trim()),
      },
    }
);

module.exports = morganMiddleware;