FROM postgres:latest

ENV PORT=5000
ENV JWT_SECRET=123456789
ENV DB_HOST=dpg-crm54jtumphs73ehth30-a.oregon-postgres.render.com
ENV DB_USER=itra_04_user
ENV DB_PASSWORD=QvpkoJGwcp3nr6IBJSJyI24yuFf4ZA7R
ENV DB_NAME=itra_04
ENV DB_PORT=5432

ENV POSTGRES_USER=itra_04_user
ENV POSTGRES_PASSWORD=QvpkoJGwcp3nr6IBJSJyI24yuFf4ZA7R
ENV POSTGRES_DB=itra_04

RUN apt-get update && apt-get install -y postgresql-client

COPY server.js /app/server.js

WORKDIR /app
CMD ["node", "server.js"]