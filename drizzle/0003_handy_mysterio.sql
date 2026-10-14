CREATE TABLE `stock_movements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` text NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`delta` integer NOT NULL,
	`balance` integer NOT NULL,
	`reason` text NOT NULL,
	`actor` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `catalog_products` ADD `manufacturer_code` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `catalog_products` ADD `images` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `catalog_products` ADD `vehicles` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `catalog_products` ADD `min_stock` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `catalog_products` ADD `revision` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `catalog_products` ADD `stock_reason` text DEFAULT 'Cadastro' NOT NULL;--> statement-breakpoint
ALTER TABLE `catalog_products` ADD `stock_actor` text DEFAULT '' NOT NULL;--> statement-breakpoint
UPDATE catalog_products SET images = json_array(image_url) WHERE image_url <> '';
--> statement-breakpoint
INSERT INTO stock_movements (product_id,code,name,delta,balance,reason,actor,created_at)
SELECT id,code,name,stock,stock,'Saldo anterior ao histórico','Sistema',strftime('%Y-%m-%dT%H:%M:%fZ','now') FROM catalog_products;
--> statement-breakpoint
CREATE TRIGGER product_stock_insert AFTER INSERT ON catalog_products BEGIN
 INSERT INTO stock_movements(product_id,code,name,delta,balance,reason,actor,created_at) VALUES(NEW.id,NEW.code,NEW.name,NEW.stock,NEW.stock,NEW.stock_reason,NEW.stock_actor,strftime('%Y-%m-%dT%H:%M:%fZ','now'));
END;
--> statement-breakpoint
CREATE TRIGGER product_stock_update AFTER UPDATE OF stock ON catalog_products WHEN OLD.stock <> NEW.stock BEGIN
 INSERT INTO stock_movements(product_id,code,name,delta,balance,reason,actor,created_at) VALUES(NEW.id,NEW.code,NEW.name,NEW.stock-OLD.stock,NEW.stock,NEW.stock_reason,NEW.stock_actor,strftime('%Y-%m-%dT%H:%M:%fZ','now'));
END;
