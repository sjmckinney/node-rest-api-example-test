## README

### Project set up

There test suite has been developed to run agains't it's sister project on github.

* [node-rest-api-example](https://github.com/sjmckinney/node-rest-api-example)

To set up the rest API endpoints clone the `node-rest-api-example` project and install the dependencies.

Whilst the test shoudl work out of the box if the docker image option is used you will need to customise the connection string in both projects to allow the projects to connect to a remote instance. The _README.md_ contains details about configuring the connection string to connect to a mongodb instance either online or by using a docker image hosted locally.

The function `getConnectionUri` in the file `/tests/setup/before-tests.ts` will need to be amended with the correct details of any remote instance.

The file `.env.example` should be used to create a `.env` file. This file contains the values for remote and local test user passwords and the JSON Web Token (JWT) secret and should mirror the values contained in the `nodemon.json` file in the `node-rest-api-example` project.

### Running the tests

When running the tests against a local mongodb instance use the command `npm run all-local`.

Alternately run `npm run all-remote` when using a remote mongodb instance.

These scripts set the value of an environent variable "NODE_ENV" which in turn dictates the value of the connection string and so which database the code in _before_ and _after_ scripts connect to for setup and tear down processes.
