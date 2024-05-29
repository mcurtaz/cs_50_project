import os

book_data = {
    "image_url": "https://upload.wikimedia.org/wikipedia/en/8/8e/The_Fellowship_of_the_Ring_cover.gif",
    "title": "LOTR - Fellowship of the ring",
    "description": "A classic.",
    "author": "J.R.R. Tolkien",
    "rating": 5,
    "status": "TO_READ"
}
def test_book(test_client, session, access_token):
    response = test_client.post(
        "/book",
        json=book_data,
        headers={'Authorization': f'Bearer {access_token}'}
    )

    assert response.status_code == 201, "book created successfully"
    assert response.json["image_url"] == book_data["image_url"]
    assert response.json["title"] == book_data["title"]
    assert response.json["description"] == book_data["description"]
    assert response.json["author"] == book_data["author"]
    assert response.json["rating"] == book_data["rating"]
    assert response.json["status"] == book_data["status"]

    book_id = response.json["id"]

    response = test_client.get(
        "/book",
        headers={'Authorization': f'Bearer {access_token}'}
    )

    assert response.status_code == 200, "book in book list"
    assert len(response.json) == 1
    assert response.json[0]["image_url"] == book_data["image_url"]
    assert response.json[0]["title"] == book_data["title"]
    assert response.json[0]["description"] == book_data["description"]
    assert response.json[0]["author"] == book_data["author"]
    assert response.json[0]["rating"] == book_data["rating"]
    assert response.json[0]["status"] == book_data["status"]

    response = test_client.get(
        f"/book/{book_id}",
        headers={'Authorization': f'Bearer {access_token}'}
    )

    assert response.status_code == 200, "get single book"
    assert response.json["image_url"] == book_data["image_url"]
    assert response.json["title"] == book_data["title"]
    assert response.json["description"] == book_data["description"]
    assert response.json["author"] == book_data["author"]
    assert response.json["rating"] == book_data["rating"]
    assert response.json["status"] == book_data["status"]

    response = test_client.put(
        f"/book/{book_id}",
        headers={'Authorization': f'Bearer {access_token}'},
        json={
            "description": "Best book ever!",
            "status": "COMPLETED"
        }
    )

    assert response.status_code == 200, "put single attribute"
    assert response.json["image_url"] == book_data["image_url"]
    assert response.json["title"] == book_data["title"]
    assert response.json["description"] == "Best book ever!"
    assert response.json["author"] == book_data["author"]
    assert response.json["rating"] == book_data["rating"]
    assert response.json["status"] == "COMPLETED"

    response = test_client.delete(
        f"/book/{book_id}",
        headers={'Authorization': f'Bearer {access_token}'}
    )

    assert response.status_code == 200, "book deleted"

    response = test_client.get(
        f"/book/{book_id}",
        headers={'Authorization': f'Bearer {access_token}'}
    )

    assert response.status_code == 404, "book deleted not found"