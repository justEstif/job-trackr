# `/api/company`

## GET

### Requires

- authorized user(auth_session in cookies)

### Response

- `image_url`: optional

```json
{
  "ids": ["1", "2"],
  "companies": {
    "1": {
      "id": "company1",
      "name": "Google",
      "image_url": "image",
      "jobs": ["1", "2"]
    }
  }
}
```
