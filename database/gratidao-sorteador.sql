-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema gratidao-sorteador
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `gratidao-sorteador` ;

-- -----------------------------------------------------
-- Schema gratidao-sorteador
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `gratidao-sorteador` ;
USE `gratidao-sorteador` ;

-- -----------------------------------------------------
-- Table `gratidao-sorteador`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gratidao-sorteador`.`users` ;

CREATE TABLE IF NOT EXISTS `gratidao-sorteador`.`users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `user_type` CHAR(1) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gratidao-sorteador`.`user_login_details`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gratidao-sorteador`.`user_login_details` ;

CREATE TABLE IF NOT EXISTS `gratidao-sorteador`.`user_login_details` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `token` VARCHAR(250) NULL,
  `user_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`, `user_id`),
  INDEX `fk_user_details_users_id` (`user_id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  CONSTRAINT `fk_user_details_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `gratidao-sorteador`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gratidao-sorteador`.`user_giveaway_details`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gratidao-sorteador`.`user_giveaway_details` ;

CREATE TABLE IF NOT EXISTS `gratidao-sorteador`.`user_giveaway_details` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `beginning_period` DATETIME NULL,
  `end_period` DATETIME NULL,
  `giveaway_permission` CHAR(1) NOT NULL DEFAULT 0,
  `user_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`, `user_id`),
  INDEX `fk_user_giveaway_details_users_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_user_drawing_details_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `gratidao-sorteador`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gratidao-sorteador`.`giveaways`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gratidao-sorteador`.`giveaways` ;

CREATE TABLE IF NOT EXISTS `gratidao-sorteador`.`giveaways` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `link` VARCHAR(150) NOT NULL,
  `image` VARCHAR(250) NOT NULL,
  `date` DATETIME NOT NULL DEFAULT NOW(),
  `status` CHAR(1) NOT NULL DEFAULT 'P',
  `winner_ig` VARCHAR(100) NULL,
  `comment_count` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`, `user_id`),
  INDEX `fk_drawnings_users1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_drawnings_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `gratidao-sorteador`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gratidao-sorteador`.`occurrences`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `gratidao-sorteador`.`occurrences` ;

CREATE TABLE IF NOT EXISTS `gratidao-sorteador`.`occurrences` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `description` TINYTEXT NOT NULL,
  `occurrence_date` DATETIME NOT NULL DEFAULT NOW(),
  `user_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`, `user_id`),
  INDEX `fk_occurrences_users1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_occurrences_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `gratidao-sorteador`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
