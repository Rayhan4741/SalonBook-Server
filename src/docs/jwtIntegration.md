# Express & Better Auth JWT Integration

1. Next.js Client calls Better Auth via `@better-auth/react`.
2. Better Auth writes session tokens and user records to MongoDB.
3. Protected requests include `Authorization: Bearer <token>` or session cookies.
4. Express `authenticate` middleware verifies signature against `BETTER_AUTH_SECRET`.
5. User is looked up from MongoDB `User` model to obtain real-time `role` and `isBlocked` values.
