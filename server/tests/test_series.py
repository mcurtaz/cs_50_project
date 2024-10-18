import os

series_data = {
    "image_url": "https://m.media-amazon.com/images/M/MV5BMjRmMTNiMTQtMDg1ZS00MGM1LWE1MGUtYjEzMGFjNWUzOWRkXkEyXkFqcGc@._V1_.jpg",
    "title": "The Sopranos",
    "description": "Best series ever.",
    "rating": 5,
    "status": "COMPLETED"
}
def test_series(test_client, session, access_token):
    response = test_client.post(
        "/api/series",
        json=series_data,
        headers={'Authorization': f'Bearer {access_token}'}
    )

    assert response.status_code == 201, "series created successfully"
    assert response.json["image_url"] == series_data["image_url"]
    assert response.json["title"] == series_data["title"]
    assert response.json["description"] == series_data["description"]
    assert response.json["rating"] == series_data["rating"]
    assert response.json["status"] == series_data["status"]

    series_id = response.json["id"]

    response = test_client.get(
        "/api/series",
        headers={'Authorization': f'Bearer {access_token}'}
    )

    assert response.status_code == 200, "series in series list"
    assert len(response.json["series"]) == 1
    assert response.json["series"][0]["image_url"] == series_data["image_url"]
    assert response.json["series"][0]["title"] == series_data["title"]
    assert response.json["series"][0]["description"] == series_data["description"]
    assert response.json["series"][0]["rating"] == series_data["rating"]
    assert response.json["series"][0]["status"] == series_data["status"]

    response = test_client.get(
        f"/api/series/{series_id}",
        headers={'Authorization': f'Bearer {access_token}'}
    )

    assert response.status_code == 200, "get single series"
    assert response.json["image_url"] == series_data["image_url"]
    assert response.json["title"] == series_data["title"]
    assert response.json["description"] == series_data["description"]
    assert response.json["rating"] == series_data["rating"]
    assert response.json["status"] == series_data["status"]

    response = test_client.put(
        f"/api/series/{series_id}",
        headers={'Authorization': f'Bearer {access_token}'},
        json={
            "description": "Best series ever!",
            "status": "COMPLETED"
        }
    )

    assert response.status_code == 200, "put single attribute"
    assert response.json["image_url"] == series_data["image_url"]
    assert response.json["title"] == series_data["title"]
    assert response.json["description"] == "Best series ever!"
    assert response.json["rating"] == series_data["rating"]
    assert response.json["status"] == "COMPLETED"

    response = test_client.delete(
        f"/api/series/{series_id}",
        headers={'Authorization': f'Bearer {access_token}'}
    )

    assert response.status_code == 200, "series deleted"

    response = test_client.get(
        f"/api/series/{series_id}",
        headers={'Authorization': f'Bearer {access_token}'}
    )

    assert response.status_code == 404, "series deleted not found"