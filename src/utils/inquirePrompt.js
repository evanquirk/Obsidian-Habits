// utils/inquirer.js

const inquirer = require('inquirer');

const promptForMissing = async (args) => {
    const questions = [];
    if (!args.task) {
        questions.push({
            type: 'input',
            name: 'task',
            message: 'What task would you like to perform?'
        });
    }
    if (!args.date) {
        questions.push({
            type: 'input',
            name: 'date',
            message: 'Enter the date for the task (today, yesterday, or any ISO date):',
            default: 'today'
        });
    }

    const answers = await inquirer.prompt(questions);
    return {
        ...args,
        task: args.task || answers.task,
        date: args.date || answers.date
    };
}

module.exports = { promptForMissing };