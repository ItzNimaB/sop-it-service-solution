SELECT
  `l`.`UUID` AS `UUID`,
  '' AS `Navn`,
  `loaner`.`username` AS `Laaner`,
  `personel`.`username` AS `Udlaaner`,
  `l`.`date_created` AS `Oprettet`,
  `l`.`date_updated` AS `Opdateret`,
  `l`.`date_of_return` AS `Returneret`,
  `rt`.`name` AS `Recipent`,
  concat(`l`.`loan_length`, ' dage') AS `Laanetid`,
  `l`.`date_created` + INTERVAL `l`.`loan_length` DAY AS `Returneringsdato`,
  `loaner`.`UUID` AS `user_id`
FROM
  (
    (
      (
        `sop`.`loans` `l`
        LEFT JOIN `sop`.`users` `loaner` ON(`loaner`.`UUID` = `l`.`user_id`)
      )
      LEFT JOIN `sop`.`users` `personel` ON(`personel`.`UUID` = `l`.`helpdesk_personel_id`)
    )
    LEFT JOIN `sop`.`recipient_type` `rt` ON(`rt`.`UUID` = `l`.`recipient_type_id`)
  )