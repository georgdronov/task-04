# task-04

Ok this is start

Need:

- Make front, tables with toolbar and chekboxes
- Backend with authentication and database(SQL maybe)

Tech:

## Backend

- Node.js
- express
- .env
- MySql
- Docker

### Comand for Docker

_Start container:_

```bash
docker-compose up -d
```

_If Docker have problems with port_

```PowerShell
netstat -ano | findstr :3306
taskkill /PID <PID> /F
```

_Connect to DB in container:_

```bash
docker exec -it user-management-mysql mysql -uroot -p1234
```

## Frontend

- React

### Libraries

- axios
- jwt-decode
- react-router-dom
- Bootstrap
