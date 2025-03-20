SELECT
  `iil`.`UUID` AS `UUID`,
  `p`.`name` AS `Produkt`,
  `iil`.`date_returned` AS `Returneret`,
  `iil`.`date_created` + INTERVAL `l`.`loan_length` DAY AS `Returneringsdato`,
  `iil`.`item_id` AS `item_id`,
  `u`.`UUID` AS `user_id`
FROM
  (
    (
      (
        (
          `sop`.`items_in_loan` `iil`
          JOIN `sop`.`items` `i` ON(`i`.`UUID` = `iil`.`item_id`)
        )
        JOIN `sop`.`loans` `l` ON(`l`.`UUID` = `iil`.`loan_id`)
      )
      JOIN `sop`.`users` `u` ON(`u`.`UUID` = `l`.`user_id`)
    )
    JOIN `sop`.`products` `p` ON(`p`.`UUID` = `i`.`product_id`)
  )