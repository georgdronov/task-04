# task-04
### Deploy
- Frontend **Vercel*: https://task-04-wine.vercel.app/
- Backend **Railway*: 



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

*If server.js not connected to data base use this:*
```
docker stop user-management-mysql
docker rm user-management-mysql
docker-compose up -d
docker ps
docker logs user-management-mysql
docker rename user-management-mysql old-user-management-mysql

all need to be clear

then in PowerShell
netstat -ano | findstr :3306
taskkill /PID <PID> /F

finally
docker-compose up -d

node server.js
```

## Frontend

- React

### Libraries

- axios
- jwt-decode
- react-router-dom
- Bootstrap
