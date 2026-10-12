CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`items` text NOT NULL,
	`total` integer NOT NULL,
	`status` text NOT NULL,
	`preference_id` text,
	`created_at` text NOT NULL
);
