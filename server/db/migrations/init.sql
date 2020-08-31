CREATE TABLE `stories`
(
    `id`          int(11)                           NOT NULL AUTO_INCREMENT,
    `date`        datetime                          NOT NULL,
    `title`       varchar(1024) COLLATE utf8mb4_bin NOT NULL,
    `name`        varchar(512) COLLATE utf8mb4_bin           DEFAULT NULL,
    `description` text COLLATE utf8mb4_bin,
    `category`    varchar(512) COLLATE utf8mb4_bin  NOT NULL,
    `city`        varchar(512) COLLATE utf8mb4_bin  NOT NULL,
    `shift`       varchar(512) COLLATE utf8mb4_bin  NOT NULL,
    `duration`    varchar(32) COLLATE utf8mb4_bin   NOT NULL,
    `url`         varchar(2048) COLLATE utf8mb4_bin NOT NULL,
    `approved`    tinyint(1)                        NOT NULL DEFAULT '0',
    `session_id`  varchar(64) COLLATE utf8mb4_bin   NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 18
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

CREATE TABLE `story_hearts`
(
    `id`         int(11)                         NOT NULL AUTO_INCREMENT,
    `story_id`   int(11)                         NOT NULL,
    `datetime`   datetime                        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `session_id` varchar(64) COLLATE utf8mb4_bin NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `story_id_session_id` (`story_id`, `session_id`),
    CONSTRAINT `story_hearts_ibfk_1` FOREIGN KEY (`story_id`) REFERENCES `stories` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

CREATE TABLE `story_comments`
(
    `id`         int(11)                         NOT NULL AUTO_INCREMENT,
    `story_id`   int(11)                         NOT NULL,
    `datetime`   datetime                        NOT NULL,
    `session_id` varchar(64) COLLATE utf8mb4_bin NOT NULL,
    `comment`    text COLLATE utf8mb4_bin        NOT NULL,
    PRIMARY KEY (`id`),
    KEY `story_id` (`story_id`),
    CONSTRAINT `story_comments_ibfk_1` FOREIGN KEY (`story_id`) REFERENCES `stories` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 3
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin