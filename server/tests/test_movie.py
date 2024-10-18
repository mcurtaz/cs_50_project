import os

movie_data = {
    "image_url": "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    "title": "LOTR - Fellowship of the ring",
    "description": "A classic.",
    "rating": 5,
    "status": "TO_WATCH"
}
def test_movie(test_client, session, access_token):
    response = test_client.post(
        "/api/movie",
        json=movie_data,
        headers={'Authorization': f'Bearer {access_token}'}
    )

    assert response.status_code == 201, "movie created successfully"
    assert response.json["image_url"] == movie_data["image_url"]
    assert response.json["title"] == movie_data["title"]
    assert response.json["description"] == movie_data["description"]
    assert response.json["rating"] == movie_data["rating"]
    assert response.json["status"] == movie_data["status"]

    movie_id = response.json["id"]

    response = test_client.get(
        "/api/movie",
        headers={'Authorization': f'Bearer {access_token}'}
    )

    assert response.status_code == 200, "movie in movie list"
    assert len(response.json["movies"]) == 1
    assert response.json["movies"][0]["image_url"] == movie_data["image_url"]
    assert response.json["movies"][0]["title"] == movie_data["title"]
    assert response.json["movies"][0]["description"] == movie_data["description"]
    assert response.json["movies"][0]["rating"] == movie_data["rating"]
    assert response.json["movies"][0]["status"] == movie_data["status"]

    response = test_client.get(
        f"/api/movie/{movie_id}",
        headers={'Authorization': f'Bearer {access_token}'}
    )

    assert response.status_code == 200, "get single movie"
    assert response.json["image_url"] == movie_data["image_url"]
    assert response.json["title"] == movie_data["title"]
    assert response.json["description"] == movie_data["description"]
    assert response.json["rating"] == movie_data["rating"]
    assert response.json["status"] == movie_data["status"]

    response = test_client.put(
        f"/api/movie/{movie_id}",
        headers={'Authorization': f'Bearer {access_token}'},
        json={
            "description": "Best movie ever!",
            "status": "COMPLETED"
        }
    )

    assert response.status_code == 200, "put single attribute"
    assert response.json["image_url"] == movie_data["image_url"]
    assert response.json["title"] == movie_data["title"]
    assert response.json["description"] == "Best movie ever!"
    assert response.json["rating"] == movie_data["rating"]
    assert response.json["status"] == "COMPLETED"

    response = test_client.delete(
        f"/api/movie/{movie_id}",
        headers={'Authorization': f'Bearer {access_token}'}
    )

    assert response.status_code == 200, "movie deleted"

    response = test_client.get(
        f"/api/movie/{movie_id}",
        headers={'Authorization': f'Bearer {access_token}'}
    )

    assert response.status_code == 404, "movie deleted not found"