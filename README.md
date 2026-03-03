# Restaurant App

This contains the api, admin portal and mobile app

## Setup Requirements

Docker Desktop

## To setup the project locally

Run the following commands:

```sh
git clone git@github.com:abdulganiyy/ileiyanbypods.git
```

### Backend

```sh
cd apps/api && pnpm install

docker compose up -d

npx prisma db seed

pnpm run dev
```

### Frontend

```sh
cd apps/admin && pnpm install

pnpm run dev
```
