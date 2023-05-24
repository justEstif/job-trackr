# `/api/companies`

## GET

Get the companies of the current user

### Requires

- authorized user(auth_session in cookies)

### Response

- `image_url`: optional

```json
{
  "user1": {
    "id": "user1",
    "company": ["company2"]
  }
}
```

```json
{
  "jobs": {
    "job1": {
      "id": "job1",
      "company": "company1"
    }
  }
}
```

```json
{
  "ids": ["company1", "company2"],
  "companies": {
    "company1": {
      "id": "company1",
      "name": "Google",
      "image_url": "image",
      "jobs": ["1", "2"]
    }
  }
}
```
