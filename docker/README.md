# Docker Deployment Guide

This directory contains Docker configurations for running Nakama server locally.

## Prerequisites

- Docker and Docker Compose installed
- At least 2GB of free RAM
- Ports 5432, 7349, 7350, 7351 available

## Local Development Setup

1. **Build the backend TypeScript modules:**

```bash
cd ../backend
npm install
npm run build
```

2. **Start the Nakama server:**

```bash
cd ../docker
docker-compose up -d
```

3. **Verify services are running:**

```bash
docker-compose ps
```

You should see both `postgres` and `nakama` services running.

4. **Check logs:**

```bash
docker-compose logs -f nakama
```

## Access Points

- **Nakama Console**: http://localhost:7351
  - Username: `admin`
  - Password: `password`

- **Nakama HTTP API**: http://localhost:7350
- **Nakama gRPC API**: localhost:7349

## Stopping Services

```bash
docker-compose down
```

To also remove volumes (database data):

```bash
docker-compose down -v
```

## Cloud Deployment

### Option 1: DigitalOcean App Platform

1. Create a new App in DigitalOcean
2. Use Docker Hub deployment method
3. Set environment variables as per `nakama-config.yml`
4. Ensure PostgreSQL database is provisioned

### Option 2: AWS ECS/Fargate

1. Push Docker image to ECR
2. Create ECS task definition
3. Set up RDS PostgreSQL instance
4. Configure security groups for ports 7350, 7351
5. Deploy via ECS service

### Option 3: Google Cloud Run

1. Build and push to Google Container Registry
2. Deploy Cloud Run service
3. Set up Cloud SQL PostgreSQL
4. Configure environment variables
5. Enable ingress from all sources

## Environment Variables for Production

```yaml
NAKAMA_DATABASE_NAME=nakama
NAKAMA_DATABASE_USER=<your-db-user>
NAKAMA_DATABASE_PASSWORD=<your-db-password>
NAKAMA_DATABASE_ADDRESS=<your-db-host>:5432
```

## Troubleshooting

### Nakama won't start

- Check if PostgreSQL is healthy: `docker-compose logs postgres`
- Verify database connection: `docker-compose exec postgres psql -U postgres -d nakama`

### Module not loading

- Ensure backend is built: `cd backend && npm run build`
- Check module path in docker-compose.yml
- View Nakama logs for JavaScript errors

### Connection refused from frontend

- Verify Nakama is listening on 0.0.0.0, not 127.0.0.1
- Check firewall rules
- Ensure correct port forwarding in docker-compose.yml
