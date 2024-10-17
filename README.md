# The Enjoy List
It's a web app to keep track of think you'd like to do. Is like a to do list but instead of things you have to do it’s for activities you'd enjoy.

The backend is a REST API written using Python and flask. PostgreSQL is used as database.

### Run locally

#### Server
Inside the `server` folder create an `.env` file with the following environment variable definitions.

```
JWT_SECRET_KEY=random_string_here
DATABASE_URL=postgresql://postgres:local_password@db/local_db
```

Run the docker with Python server and PostgreSQL db. (make sure Docker is installed)
```shell
$ cd server
$ docker compose up
```

#### Web app
Inside the `server` folder create an `.env` file with the following environment variable definition:

```
VITE_API_BASEURL=http://127.0.0.1:5000/api/
```
Run the application in development mode (ensure Node.js and npm are installed)

```shell
$ cd web
$ npm install
$ npm run dev
```