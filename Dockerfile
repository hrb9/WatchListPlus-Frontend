# 1) Build React
FROM node AS frontend_build
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# 2) Build Python (Flask) and install dependencies
FROM python AS backend
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt
COPY backend/ /app

# 3) Final stage: combine both and include installed packages
FROM python:3.10-slim AS final
WORKDIR /app

# Copy installed Python packages from the backend stage
COPY --from=backend /usr/local /usr/local

# Copy the application code from the backend stage
COPY --from=backend /app /app

# Copy the React build output from the frontend_build stage
COPY --from=frontend_build /frontend/build /app/build

ENV PORT=5332
EXPOSE 5332

CMD ["python", "app.py"]
