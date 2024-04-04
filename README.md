# Obsidian Habits

This is a command-line(*) application designed to help users keep track of their daily activities, including tasks, mood, health metrics, and more, by updating a markdown file with YAML front matter for Obsidian

## Features

- Collects data for various daily activities such as mood, health metrics, exercise, meals, and tasks.
- Updates a markdown file with YAML front matter containing the collected data.
- Supports customization through configuration files for defining data collection functions and task mappings.
- Automates property links and input through folder routing data selection.

## Installation

1. Clone this repository to your local machine.
2. Install Node.js if not already installed.
3. Navigate to the project directory in your terminal.
4. Run `npm install` to install dependencies.

## Usage

1. Configure the application by editing the configuration files in the `config` directory to match your own desired tracking metrics.
2. Update `.env` file with your own API Key, Lattitude/Longitude, and directory paths within Obsidian.
2. Run the application using the command `node index.js <task> <date>`, where:
   - `<task>` is the task you want to perform (e.g., vitamins, food, mood).
   - `<date>` is the date for which the data is being updated (e.g., today, yesterday, or a specific date in the format YYYY-MM-DD). Left empty will return for today.
3. Follow the prompts to provide input for the selected task.
4. The application will update the markdown file with the collected data.

## Configuration

- `config/dataConfig.js`: Contains data collection functions for various tasks.
- `config/functionConfig.js`: Maps task names to corresponding data collection functions.
- Additional configuration files can be added as needed.

## File Structure
```
.
├── src/
│   ├── config/
│   │   ├── dataConfig.js
│   │   └── functionConfig.js
│   ├── helpers/
│   │   ├── dataHandlers.js
│   │   ├── fileUpdater.js
│   │   ├── inputHandler.js
│   │   └── orchestrator.js
│   └── services/
│       ├── bookService.js
│       ├── foodService.js
│       ├── weatherService.js
│       └── workoutService.js
├── .env.template
├── .gitignore
├── index.js
├── package-lock.json
├── package.json
└── README.md
```

## Environment Variables
VISUAL_CROSSING_API_KEY= *(required for Weather and Moon Phase Data)*

LATITUDE= *(required for Weather and Moon Phase Data)*

LONGITUDE= *(required for Weather and Moon Phase Data)*

NOTES_PATH= *(Complete path to the Daily Notes Folder. To Note, nested structure is:*

`${PATH}/YYYY/MM/YYYY-MM-DD.md` )

EXERCISE_PATH=*(path to exercise folder)*

FOOD_PATH=*(path to recipes directory)*

BOOK_PATH=*(path to books directory)*
