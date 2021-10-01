# GeekChat

## What is GeekChat?

GeekChat is a simple bi-directional communication app where users can join rooms and have live text messaging with other users present in the room. It works on the functionalities of Web Sockets and simple HTTPS requests.

### Tech Stack
* Nodejs
* Express
* Socket.io
* HTML
* CSS(SCSS)
* Javascript


## Local Setup

### Pre-Requisites
* [Git](https://git-scm.com/downloads)
* [Node.js](https://nodejs.org/en/)
* [SCSS Live Compiler](https://marketplace.visualstudio.com/items?itemName=ritwickdey.live-sass)(Only if you are changing the styling of the website)

### How to Setup?

* Fork the repo.
* Clone it to your local setup by using the command `git clone <repo link>`
* Run the following command in the root directory of the project `npm install`
* After the process is completed run the command `node app.js`
* The website will be live on [localhost:3000](https://localhost:3000)

## Brief Project Structure

```
/
|-- public/			
    |-- css/           #Contains the scss styling files
    |-- images/        #Contains images used in the project
    |-- js/            #Contains client side js files
    |-- index.html     #First webpage of the project
    |-- main.html      #Main chatting page of the website
|    
|-- utils/
    |-- message.js/    #Contains all functions and variables concerning Chat Messages.
    |-- users.js/      #Contains all functions and variables concerning Users
|    
|-- app.js             #Main Server file that setups and runs the node server.

```

## Guidelines

### Please help us follow the best practice to make it easy for the reviewer as well as the contributor. We want to focus on the code quality more than on managing pull request ethics.

* Single commit per pull request and name the commit as something meaningful, example: Adding <-your-name-> in students/mentors section.

* Reference the issue numbers in the commit message if it resolves an open issue.**Follow the PR template strictly.**

* In case you want to change the styling of the website do not change the .css files instead change the .scss files and then compile them.(More details)[https://ritwickdey.github.io/vscode-live-sass-compiler/docs/faqs.html]

* Do not use unneccesary variables or functions and follow a easy and understandable code struture with proper comments.

* Provide the link to live heroku pages from your forked repository or relevant screenshot for easier review.

* Pull Request older than 3 days with no response from the contributor shall be marked closed.

* Do not make PR which is not related to any issues. You can create an issue and solve it once we approve them.

* Avoid duplicate PRs, if need be comment on the older PR with the PR number of the follow-up (new PR) and close the obsolete PR yourself.

* Be polite: Be polite to other community members.

## Communicate

Whether you are working on a new feature or facing a doubt please feel free to ask us on our [discord](https://discord.gg/WxZhCNNN) channel. We will be happy to help you out.
