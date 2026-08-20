# Credential Registration Implementation Prompt

## Goal

Add a secure public credential-registration endpoint to the NestJS authentication module. It creates a platform identity only and returns the same JWT response as login. Tenant provisioning, tenant membership, roles, licenses, and business-data access remain separate, privileged onboarding actions.

## Skills Read

- `AGENTS.md`
- Existing Drizzle/Neon database foundation and generated migrations

## Existing Code Inspected

- `server/src/authentication/authentication.controller.ts` exposes public credential login and Google OAuth plus protected identity endpoints.
- `server/src/authentication/authentication.service.ts` validates bcrypt credential users, issues JWTs, and handles Google identities.
- `server/src/database/schema/index.ts` has globally unique user emails and a nullable password hash for Google-only accounts.
- The authentication migration is generated but has not been applied to Neon.

## Architecture Decisions

- Add `POST /auth/register` as a public route, following the existing controller prefix.
- Request body: `email`, `password`, `firstName`, `lastName`, optional `phone`.
- Normalize email server-side, bcrypt-hash the password using a fixed secure cost factor, create an active non-platform-admin `users` record, and create a `credentials` `user_auth_accounts` identity in one database transaction.
- Return `{ accessToken, tokenType: 'Bearer', user }`, reusing the existing token response shape.
- Do not accept or create tenant IDs, roles, permissions, platform-admin flags, licenses, or company records. Registration is not tenant onboarding and must not set RLS tenant context.
- Return a safe `409 Conflict` for an existing email without exposing password/account provider details.

## Database Changes

None. Reuse the existing `users` and `user_auth_accounts` schema/migration. Registration will become usable after the pending Drizzle migrations are applied to a Neon development branch.

## Security Requirements

- Validate DTO fields, trim/normalize names and email, and enforce a password length of 12–128 characters.
- Do not log passwords or hashes. Never return hashes.
- Make duplicate-email handling safe and deterministic; translate a database unique-constraint conflict to `409`.
- Use a transaction to prevent a user record without its credentials provider account.

## Files Likely To Change

- `server/src/authentication/dto/register.dto.ts`
- `server/src/authentication/authentication.controller.ts`
- `server/src/authentication/authentication.service.ts`
- focused authentication tests

## Implementation Plan

1. Add the registration DTO and public controller route.
2. Add transactional account creation and safe duplicate handling to the authentication service.
3. Extend tests for successful registration and duplicate rejection.
4. Run formatting, focused lint, tests, and the NestJS build.

## Acceptance Criteria

- A valid registration creates a bcrypt-backed credential account and returns a JWT/safe profile.
- Duplicate normalized emails return `409`.
- No client-provided tenant, role, or admin privileges influence the created user.
- All existing login, JWT protection, and Google authentication code continues to build and test.

## Checks To Run

- focused ESLint without automatic fixing
- `npm.cmd test -- --runInBand` in `server/`
- `npm.cmd run build` in `server/`

## Manual Testing Steps

1. Apply the reviewed database migrations to a Neon development branch.
2. `POST /auth/register` with valid identity fields and a 12+ character password; verify a bearer token and safe user response.
3. Log in using the same credentials at `POST /auth/login`.
4. Register the same email with different casing; verify `409 Conflict`.
5. Attempt to submit `tenantId`, `role`, or `isPlatformAdmin`; verify validation rejects the request.
