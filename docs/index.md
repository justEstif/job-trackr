# DOCS

##

1 user -> sign in, signs up, signs out, create jobs
-> many job
-> job -> 1 company

- jobs

  - companies

- client side use cases:

  - creating job apps
    - we need to know if the company exists or not
      - get the companies that exists or create new company
  - updating job apps

- ~can you create the companies separately?~

- GET -> getting
- POST -> creating

POST /api/job-apps

- ... fields

GET /api/companies?=Goog

- query db for `Goog` and return name, image url and ids of the companies

POST /api/companies

## TODO

- prisma: seedfile for companies
