# NestJS Authentication Implementation Prompt

## Goal

Implement backend authentication for the ERP using NestJS Passport with two providers: local credentials (email/password) and Google OAuth 2.0. Issue JWT access tokens, expose authenticated-user endpoints, and protect API routes through a global JWT guard with an explicit `@Public()` opt-out. The authentication layer must work with the existing Drizzle/Neon tenant schema without trusting client-supplied tenant or role data.

## Skills Read

- `AGENTS.md`
- `.agents/skills/neon-postgres/SKILL.md` was previously applied to the database foundation; this change includes a Drizzle schema migration and must preserve its migration/RLS conventions.

## Existing Code Inspected

- `server/src/authentication/` is an empty controller/service/module scaffold.
- `server/src/main.ts` has no global validation pipe, CORS configuration, or authentication middleware/guard.
- `server/src/database/schema/index.ts` contains the `users` identity table, `tenant_memberships`, roles, and RLS migrations; migrations have been generated but not applied to Neon.
- `server/src/database/tenant-transaction.service.ts` supports trusted transaction-local RLS tenant context. Authentication must not set a tenant context from a request body.
- `server/package.json` has no Passport, JWT, OAuth, bcrypt, or DTO validation dependencies.

## Architecture Decisions

- Use `@nestjs/passport`, `passport`, `passport-local`, `passport-jwt`, `passport-google-oauth20`, `@nestjs/jwt`, `bcrypt`, `class-validator`, and `class-transformer`.
- Keep user identity in `users`; make `password_hash` nullable to permit Google-only accounts. Add a normalized `user_auth_accounts` table with `(provider, provider_account_id)` uniqueness and a user relation. Never store a Google access token, refresh token, or profile payload.
- Credentials authentication uses normalized (trimmed/lowercase) email and bcrypt password comparison. Password hashes are never returned in API responses or JWTs.
- Google authentication verifies the provider callback using the configured client ID/secret and callback URL. It finds or creates the linked identity safely; verified Google email is required. Account linking by email is allowed only for a verified email and creates the provider identity transactionally.
- JWT payload remains minimal: `sub` (user UUID), email, and platform-admin flag. Do not include a tenant ID, role, permissions, or other mutable authorization claims in the token.
- `JwtAuthGuard` is registered globally through `APP_GUARD`. All endpoints require a valid bearer token unless explicitly annotated `@Public()`. Login and Google start/callback endpoints are public.
- Add a `CurrentUser` decorator and a typed authenticated request/user shape. Controllers remain thin; validation, account lookup, password comparison, token issuance, and Google-user resolution belong in the service/strategies.
- Tenant-aware modules added later must load tenant membership/permissions server-side on each request, authorize the selected tenant, then use `TenantTransactionService.withTenant()` for database access. JWT validation alone is not tenant authorization.

## Database Changes

- Update `users.password_hash` to allow `NULL` for accounts that authenticate exclusively through Google.
- Add `auth_provider` enum: `credentials`, `google`.
- Add `user_auth_accounts` with UUID primary key, `user_id`, provider, provider account ID, provider email, created/updated timestamps, unique `(provider, provider_account_id)`, and unique `(user_id, provider)`.
- Add a Drizzle migration using the existing `db:generate` workflow. Do not apply it to Neon in this implementation pass.
- This account table is identity/auth data, not tenant-owned business data; do not add tenant RLS. Tenant membership and business data remain protected by existing RLS policies.

## API Changes

- `POST /authentication/login` (public): validates `{ email, password }` and returns `{ accessToken, tokenType: 'Bearer', user }`.
- `GET /authentication/google` (public): begins Google OAuth redirect.
- `GET /authentication/google/callback` (public): verifies the Google callback, resolves the user, and returns the same token response. Initial backend-only implementation returns JSON; do not introduce frontend redirect URLs until a frontend integration requirement is supplied.
- `GET /authentication/me` (protected): returns the current safe user profile.
- `GET /authentication/health` (protected): minimal guard verification endpoint for automated tests.
- Return generic `401 Unauthorized` errors for invalid credentials. Never reveal whether an email exists.

