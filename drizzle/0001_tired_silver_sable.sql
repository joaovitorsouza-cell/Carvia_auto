CREATE TABLE `catalog_products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`brand` text NOT NULL,
	`code` text NOT NULL,
	`category` text NOT NULL,
	`price` integer NOT NULL,
	`stock` integer NOT NULL,
	`kind` text NOT NULL,
	`description` text NOT NULL,
	`image_url` text DEFAULT '' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `catalog_products_code_unique` ON `catalog_products` (`code`);--> statement-breakpoint
CREATE TABLE `staff` (
	`email` text PRIMARY KEY NOT NULL,
	`role` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `store_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
