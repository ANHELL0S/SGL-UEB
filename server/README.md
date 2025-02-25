# Usar redis

```bash
docker run --name redis-container -d -p 6379:6379 \
redis:latest redis-server --requirepass lab_ueb_redis@
```

- passs

````bash
auth lab_ueb_redis@```
````

-- in container redis

```bash
docker exec -it redis-container redis-cli
```

-- db main

docker run -d --name lab_ueb_db -e POSTGRES_USER=BlliCstsZl7jbimsNIF8S47yup0KJ6m0 -e POSTGRES_PASSWORD=BlliCstsZl7jbimsNIF8S47yup0KJ6m0 -e POSTGRES_DB=lab_ueb_db -p 5434:5432 -d postgres

-- db log

docker run -d --name lab_ueb_log -e POSTGRES_USER=BlliCstsZl7jbimsNIF8S47yup0KJ6m0 -e POSTGRES_PASSWORD=BlliCstsZl7jbimsNIF8S47yup0KJ6m0 -e POSTGRES_DB=lab_ueb_log -p 5435:5432 -d postgres
