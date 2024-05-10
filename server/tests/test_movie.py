def test_movie(test_client, session):
    response = test_client.get(
        "/movie"
    )

    assert response.status_code == 200