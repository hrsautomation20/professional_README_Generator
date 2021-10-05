// TODO: Include packages needed for this application
const inquirer = require("inquirer");
const fs = require("fs");
const generateMarkdown = require("./utils/generateMarkdown");
// const questions = require("./utils/questions");

// TODO: Create an array of questions for user input
const questions = {
  description: [
    {
      type: "input",
      name: "title",
      message: "What is the title of your project?",
    },
    {
      type: "input",
      name: "description",
      message: "Please describe your project",
    },
    {
      type: "input",
      name: "developer",
      message: `Please enter developer's name:`,
    },
    {
      type: "input",
      name: "githubuser",
      message: `Please enter developer's GitHub username:`,
    },
    {
      type: "checkbox",
      message:
        "Which sections of contents would you like to add to your README?",
      name: "contents",
      choices: [
        {
          name: "contents",
        },
        {
          name: "screenshot",
        },
        {
          name: "installation",
        },
        {
          name: "usage",
        },
        {
          name: "license",
        },
        {
          name: "contributing",
        },
        {
          name: "testing",
        },
        {
          name: "questions",
        },
      ],
      validate: function (answers) {
        if (answers.length < 1) {
          return "You must choose at least one option.";
        }
        return true;
      },
    },
  ],
  screenshot: [
    {
      type: "input",
      name: "imageSrc",
      message: "Please enter your screenshot image source path or URL",
      default: "demo.jpg",
    },
  ],
  installation: [
    {
      type: "input",
      name: "install",
      message: "Enter installation instructions:",
    },
    {
      type: "input",
      name: "website",
      message: "Please enter URL to access deployed project:",
    },
  ],
  usage: [
    {
      type: "input",
      name: "usage",
      message: "Please enter usage instructions",
    },
    { type: "input", name: "repo", message: "Please enter repository URL:" },
  ],
  license: [
    {
      type: "list",
      message: "Please select type of license",
      name: "license",
      choices: [
        { name: "None", value: 0 },
        { name: "GNU General Public", value: 1 },
        { name: "MIT", value: 2 },
        { name: "BSD 3-Clause License", value: 3 },
        { name: "Boost Software License 1.0", value: 4 },
        { name: "Creative Commons 1.0", value: 5 },
        { name: "The Unlicense", value: 6 },
      ],
    },
  ],
  contributing: [
    {
      type: "input",
      name: "contributing",
      message: "Please enter contribution guidelines:",
    },
  ],
  testing: [
    {
      type: "input",
      name: "testing",
      message: "Please enter Test instructions",
    },
  ],
  questions: [
    {
      type: "input",
      name: "email",
      message: "Please enter email address for contact/questions:",
    },
  ],
};

// TODO: Create a function to write README file
function writeToFile(fileName, data) {
  fs.readFile(fileName, "utf-8", (error, data1) => {
    if (!data1) {
      fs.writeFile(fileName, data, (err) =>
        err ? console.error(err) : console.log("generated-readme.md saved!")
      );
    } else {
      inquirer
        .prompt({
          type: "confirm",
          name: "YesNo",
          message: "Existing README file will be overwritten!",
        })
        .then((isYes) => {
          if (isYes.YesNo) {
            fs.unlinkSync(fileName);
            writeToFile(fileName, data);
          } else return false;
        });
    }
  });
}

// TODO: Create a function to initialize app
function init() {
  askQuestions();
}

//Function to ask questions based on input form user
const askQuestions = () => {
  inquirer
    .prompt(questions.description)
    .then((answers) => askMore(answers))
    .then((data) => {
      const readMe = generateMarkdown(data);
      writeToFile("README.md", readMe);
    })
    .catch((error) => {
      if (error.isTtyError) {
        throw new Error("Unable to create");
      } else {
        console.error("Error", error);
      }
    });
};

const askMore = async (answers) => {
  let ansJoined = {};
  for (let i = 1; i < answers.contents.length; i++) {
    const ans = await inquirer.prompt(questions[answers.contents[i]]);
    ansJoined = { ...ansJoined, ...ans };
  }
  return { ...answers, ...ansJoined };
};
// Function call to initialize app
init();
