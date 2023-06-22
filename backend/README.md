## Install the project

You will need an installation of mongoDB.
Then :

cd backend
npm i

## To start project in local mode

Create a .env file with

`PORT=3001
MONGODB_URI=http...
NODE_ENV=dev
JWT_SECRET=******
ALLOWED_ORIGIN=http://localhost:3000
`

Then write

npm run start
