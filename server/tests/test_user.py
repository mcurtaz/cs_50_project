def test_user_register(client):
    response = client.post(
        "/register",
        json={"email": "test@email.com", "password": "t3stP4ssw0rd"}
    )

    assert response.status_code == 201, "user creation failed"
    
    response = client.post(
        "/register",
        json={"email": "test@email.com", "password": "t3stP4ssw0rd"}
    )

    assert response.status_code == 409, "user duplicated"

    response = client.post(
        "/register",
        json={"email": "mail.com", "password": "t3stP4ssw0rd"}
    )

    assert response.status_code == 422, "wrong email format"

    response = client.post(
        "/register",
        json={"email": "test@email.com"}
    )

    assert response.status_code == 422, "missing password"