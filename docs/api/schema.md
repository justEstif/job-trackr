# Database Schemas

- company
- job-application
- job-source
- notification
- user

## user

```sql
CREATE TAB user(
  id SERIAL,
  username CHAR(32) UNIQUE NOT NULL,
  hash_password VARCHAR(64) NOT NULL,
  PRIMARY KEY(id)
);
```

## job-application

```sql
CREATE TYPE status as ENUM('applied', 'interviewing', 'denied', 'declined', 'archived');

CREATE TABLE job_application(
  id SERIAL,
  title VARCHAR(64),
  interest SMALLINT(5),
  status status NOT NULL,
  salary INTEGER,
  description TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  user_id integer references user(id) on delete cascade,
  company_id integer references company(id) on delete cascade,
  company_id integer references company(id) on delete cascade,
  job_source_id integer references job_source(id) on delete cascade,
);
```

## job-source

```sql
CREATE TABLE job-source(
  id SERIAL,
  name VARCHAR(64) UNIQUE NOT NULL,
  home_url VARCHAR(64),
  image_url VARCHAR(64)
  description TEXT,
  user_id integer references user(id) on delete cascade,
)
```

## company

```sql
CREATE TABLE company(
  id SERIAL,
  name VARCHAR(64) UNIQUE NOT NULL,
  home_url VARCHAR(64),
  image_url VARCHAR(64)
  description TEXT,
  user_id integer references user(id) on delete cascade,
)
```

## notification

```sql
CREATE TABLE notification(
  id SERIAL,
  name VARCHAR(64) UNIQUE NOT NULL,
  date  -- + 2 weeks of job application created_at or updated_at
  user_id integer references user(id) on delete cascade,
  job_application_id integer references job_application(id) on delete cascade,
)
```
