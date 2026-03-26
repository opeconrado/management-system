# Build stage for frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
ENV REACT_APP_API_URL=http://localhost:3001/api
RUN npm run build

# Frontend production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=frontend-builder /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
