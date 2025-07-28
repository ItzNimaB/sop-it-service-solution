/*
  Warnings:

  - You are about to drop the `brands` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `buildings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `items_in_loan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `loans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pickup_locations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_status` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipient_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `selfservice_case` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `storage_locations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `zones` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `items` DROP FOREIGN KEY `product_id_fk`;

-- DropForeignKey
ALTER TABLE `items` DROP FOREIGN KEY `product_status_id_fk`;

-- DropForeignKey
ALTER TABLE `items` DROP FOREIGN KEY `storage_location_id_fk`;

-- DropForeignKey
ALTER TABLE `items_in_loan` DROP FOREIGN KEY `item_id_fk`;

-- DropForeignKey
ALTER TABLE `items_in_loan` DROP FOREIGN KEY `loan_id_fk`;

-- DropForeignKey
ALTER TABLE `loans` DROP FOREIGN KEY `helpdesk_personel_id_fk`;

-- DropForeignKey
ALTER TABLE `loans` DROP FOREIGN KEY `location_of_use_id_fk`;

-- DropForeignKey
ALTER TABLE `loans` DROP FOREIGN KEY `recipient_type_id_fk`;

-- DropForeignKey
ALTER TABLE `loans` DROP FOREIGN KEY `selfservice_case_id_fk`;

-- DropForeignKey
ALTER TABLE `loans` DROP FOREIGN KEY `user_id_fk`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `product_category_fk`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_brands_fk`;

-- DropForeignKey
ALTER TABLE `zones` DROP FOREIGN KEY `buildings_fk`;

-- DropTable
DROP TABLE `brands`;

-- DropTable
DROP TABLE `buildings`;

-- DropTable
DROP TABLE `categories`;

-- DropTable
DROP TABLE `feedback`;

-- DropTable
DROP TABLE `items`;

-- DropTable
DROP TABLE `items_in_loan`;

-- DropTable
DROP TABLE `loans`;

-- DropTable
DROP TABLE `pickup_locations`;

-- DropTable
DROP TABLE `product_status`;

-- DropTable
DROP TABLE `products`;

-- DropTable
DROP TABLE `recipient_type`;

-- DropTable
DROP TABLE `selfservice_case`;

-- DropTable
DROP TABLE `storage_locations`;

-- DropTable
DROP TABLE `users`;

-- DropTable
DROP TABLE `zones`;

-- CreateTable
CREATE TABLE `Brand` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(0) NULL,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Building` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(0) NULL,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(0) NULL,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(0) NULL,
    `storage_location_id` INTEGER NULL,
    `product_status_id` INTEGER NULL,
    `product_id` INTEGER NOT NULL,
    `description` LONGTEXT NULL,
    `barcode_number` INTEGER NULL,

    INDEX `items_ibfk_1`(`storage_location_id`),
    INDEX `product_id`(`product_id`),
    INDEX `product_status_id`(`product_status_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemInLoan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(0) NULL,
    `returned_at` DATETIME(0) NULL,
    `loan_id` INTEGER NOT NULL,
    `item_id` INTEGER NOT NULL,
    `with_bag` BOOLEAN NOT NULL DEFAULT false,
    `with_lock` BOOLEAN NOT NULL DEFAULT false,

    INDEX `item_id`(`item_id`),
    INDEX `item_loan_id_fk_idx`(`loan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Loan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(0) NULL,
    `date_of_return` DATETIME(0) NULL,
    `location_of_use_id` INTEGER NULL,
    `user_id` INTEGER NOT NULL,
    `helpdesk_personel_id` INTEGER NULL,
    `selfservice_case_id` INTEGER NULL,
    `recipient_type_id` INTEGER NULL,
    `loan_length` INTEGER NULL,
    `mail_sent` BOOLEAN NOT NULL DEFAULT false,

    INDEX `helpdesk_personel_id`(`helpdesk_personel_id`),
    INDEX `location_of_use_id`(`location_of_use_id`),
    INDEX `recipient_type_id`(`recipient_type_id`),
    INDEX `selfservice_case_id`(`selfservice_case_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PickupLocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(0) NULL,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(0) NULL,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(0) NULL,
    `name` VARCHAR(255) NOT NULL,
    `brand_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,
    `product_id_prefix` VARCHAR(50) NULL,
    `image_name` VARCHAR(50) NULL,

    INDEX `brand_id`(`brand_id`),
    INDEX `products_ibfk_2`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecipientType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(0) NULL,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StorageLocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(0) NULL,
    `zone_id` INTEGER NOT NULL,
    `kabinet` VARCHAR(255) NULL,
    `shelf` VARCHAR(255) NULL,
    `idle_since` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `img_name` VARCHAR(255) NULL,

    INDEX `zone_id`(`zone_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(0) NULL,
    `username` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Zone` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(0) NULL,
    `name` VARCHAR(255) NOT NULL,
    `building_id` INTEGER NOT NULL,
    `floor_level` INTEGER NOT NULL,

    INDEX `building_id`(`building_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feedback` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(0) NULL,
    `title` VARCHAR(127) NOT NULL,
    `description` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `product_status_id_fk` FOREIGN KEY (`product_status_id`) REFERENCES `ProductStatus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `storage_location_id_fk` FOREIGN KEY (`storage_location_id`) REFERENCES `StorageLocation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemInLoan` ADD CONSTRAINT `item_id_fk` FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemInLoan` ADD CONSTRAINT `loan_id_fk` FOREIGN KEY (`loan_id`) REFERENCES `Loan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `helpdesk_personel_id_fk` FOREIGN KEY (`helpdesk_personel_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `location_of_use_id_fk` FOREIGN KEY (`location_of_use_id`) REFERENCES `Zone`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `recipient_type_id_fk` FOREIGN KEY (`recipient_type_id`) REFERENCES `RecipientType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `product_category_fk` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `products_brands_fk` FOREIGN KEY (`brand_id`) REFERENCES `Brand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Zone` ADD CONSTRAINT `buildings_fk` FOREIGN KEY (`building_id`) REFERENCES `Building`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
