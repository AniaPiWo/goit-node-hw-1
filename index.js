import { listContacts, getContactById, removeContact, addContact} from "./contacts.js"
import { Command } from "commander";
import colors from "colors"
import inquirer from "inquirer";


const program = new Command();

program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

const choices = [
    { name: "Contact list", value: "list" },
    { name: "Contact details", value: "get" },
    { name: "New contact", value: "add" },
    { name: "Delete contact", value: "remove" },
];

inquirer
  .prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: choices,
    },
  ])
  .then(async (answers) => {
    program.option("-a, --action <type>", "choose action", answers.action);

    program.parse(process.argv);

    const argv = program.opts();

    if (answers.action === "get") {
      const idAnswer = await inquirer.prompt([
        {
          type: "input",
          name: "id",
          message: "Enter the ID of the contact:",
        },
      ]);

      argv.id = idAnswer.id;
      console.log(argv.id);
    } 

    else if (answers.action === "remove") {
      const idAnswer = await inquirer.prompt([
        {
          type: "input",
          name: "id",
          message: "Enter the ID of the contact you want to delete:",
        },
      ]);

      argv.id = idAnswer.id;
      console.log(argv.id);
    } 

    else if (answers.action === "add") {
      const userAnswer = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message:"Enter the name of the user:"
        },
        {
            type: "input",
            name: "email",
            message: "Enter the email of the user:",
            validate: function(email) {
              var emailRegex = /\S+@\S+\.\S+/;
              if (emailRegex.test(email)) {
                return true;
              } else {
                return colors.red("Please enter a valid email address");
              }
            }
        },
        {
            type: "input",
            name: "phone",
            message: "Enter the phone number of the user:",
            validate: function(phone) {
              var phoneRegex = /^\d+$/;
              if (phoneRegex.test(phone)) {
                return true;
              } else {
                return colors.red("Please enter a valid phone number (only digits are allowed)");
              }
            }
          }
          
      ]);

      argv.name = userAnswer.name;
      argv.email = userAnswer.email;
      argv.phone = userAnswer.phone;
    }

    invokeAction({ action: argv.action, id: argv.id, name: argv.name, email: argv.email, phone: argv.phone });
  });



async function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
        const allContacts = await listContacts()
        console.log(colors.magenta(`Here is your contact list: `), allContacts); 
      break;

    case "get":
        const getContact = await getContactById(id)
        console.log(colors.magenta(`Here are details of contact with id nr ${id}`), getContact); 
      break;

    case "add":
      await addContact(name, email, phone);
      console.log(colors.magenta(`Success! Your new contact was added:\nName: ${name},\nEmail: ${email},\nPhone: ${phone}` )); 
      break;

    case "remove":
      await removeContact(id);
      console.log(`Success! Contact with id nr ${id} was deleted`); 
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}


  

