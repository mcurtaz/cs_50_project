# The Enjoy List
It's a web app to keep track of think you'd like to do. Is like a to do list but instead of things you have to do it’s for activities you'd enjoy.

The backend is a REST API written using Python and flask. PostgreSQL is used as database.
The client is written using React with Typescript and Tailwind CSS.

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

### Notes

#### REST API
The REST API is written with Python and Flask.

It uses some libraries like:
- Flask-SQLAlchemy: it's an ORM (Object-Relational Mapping). It maps database tables to Python classes, so you can interact with your database using Python objects instead of writing raw SQL queries. You can define models (Python classes) that correspond to database tables, and SQLAlchemy handles the translation between Python and SQL.
- Flask-Smorest: is a Flask extension that simplifies the development of REST APIs by integrating Marshmallow (for data serialization and validation), SQLAlchemy (for ORM/database interaction), and OpenAPI (for API documentation).
- Flask-Jwt-Extended: it provides JWT utilities that helps you write authentication functionalities and secure your API endpoints.
- Pytest: I have written some tests with this Python library.

#### WEB CLIENT
I used React as library for the Web Client. I used Typescript to make Javascript type safe. To help me with styling I used Tailwind and Shadcn ui which provides you with some basic components like buttons, select and so on.

With autentication I choosed to store the access token in the session storage based on [JSON Web Token Cheat by OWASP](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.md#token-storage-on-client-side). The cheatsheet suggest that this method could be vulnerable to XSS issues and provide a solution which I think it might be overkill for an Enjoy List Webapp. Notherless I may be implement it in the future.

### Future implementations
I'd like to add more categories like music, videogames, shows etcetera.

I'd like to add more filters to find items in list.

I'd like to use some public API