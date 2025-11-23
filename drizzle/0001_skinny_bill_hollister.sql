CREATE TABLE "blocked_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"blocked_by" text NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "blocked_users_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'admin_users'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "admin_users" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "admin_users" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "admin_users" DROP COLUMN "blocked";