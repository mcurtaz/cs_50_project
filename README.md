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

##### Tests
I wrote some tests using Pytest. To run the tests you need a test PostgreSQL database. For this purpose is possibile to use docker with the following command:

```shell
docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d -p5432:5432 postgres
```

And updating the `server/tests/conftest.py` file with the correct PostgreSQL connection string

```Python
@pytest.fixture(scope="session")
def app():    
    app = create_app("postgresql://postgres:mysecretpassword@localhost:5432/postgres")
    with app.app_context():
        yield app
```

Then run the tests with:

```shell
pytest
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

### Future implementations
I'd like to use some public API to get information about movies, books and so on.
I'd like to add more categories like music, videogames, theater shows etcetera.
I'd like to add more filters to find items in list.
I'd like to use github actions and cloudformation to deploy the app with aws.