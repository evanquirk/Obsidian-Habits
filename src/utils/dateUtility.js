const chrono = require('chrono-node');


const parseDate = (dateInput) => {
    const parsedDate = chrono.parseDate(dateInput);
    if (parsedDate) {
        return parsedDate;
    }

    return new Date(dateInput);
};

module.exports = { parseDate };