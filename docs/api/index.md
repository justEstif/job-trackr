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

- POST: create job app
- GET: read all job apps

### `/job-applications/:id`

- PUT job app
- DELETE job app
- GET one job app

### `/job-applications/search?=`

- POST `/job-applications/search?=`

## `/job-sources`

- POST job source
- GET all job sources

### `/job-sources/:id`

- DELETE job source
- PUT job source
- GET one job source

## `/companies`

- POST create company
- GET read companies

### `/companies/:id`

- DELETE delete company
- GET get one company
- PUT update company

## `/notifications`

- GET get all notifications
- POST mark all are read

### `/notifications/:id`

- PUT update a notification
- DELETE update a notification

## `/search`
