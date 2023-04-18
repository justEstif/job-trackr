# API

## Endpoints

- sign-in: handled by package
- sign-up: handled by package
- sign-out
- job-applications
- search
- notifications
- job-sources
- job-company

## `/job-applications`

- POST: create job app
- GET: read all job apps

### `/job-applications/:id`

- update job app
- delete job app
- read one job app

## `/job-sources`

- create job source
- get all job sources

### `/job-sources/:id`

- delete job source
- update job source
- read one job source

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
