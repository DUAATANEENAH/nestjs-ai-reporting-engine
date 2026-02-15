# Reporting Engine (NestJS + Prisma + BullMQ)

Reporting Engine is a backend service that:
- accepts CSV file uploads,
- stores report metadata and row data in PostgreSQL,
- processes jobs via BullMQ/Redis,
- runs AI analysis on sampled data,
- pushes status updates over WebSocket,
- exposes Swagger docs.

## Tech Stack
- NestJS
- Prisma + PostgreSQL
- BullMQ + Redis
- Jest (unit + coverage)
- Swagger

## Main Features
- `POST /reports/upload/:type` to upload CSV and enqueue processing.
- Async report pipeline (`PENDING -> IN_PROGRESS -> AI_ANALYSIS -> COMPLETED/FAILED`).
- AI summary generation.
- WebSocket progress updates (`namespace: reports`).

## Supported Report Types
- `SALES_ANALYSIS`
- `USER_FEEDBACK`
- `INVENTORY_AUDIT`
- `MARKETING_LEADS`

## Project Structure
- `src/models/reports` business module (controller/service/processor/enums/utils).
- `src/providers` Prisma service + entities.
- `prisma/schema.prisma` database schema.
- `config/global.ts` app-level config defaults.
- `test/unit` unit tests.

## Prerequisites
- Node.js 20+ (22 recommended)
- npm
- Docker + Docker Compose

## 1) Clone and Install
```bash
git clone <your-repo-url>
cd reporting-engine
npm install
```

## 2) Environment Variables
Create `.env` in project root (`reporting-engine/.env`):

```env
DATABASE_URL="postgresql://user_admin:password123@localhost:5432/reporting_db?schema=public"
GOOGLE_API_KEY="your-google-api-key"

REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""

# optional queue name override
REPORTING_QUEUE="report-queue"
```

Notes:
- `DATABASE_URL` and `GOOGLE_API_KEY` are also read via `config/global.ts`.
- Redis defaults to `localhost:6379` if not set.

## 3) Start PostgreSQL and Redis
```bash
docker compose up -d postgres redis
```

Optional (Prisma Studio in Docker):
```bash
docker compose up -d prisma-studio
```
- Prisma Studio URL: `http://localhost:5555`

## 4) Prisma Setup
Generate client and sync schema:

```bash
npx prisma generate --schema prisma/schema.prisma
npx prisma db push --schema prisma/schema.prisma
```

Optional (if you prefer migrations):
```bash
npx prisma migrate dev --config ./prisma/prisma.config.ts --name init
```

## 5) Run the App
Development:
```bash
npm run start:dev
```

Production build/run:
```bash
npm run build
npm run start:prod
```

Default server URL: `http://localhost:3000`

Swagger docs: `http://localhost:3000/docs`

## 6) Upload Route (cURL Examples)

### macOS/Linux
```bash
curl -X POST "http://localhost:3000/reports/upload/SALES_ANALYSIS" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@./sample.csv"
```

### Windows PowerShell
```powershell
curl.exe -X POST "http://localhost:3000/reports/upload/SALES_ANALYSIS" `
  -H "accept: application/json" `
  -F "file=@C:/path/to/sample.csv"
```

Successful response shape:
```json
{
  "message": "Report enqueued successfully",
  "reportId": "<uuid>",
  "filePath": "uploads/file-<suffix>.csv"
}
```

## 7) WebSocket Progress Updates
- Namespace: `reports`
- Event name: `report_<reportId>`
- Payload shape:
```json
{
  "status": "in_progress",
  "progress": 42,
  "message": "Processing batch..."
}
```

## 8) Testing
Run all unit tests:
```bash
npm test
```

Watch mode:
```bash
npm run test:watch
```

Coverage:
```bash
npm run test:cov
```

Debug tests:
```bash
npm run test:debug
```

E2E tests:
```bash
npm run test:e2e
```

## 9) Lint & Format
Lint:
```bash
npm run lint
```

Auto-fix lint issues:
```bash
npm run lint:fix
```

Format:
```bash
npm run format
```

## 10) Common Troubleshooting

### Prisma client errors
If Prisma client is outdated after schema changes:
```bash
npx prisma generate --schema prisma/schema.prisma
```

### DB connection issues
- Verify PostgreSQL container is running:
  ```bash
  docker ps
  ```
- Check `.env` `DATABASE_URL` matches DB credentials.

### Redis connection issues
- Verify Redis container is running and reachable on `6379`.
- Check `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`.

### Upload errors
- Ensure file is sent as multipart with field name exactly `file`.
- Ensure route type is one of supported report types.

## API Summary
- `POST /reports/upload/:type` upload & enqueue report
- `GET /docs` Swagger UI

## License
UNLICENSED
