CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`companyName` varchar(255),
	`serviceType` varchar(100) NOT NULL,
	`projectDescription` text NOT NULL,
	`budgetRange` varchar(100),
	`status` enum('new','contacted','in_progress','completed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portfolioItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`industry` varchar(100),
	`imageUrl` text,
	`beforeImageUrl` text,
	`afterImageUrl` text,
	`clientName` varchar(255),
	`results` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `portfolioItems_id` PRIMARY KEY(`id`)
);
