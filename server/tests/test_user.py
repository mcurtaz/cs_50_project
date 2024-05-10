import os

def test_user_register(test_client, session):
    response = test_client.post(
        "/register",
        json={"email": os.environ["USER_EMAIL"], "password": os.environ["USER_PASSWORD"]}
    )

    assert response.status_code == 201, "user creation failed"
    
    response = test_client.post(
        "/register",
        json={"email": os.environ["USER_EMAIL"], "password": os.environ["USER_PASSWORD"]}
    )

    assert response.status_code == 409, "user duplicated"

    response = test_client.post(
        "/register",
        json={"email": "mail.com", "password": os.environ["USER_PASSWORD"]}
    )

    assert response.status_code == 422, "wrong email format"

    response = test_client.post(
        "/register",
        json={"email": os.environ["USER_EMAIL"]}
    )

    assert response.status_code == 422, "missing password"

def test_user_login(test_client, session):
    response = test_client.post(
        "/login",
        json={"email": os.environ["USER_EMAIL"], "password": os.environ["USER_PASSWORD"]}
    )

    assert response.status_code == 200, "successfull login"
    assert "access_token" in response.json, "access token exist"
    assert "refresh_token" in response.json, "refresh token exist"

    refresh_token = response.json["refresh_token"]

    response = test_client.post(
        "/login",
        json={"email": os.environ["USER_EMAIL"], "password": "Wr0ngP4$$word"}
    )

    assert response.status_code == 401, "invalid credentials"