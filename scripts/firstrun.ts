import yoctoSpinner from "yocto-spinner"
import prompts from "prompts"
import chalk from "chalk"
import axios from "axios"
import "dotenv/config"

(async () => {
    try {
        console.log(chalk.bold(chalk.blueBright("Welcome to Ubillize Set-Up")))
        console.log("\n")
        console.log(chalk.white("Make sure you set up the env, started the production containers and run migrations before running this script."))
        console.log("\n")
        console.log(chalk.white("If you haven't, run these commands: "))
        console.log(chalk.gray("- docker compose up -d"))
        console.log(chalk.gray("- pnpm db:migrate (or npm run db:migrate)"))
        const migrationPrompt = await prompts([
            {
              type: "toggle",
              name: "migrationPrompt",
              message: chalk.gray("> I have production containers running and have run migrations"),
              initial: true,
              active: "yes",
              inactive: "no",
            },
        ])

        console.log("\n")

        if (!migrationPrompt.migrationPrompt) process.exit(0)
        
        const alreadySetUpRes = await axios.get(`${process.env.BASE_URL}/api/setup`)

        if (alreadySetUpRes.data['v']) {
            console.log(chalk.redBright("It seems like you already ran a set up!"))
            process.exit(0)
        }

        console.log(chalk.bold(chalk.underline(chalk.whiteBright("Setting up root admin account."))))
        const credentialPrompts = await prompts([
            {
                type: "text",
                name: "email",
                message: chalk.gray("> Email for root account: ")
            },
            {
                type: "invisible",
                name: "password",
                message: chalk.gray("> Password for root account: ")
            }
        ])

        const postReqSpinner = yoctoSpinner({text: chalk.cyan(`Setting up your account`)}).start()

        const postRes = await axios.post(`${process.env.BASE_URL}/api/setup`, { osvtk: process.env.OSV_TOKEN, em: credentialPrompts.email, pw: credentialPrompts.password })

        if (postRes.status === 201){
            postReqSpinner.success("Your admin account has been set up!")
            console.log(chalk.greenBright(`You can now log in to ${process.env.BASE_URL}/staff with the account you just created!`))
            console.log("\n")
            console.log(`${chalk.whiteBright("Next step - ")}${chalk.bold(chalk.underline(chalk.red("IMPORTANT")))}`)
            console.log(chalk.white(`Go to ${process.env.BASE_URL}/staff/settings and setup your bank account details!`))
            process.exit(0)
        }
        else {
            postReqSpinner.error("Account creation failed! Bro you are so cooked :skull:")
            process.exit(1)
        }
    }
    catch(err) {
        console.log(err)
    }
})()