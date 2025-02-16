# Dockerfile

# 1) Build React
FROM --platform=$BUILDPLATFORM node:18-alpine as frontend_build # שורה ששוּנתה
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# 2) Build Python (Flask)
FROM python:3.10-slim as backend
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ /app

# 3) Final stage: combine both
FROM python:3.10-slim
WORKDIR /app
# Copy backend code from the backend stage
COPY --from=backend /app /app
# Copy React build output from the frontend_build stage
COPY --from=frontend_build /frontend/build /app/build

ENV PORT=5332
EXPOSE 5332

CMD ["python", "app.py"]
