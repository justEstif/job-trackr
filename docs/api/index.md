# API

## Endpoints

- [ ] sign-in: handled by package
- [ ] sign-up: handled by package
- [ ] sign-out
- job-applications
- search
- notifications
- job-sources
- job-company

## `/job-applications`

**requires user id**

- POST: create job app
- GET: read all job apps

### `/job-applications/:id`

**requires user id**

- PUT job app
- DELETE job app
- GET one job app

### `/job-applications/search?=`

**requires user id**

- POST `/job-applications/search?=`

## `/companies`

**requires user id**

- POST create company
- GET read companies

### `/companies/:id`

**requires user id**

- DELETE delete company
- GET get one company
- PUT update company

## `/notifications`

**requires user id**

- GET get all notifications
- POST mark all are read

### `/notifications/:id`

- PUT update a notification
- DELETE update a notification
