# Dockerfile

# 1) Build React
ARG BUILDPLATFORM # Keep this declaration at the top level (optional, good practice)
FROM --platform=$BUILDPLATFORM node:18-alpine as frontend_build
ARG BUILDPLATFORM # Re-declare ARG inside the frontend_build stage
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV
WORKDIR /frontend
RUN uname -m # Add command to print architecture - לפני echo
RUN echo "BUILDPLATFORM is: $BUILDPLATFORM" # Keep the debug echo
RUN uname -m # Add command to print architecture - לפני npm install
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# 2) Build Backend
FROM python:3.10-slim as backend
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ /app

# 3) Stage 2 - Production Image
FROM nginx:stable-alpine as stage-2
WORKDIR /app
COPY --from=backend /app /app
COPY --from=frontend_build /frontend/build /app/build
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
