CREATE TABLE `stories`
(
    `id`          int(11)                           NOT NULL AUTO_INCREMENT,
    `date`        datetime                          NOT NULL,
    `title`       varchar(1024) COLLATE utf8mb4_bin NOT NULL,
    `name`        varchar(512) COLLATE utf8mb4_bin DEFAULT NULL,
    `description` text COLLATE utf8mb4_bin,
    `category`    varchar(512) COLLATE utf8mb4_bin  NOT NULL,
    `city`        varchar(512) COLLATE utf8mb4_bin  NOT NULL,
    `shift`       varchar(512) COLLATE utf8mb4_bin  NOT NULL,
    `duration`    varchar(32) COLLATE utf8mb4_bin   NOT NULL,
    `url`         varchar(2048) COLLATE utf8mb4_bin NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;