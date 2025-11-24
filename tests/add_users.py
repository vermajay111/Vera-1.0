import requests
import json

response = requests.get("https://dummyjson.com/users")
data = response.json()

filtered_users = [
    {
        "username": user["username"],
        "first_name": user["firstName"],
        "last_name": user["lastName"],
        "password": user["password"],
        "email": user["email"],
    }
    for user in data.get("users", [])
]

signup_url = "http://127.0.0.1:8000/users/signup"

for user in filtered_users:
    try:
        res = requests.post(signup_url, json=user)
        if res.status_code == 201 or res.status_code == 200:
            print(f"Successfully sent: {user['username']}")
        else:
            print(f"Failed for {user['username']}: {res.status_code}, {res.text}")
    except Exception as e:
        print(f"Error sending {user['username']}: {e}")
