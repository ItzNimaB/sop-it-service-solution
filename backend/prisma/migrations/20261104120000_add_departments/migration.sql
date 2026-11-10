-- CreateTable
CREATE TABLE `departments` (
    `UUID` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `items` ADD COLUMN `department_id` INTEGER UNSIGNED NULL;

-- CreateIndex
CREATE INDEX `department_id` ON `items`(`department_id`);

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `department_id_fk` FOREIGN KEY (`department_id`) REFERENCES `departments`(`UUID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Views
CREATE OR REPLACE VIEW `departments_view` AS
SELECT
  `sop`.`departments`.`UUID` AS `UUID`,
  `sop`.`departments`.`name` AS `Navn`
FROM
  `sop`.`departments`;

CREATE OR REPLACE VIEW `items_view` AS
SELECT
  `i`.`UUID` AS `UUID`,
  `p`.`name` AS `Navn`,
  concat(
    `p`.`product_id_prefix`,
    lpad(`i`.`barcode_number`, 4, '0')
  ) AS `Stregkode`,
  `ps`.`name` AS `Status`,
  `d`.`name` AS `Afdeling`,
  `i`.`description` AS `Kommentar`,
  `i`.`date_created` AS `Oprettet`,
  `i`.`date_updated` AS `Opdateret`
FROM
  (
    (
      (
        `sop`.`items` `i`
        LEFT JOIN `sop`.`products` `p` ON(`i`.`product_id` = `p`.`UUID`)
      )
      LEFT JOIN `sop`.`product_status` `ps` ON(`i`.`product_status_id` = `ps`.`UUID`)
    )
    LEFT JOIN `sop`.`departments` `d` ON(`i`.`department_id` = `d`.`UUID`)
  );
