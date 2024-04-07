const { parseISO } = require('date-fns');

const parseDate = (dateInput) => {
    if (dateInput === 'today') {
        return new Date();
    } else if (dateInput === 'yesterday') {
        return new Date(new Date().setDate(new Date().getDate() - 1));
    } else {
        return parseISO(dateInput);
    }
};

module.exports = { parseDate };