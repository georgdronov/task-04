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
*Start container:*
- docker-compose up -d

*if Docker have problems with port*
- Powershell: netstat -ano | findstr :3306
- taskkill /PID <PID> /F

 *Connect to DB in container:*
- docker exec -it user-management-mysql mysql -uroot -p
- then enter password => MYSQL_PASSWORD
