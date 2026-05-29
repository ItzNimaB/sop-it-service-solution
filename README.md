# sop-database-design
### Welcome to the sop it service solution repo.
🙌 Let's make the Helpdesk System great again!

## Status
📆 This project is in early development - Expect constant changes.

## Dokumentation
📝 The [wiki](https://github.com/kenn7575/sop-it-service-solution/wiki) page on this repo holds the dokumentation for this project.

## Discussions
🤙 The [discussions](https://github.com/kenn7575/sop-it-service-solution/discussions) page is the perfect place to chat with others about the project and propose new ideas or features.

📣 Here you can also find [announcements](https://github.com/kenn7575/sop-it-service-solution/discussions/categories/announcements) about the projects progress.

## Issues
The [issues](https://github.com/kenn7575/sop-it-service-solution/issues) page is for anyone to report
- 👾 Bugs (obvious errors that compromises the systems functionality).
- 😲 Concerns (other types of errors that compromises the systems efficiency or usability).

# For Developers 
👨‍💻 This project is developed using [Node js](https://nodejs.org/en) ([Express js](https://expressjs.com/)), [MariaDB](https://mariadb.org/) and [React](https://react.dev/)

For specific information about the technologies version, see the [package.json](https://github.com/kenn7575/sop-it-service-solution/blob/main/frontend/udl%C3%A5nssystem/package.json) for the frontend and the [package.json](https://github.com/kenn7575/sop-it-service-solution/blob/main/backend/package.json) for the backend.

### Structure
The project is divided into 2 main folders:
- [frontend](https://github.com/kenn7575/sop-it-service-solution/tree/main/frontend) - The frontend of the project.
- [backend](https://github.com/kenn7575/sop-it-service-solution/tree/main/backend) - The backend of the project.

## Installation
### Prerequisites
- [Node js](https://nodejs.org/en) - The backend is written in Node js, so you need to have Node js, installed on your machine.
- [NPM](https://www.npmjs.com/) - The frontend and backend both use npm to manage dependencies, which is installed with Node js by default.
- [MariaDB](https://mariadb.org/) - The database is written in MariaDB, so you need to have MariaDB installed on your machine.
- [Git](https://git-scm.com/) - The project uses Git for version control, so you need to have Git installed on your machine.

### Environment variables
The project uses environment variables to store sensitive information. You need to create a .env file in the root folder of the project. In the root folder we've included a .env.example file that you can use as a template.

The .env file for the backend should look something like this:

```
NODE_ENV="development" #Nodejs environment. Format: "development" or "production".

DATABASE_URL="database_url" #URL to the database. Format: "mysql://user:password@host:port/database".

FRONTEND_URL="http://localhost:5173" #URL to the frontend. Format: "http://localhost:port,http://localhost:port2".
SIGNUP_FRONTEND_URL="http://signup.localhost" #Public URL to the signup pages used in signup confirmation emails.

BACKEND_PORT=3000 #Port the backend should run on. Default: 3000

JWT_SECRET="secret" #Secret used to sign the JWT tokens.

LDAP_HOST="xxx.xxx.xxx.xxx" #IP address of the LDAP server. Format: "xxx.xxx.xxx.xxx".
LDAP_PORT="389" #Port of the LDAP server.
LDAP_USERNAME="username" #Username used to connect to the LDAP server.
LDAP_PASSWORD="password" #Password used to connect to the LDAP server.
LDAP_BASE_DN="base_dn" #Base DN of the LDAP server.
LDAP_USERS="users" #DN of the "regular" users (non-admin) in the LDAP server.
LDAP_ADMINS="admins" #DN of the admins in the LDAP server.

MAIL_MAILER="mailer" #Mailer used to send emails.
MAIL_HOST="host" #Host of the mail server.
MAIL_PORT=587 #Port of the mail server.
MAIL_USERNAME="username" #Username used to connect to the mail server.
MAIL_PASSWORD="password" #Password used to connect to the mail server.
MAIL_ENCRYPTION="tls" #Encryption used to connect to the mail server.
MAIL_FROM_ADDRESS="from_address" #Email address used as the sender of the emails.
MAIL_FROM_NAME="from_name" #Name used as the sender of the emails.
```

The .env file for the frontend should look something like this:

```
VITE_APP_BACKEND_URL="http://localhost:3000/api"
```

### Setup
#### Clone the repository
1. Inside VS code, press "Clone git repository..." and paste the link to this repository. [repo link](https://github.com/kenn7575/sop-it-service-solution).
> You need to have Git installed on your machine for this to work.
2. Choose a location on your machine to clone the repository to.
3. Open the folder in VS code.

#### Install backend dependencies
1. Open a terminal in VS code in the backend folder.
2. Run ```npm run i``` to install the frontend dependencies.
> You need to have Node.js installed on your machine for this to work.
> Watch out for errors in the terminal. If that happend try reading the error message and resolve the issue.

#### Run the backend
1. Open a terminal in VS code in the backend folder
2. Run ```npm run dev``` to start the backend server.
> You need to have Node.js installed on your machine to run the backend.

#### Install frontend dependencies
1. Open a terminal in VS code in the root folder.
2. Run ```npm run i``` to install the frontend dependencies.
> You need to have Node.js installed on your machine for this to work.
> Watch out for errors in the terminal. If that happend try reading the error message and resolve the issue.

#### Run the frontend
1. In a root folder terminal, run ```npm run dev``` to start the frontend server. Or run ```npm run host``` to expose the frontend server to the network.
2. Open the link provided in the terminal to open the frontend in your browser. Typically its gonna be hosted on http://localhost:5173.
> You need to have Node.js installed on your machine to run the frontend. If the frontend crashes or behaves strangely, the backend is probably not running or the .env file has incorrect values.

## Congratulations!
🎉 You now have the project up and running on your machine (hopefully). You can now start developing on the project.

## Contributing guidelines
👍 We welcome contributions to this project. To contribute, speak with a teacher and get the necessary permissions and secret variables. Then follow the steps below.

### Fork the repository
1. Press the fork button in the top right corner of the repository page.
2. Choose your account as the destination for the fork.
3. Clone the forked repository to your machine.
> You need to have Git installed on your machine for this to work.

### Create a new branch
1. Open the repository in VS code.
2. Press the branch button in the bottom left corner of VS code.
3. Press the plus button to create a new branch.
4. Name the branch after the feature you are working on.

### Make changes
1. Make the changes you want to make.
2. Commit the changes to the branch you created.
3. Push the changes to the branch you created.

### Create a pull request
1. Go to the original repository page.
2. Press the pull request button.
3. Press the new pull request button.
4. Choose your forked repository as the source.
5. Choose the branch you created as the source branch.
6. Choose the main branch as the destination branch.
7. Press the create pull request button.
8. Name the pull request after the feature you are working on.
9. Press the create pull request button.

### Wait for approval
1. Wait for a teacher or the repo owner to approve your pull request.
2. If the pull request is not approved, make the necessary changes and push them to the branch you created.

### Merge the pull request
1. When the pull request is approved, press the merge pull request button.
2. Press the confirm merge button.
3. Press the delete branch button.

### Congratulations!
🎉 You have now contributed to the project. Your changes will be included in the next release of the project.

### Rules for contributing
#### ❌ **Danger zone** ❌
- YOU ARE NOT ALLOWED TO PUSH SENSITIVE INFORMATION TO THE REPOSITORY.
- YOU MUST NEVER EDIT GITHUB ACTIONS BECAUSE THEY CAN ACCESS SENSITIVE INFORMATION.
- YOU MUST NEVER PUBLISH THE .env FILE TO THE REPOSITORY.

#### ⚠️ **Branch security** ⚠️
- You are not allowed to push directly to the main branch.
- You are not allowed to merge your own pull requests.
- You are not allowed to approve your own pull requests.

If any of these rules are broken, the pull request will be denied.
