CREATE TYPE "public"."auth_provider" AS ENUM('credentials', 'google');--> statement-breakpoint
CREATE TABLE "user_auth_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" "auth_provider" NOT NULL,
	"provider_account_id" varchar(320) NOT NULL,
	"provider_email" varchar(320),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_auth_accounts_provider_account_unique" UNIQUE("provider","provider_account_id"),
	CONSTRAINT "user_auth_accounts_user_provider_unique" UNIQUE("user_id","provider")
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_auth_accounts" ADD CONSTRAINT "user_auth_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_auth_accounts_user_idx" ON "user_auth_accounts" USING btree ("user_id");