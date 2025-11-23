CREATE TABLE "admin_users" (
	"id" text NOT NULL,
	"name" text NOT NULL,
	"email" text PRIMARY KEY NOT NULL,
	"role" text NOT NULL,
	"status" text NOT NULL,
	"last_login" text,
	"mfa_enabled" text NOT NULL,
	"login_count" text NOT NULL,
	"blocked" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" text NOT NULL,
	"event" text NOT NULL,
	"user" text NOT NULL,
	"status" text NOT NULL,
	"ip" text NOT NULL,
	"details" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"cover_image" text,
	"author" text NOT NULL,
	"read_time" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "network_alerts" (
	"id" text PRIMARY KEY NOT NULL,
	"timestamp" text NOT NULL,
	"type" text NOT NULL,
	"severity" text NOT NULL,
	"source" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"cover_image" text,
	"github_url" text,
	"live_url" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vulnerabilities" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"severity" text NOT NULL,
	"category" text NOT NULL,
	"status" text NOT NULL,
	"discovered" text NOT NULL,
	"cve" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
