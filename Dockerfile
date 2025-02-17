FROM --platform=$BUILDPLATFORM node:18-alpine as frontend_build
ARG BUILDPLATFORM  
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
RUN npm install -g serve
COPY frontend/ ./
RUN npm run build

FROM python:3.10-slim as final
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ /app
COPY --from=frontend_build /frontend/build /app/build
EXPOSE 80 5332
CMD serve -s build -p 80 & python app.py
