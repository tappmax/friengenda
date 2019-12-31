# friengenda

## Setup

### Prerequisites

* Node 11.10.1 `nvm use 11.10.1`

### Config

* create a copy of `config/development.json` as `config/local.json` and set appropriate settings
* Add values to `AdminFirstName`, `AdminLastName`, `AdminEmail`, and `AdminPassword` to automatically create an admin account with all roles.

### Database

[Install](https://www.postgresql.org/download/) postgres on your machine and create a database called `friengenda`.
run `knex migrate:latest` to migrate to the latest database settings.  You may need to install knex first with `nmp install -g knex`.

### API

1. Run ```npm install```
2. Run ```npm run start``` from the root folder.
    * Alternatively, ```npm run build:start``` from the root folder will build the typescript and then start the server

In order to see changes you made in code reflected while running the projects, you must either run ```npm install``` or ```tsc``` from the root directory. This will build the project with the new changes.

### Client

1. Run ```npm install``` inside the client directory.
2. Run ```npm run client:build``` from the root directory.
3. Run ```npm run client``` from the root directory.
    * Alternatively, ```npm run client:build:start``` from the root folder will build the client app and then start it

After the above steps, your browser should open a window to *localhost:3000* and display an error. If you already have the **API** project running, simply navigate to *localhost:5000* and the project should be running.

As you add changes, the updates will be reflected immediately in the browser. *This does not, however, mean that they are ready to be checked in*. Before committing, the build process is still necessary, as the watcher was set on the code client/src, and not the built code folder which is what will eventually be published.
