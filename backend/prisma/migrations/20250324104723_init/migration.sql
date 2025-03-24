-- CreateTable
CREATE TABLE `brands` (
    `UUID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buildings` (
    `UUID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,

    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `UUID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items` (
    `UUID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `date_created` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `date_updated` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `storage_location_id` INTEGER UNSIGNED NULL,
    `product_status_id` INTEGER UNSIGNED NULL,
    `product_id` INTEGER UNSIGNED NOT NULL,
    `description` LONGTEXT NULL,
    `barcode_number` INTEGER NULL,

    INDEX `items_ibfk_1`(`storage_location_id`),
    INDEX `product_id`(`product_id`),
    INDEX `product_status_id`(`product_status_id`),
    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items_in_loan` (
    `UUID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `loan_id` INTEGER UNSIGNED NOT NULL,
    `item_id` INTEGER UNSIGNED NOT NULL,
    `date_created` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `date_returned` DATETIME(0) NULL,
    `withBag` BOOLEAN NOT NULL DEFAULT false,
    `withLock` BOOLEAN NOT NULL DEFAULT false,

    INDEX `item_id`(`item_id`),
    INDEX `item_loan_id_fk_idx`(`loan_id`),
    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loans` (
    `UUID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `date_created` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `date_updated` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `date_of_return` DATETIME(0) NULL,
    `location_of_use_id` INTEGER UNSIGNED NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `helpdesk_personel_id` INTEGER UNSIGNED NULL,
    `selfservice_case_id` INTEGER UNSIGNED NULL,
    `recipient_type_id` INTEGER UNSIGNED NULL,
    `loan_length` INTEGER NULL,
    `mail_sent` BOOLEAN NOT NULL DEFAULT false,

    INDEX `helpdesk_personel_id`(`helpdesk_personel_id`),
    INDEX `location_of_use_id`(`location_of_use_id`),
    INDEX `recipient_type_id`(`recipient_type_id`),
    INDEX `selfservice_case_id`(`selfservice_case_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pickup_locations` (
    `UUID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_status` (
    `UUID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `UUID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `brand_id` INTEGER UNSIGNED NOT NULL,
    `category_id` INTEGER UNSIGNED NOT NULL,
    `date_created` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `date_updated` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `product_id_prefix` VARCHAR(50) NULL,
    `image_name` VARCHAR(50) NULL,

    INDEX `brand_id`(`brand_id`),
    INDEX `products_ibfk_2`(`category_id`),
    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipient_type` (
    `UUID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `selfservice_case` (
    `UUID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `delivery_location_id` INTEGER UNSIGNED NULL,
    `pickup_location_id` INTEGER UNSIGNED NULL,
    `distribution_date` DATETIME(0) NOT NULL,
    `estimated_time_consumption` DATETIME(0) NULL,

    INDEX `delivery_location_id`(`delivery_location_id`),
    INDEX `pickup_location_id`(`pickup_location_id`),
    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `storage_locations` (
    `UUID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `zone_id` INTEGER NOT NULL,
    `kabinet` VARCHAR(255) NULL,
    `shelf` VARCHAR(255) NULL,
    `idle_since` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `img_name` VARCHAR(255) NULL,
    `date_updated` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `zone_id`(`zone_id`),
    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `UUID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `date_created` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `date_updated` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `zones` (
    `UUID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `building_id` INTEGER NOT NULL,
    `floor_level` INTEGER NOT NULL,

    INDEX `building_id`(`building_id`),
    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedback` (
    `UUID` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(127) NOT NULL,
    `description` TEXT NOT NULL,
    `date_created` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`UUID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `product_status_id_fk` FOREIGN KEY (`product_status_id`) REFERENCES `product_status`(`UUID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `storage_location_id_fk` FOREIGN KEY (`storage_location_id`) REFERENCES `storage_locations`(`UUID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `items_in_loan` ADD CONSTRAINT `item_id_fk` FOREIGN KEY (`item_id`) REFERENCES `items`(`UUID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `items_in_loan` ADD CONSTRAINT `loan_id_fk` FOREIGN KEY (`loan_id`) REFERENCES `loans`(`UUID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `loans` ADD CONSTRAINT `helpdesk_personel_id_fk` FOREIGN KEY (`helpdesk_personel_id`) REFERENCES `users`(`UUID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `loans` ADD CONSTRAINT `location_of_use_id_fk` FOREIGN KEY (`location_of_use_id`) REFERENCES `zones`(`UUID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `loans` ADD CONSTRAINT `recipient_type_id_fk` FOREIGN KEY (`recipient_type_id`) REFERENCES `recipient_type`(`UUID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `loans` ADD CONSTRAINT `selfservice_case_id_fk` FOREIGN KEY (`selfservice_case_id`) REFERENCES `selfservice_case`(`UUID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `loans` ADD CONSTRAINT `user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`UUID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `product_category_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`UUID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_brands_fk` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`UUID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `zones` ADD CONSTRAINT `buildings_fk` FOREIGN KEY (`building_id`) REFERENCES `buildings`(`UUID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
