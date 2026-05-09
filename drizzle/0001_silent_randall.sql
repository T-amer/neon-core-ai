CREATE TABLE `boilerplates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`niche` varchar(255) NOT NULL,
	`projectName` varchar(255) NOT NULL,
	`description` text,
	`directoryStructure` text,
	`filesJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `boilerplates_id` PRIMARY KEY(`id`)
);
