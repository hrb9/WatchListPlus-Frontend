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
RUN npm install -g serve # התקנת serve גלובלית
COPY frontend/ ./
RUN npm run build

# 2) שלב סופי - Production Image (ללא Nginx)
FROM python:3.10-slim as final # שינוי שם מ-backend ל-final
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ /app
COPY --from=frontend_build /frontend/build /app/build # העתקת build של frontend
EXPOSE 80 5332 # חשיפת פורטים 80 ו-5332 - עודכן ל-5332
CMD serve -s build -p 80 & python app.py # הגשת frontend ו-backend - אין שינוי ב-CMD
