## Install the project

You will need an installation of mongoDB.
Then :

cd backend
npm 
## To start project in local mode

Create a .env file with

`PORT=3001
MONGODB_URI=http...
NODE_ENV=dev
JWT_SECRET=******
ALLOWED_ORIGIN=http://localhost:3000
`

Then write

npm run dev

## To start project in production

```bash
npm i
npm run build
npm run start`
```
