CREATE TYPE "public"."categories" AS ENUM('landscape', 'human', 'animal', 'car', 'undefined');--> statement-breakpoint
CREATE TABLE "images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text DEFAULT (auth.user_id()) NOT NULL,
	"url" text NOT NULL,
	"category" "categories" NOT NULL,
	"correct_category" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "images_url_unique" UNIQUE("url")
);
--> statement-breakpoint
ALTER TABLE "images" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "images" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "images" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "images"."userId"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "images" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "images"."userId")) WITH CHECK ((select auth.user_id() = "images"."userId"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "images" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "images"."userId"));