## Environment Variables

Add placeholders only to `server/.env.example`; do not modify the existing secret-bearing `.env`:

- `JWT_SECRET` (required, long random server-only value)
- `JWT_EXPIRES_IN` (default `15m`)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL` (for example `http://localhost:5000/authentication/google/callback`)

Startup must fail clearly if JWT configuration is missing. Google strategy may be disabled when Google variables are absent, returning a safe configuration error only from Google endpoints; credential authentication remains available.

## Security Requirements

- Use bcrypt with an appropriate cost factor; never log plaintext passwords, JWTs, OAuth codes, provider secrets, database URLs, or password hashes.
- Do not expose sensitive database errors or OAuth provider errors.
- Use DTO validation and a global `ValidationPipe` with whitelist, forbid-non-whitelisted, and transform settings.
- Use JWT Bearer extraction only; do not place the token in URLs.
- Validate active user status on every JWT request by loading the user from the database. Disabled users cannot use an otherwise unexpired token.
- Do not implement a client-controlled tenant switch, role check, refresh-token storage, password reset, email verification, or frontend session cookies in this focused change.
- Audit-log hooks are deferred until an audit service exists; do not bypass tenant RLS to add them.

## Files Likely To Change

- `server/package.json` and lockfile
- `server/src/authentication/*`
- `server/src/common/auth/*`
- `server/src/main.ts`
- `server/src/database/schema/index.ts`
- generated files under `server/drizzle/`
- `server/.env.example`
- `server/README.md`
- focused authentication tests

## Implementation Plan

1. Install Passport/JWT/Google OAuth/bcrypt/validation dependencies.
2. Add the identity-provider schema changes and generate, inspect, but do not apply the Drizzle migration.
3. Create DTOs, local/JWT/Google strategies, JWT guard, public/current-user decorators, and safe user/token types.
4. Implement credential login, Google redirect/callback, and protected `me`/health routes.
5. Register global validation and authentication protection.
6. Add unit tests for credential validation, JWT guard public/protected behavior, inactive-user rejection, and Google profile account-resolution logic.
7. Run formatting, lint without unrelated automatic edits, tests, TypeScript build, and migration generation.

## Acceptance Criteria

- Valid active credential users can receive a JWT; incorrect/unknown credentials return the same safe unauthorized response.
- Google OAuth has a complete Passport initiation/callback flow controlled solely by server-side configuration.
- Every route is protected by default; only explicit `@Public()` routes bypass JWT validation.
- Valid bearer JWTs resolve a current active database user; disabled/deleted users are rejected even if their token is otherwise valid.
- No JWT holds tenant or permission authorization claims; future route services must authorize tenant access server-side and invoke RLS transaction context.
- Provider identities are unique, password hashes may be absent for Google-only users, and secrets remain out of source control.
- Database migration is generated but not applied to Neon.

## Checks To Run

- `npm.cmd run db:generate` in `server/`
- `npm.cmd test -- --runInBand` in `server/`
- focused ESLint command without `--fix`
- `npm.cmd run build` in `server/`

## Manual Testing Steps

1. On a Neon development branch, apply the reviewed migrations only after configuring `DATABASE_URL_UNPOOLED`.
2. Add a test active user with a bcrypt hash and call `POST /authentication/login`; verify an access token and safe user response.
3. Repeat with invalid email and invalid password; verify both return identical `401` responses.
4. Call `GET /authentication/me` without a bearer token; verify `401`.
5. Call it with the returned bearer token; verify the correct user profile and no password hash.
6. Mark the user inactive and repeat; verify the JWT is rejected.
7. Configure Google OAuth credentials and callback URL in a local `.env`, visit `GET /authentication/google`, complete consent, and verify a linked account/token response.
8. Use the token only as identity. For a later tenant route, verify membership is loaded server-side before `TenantTransactionService.withTenant()` sets RLS context.
