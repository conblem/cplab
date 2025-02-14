## Getting Started

Create a .env.local file with the following content:

```
AUTH_SECRET= #Random Value generate with openssl rand -hex 32
NEXT_PUBLIC_ZITADEL_ISSUER=https://cplab-4cjup2.us1.zitadel.cloud
ZITADEL_CLIENT_ID=305914409652390876
ZITADEL_PROJECT_ID=305914388244597724
DATABASE_URL=postgresql://neondb_owner:password@hostname.neon.tech/neondb?sslmode=require #insert correct connection string
R2_ENDPOINT=https://2cb0b38264e5a96c2d650266fa501fc6.eu.r2.cloudflarestorage.com/cplab
R2_ACCESS_KEY_ID= #insert correct r2 access key id
R2_ACCESS_KEY= #insert correct r2 access key
AWS_ACCESS_KEY_ID= #insert correct aws access key id
AWS_SECRET_ACCESS_KEY= #insert correct aws secret access key
CRON_SECRET= #Random Value generate with openssl rand -hex 32
RESEND_KEY= #insert correct resend api key
```
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
