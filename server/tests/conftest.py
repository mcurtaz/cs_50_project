import sys
sys.path.append('../server')

import pytest
from flask_migrate import upgrade as flask_migrate_upgrade

from app import create_app
from db import db

@pytest.fixture(scope="session")
def app():
    app = create_app("sqlite://")

    with app.app_context():
        flask_migrate_upgrade()
        yield app

@pytest.fixture()
def client(app):
    return app.test_client()
