import os
import sys
sys.path.append('../server')

import pytest
from flask_migrate import upgrade as flask_migrate_upgrade

from app import create_app
from db import db as _db

@pytest.fixture(scope="session", autouse=True)
def set_env():
    os.environ["USER_EMAIL"] = "test@email.com"
    os.environ["USER_PASSWORD"] = "t3stP4ssw0rd"

@pytest.fixture(scope="session")
def app():    
    app = create_app("sqlite://")    
    with app.app_context():
        yield app

@pytest.fixture(scope="function")
def test_client(app):
    return app.test_client()

@pytest.fixture(scope="session")
def db(app, request):
    """Session-wide test database."""

    def teardown():
        _db.drop_all()
    _db.app = app

    flask_migrate_upgrade(directory="migrations")
    request.addfinalizer(teardown)
    return _db

@pytest.fixture(scope="function")
def session(db, request):
    db.session.begin_nested()

    def teardown():
        db.session.rollback()
        db.session.close()

    request.addfinalizer(teardown)
    return db.session

@pytest.fixture()
def client(app):
    return app.test_client()

@pytest.fixture(scope="function")
def access_token(client):
    response = client.post(
        "/login",
        json={"email": os.environ["USER_EMAIL"], "password": os.environ["USER_PASSWORD"]}
    )

    return response.json["access_token"]
