// Global configuration variables can be defined here
import { registerAs } from '@nestjs/config';
export default registerAs('global', () => ({
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://user_admin:password123@localhost:5432/reporting_db?schema=public"
}));