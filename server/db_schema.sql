-- MySQL dump 10.13  Distrib 5.7.20, for Linux (x86_64)
--
-- Host: localhost    Database: snapchat
-- ------------------------------------------------------
-- Server version       5.7.20-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


--
-- Table structure for table `lenses`
--

DROP TABLE IF EXISTS `lenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lenses` (
  `unlockable_id` bigint(20) NOT NULL DEFAULT '0',
  `snapcode_url` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_display_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `lens_name` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lens_status` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `deeplink` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `icon_url` varchar(150) COLLATE utf8_unicode_ci DEFAULT NULL,
  `thumbnail_media_url` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL,
  `standard_media_url` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `obfuscated_user_slug` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL,
  `image_sequence` json DEFAULT NULL,
  `thumbnail_media_poster_url` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL,
  `standard_media_poster_url` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`unlockable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `unlocks`
--

DROP TABLE IF EXISTS `unlocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `unlocks` (
  `lens_id` bigint(20) NOT NULL DEFAULT '0',
  `lens_url` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL,
  `signature` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL,
  `hint_id` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `additional_hint_ids` json DEFAULT NULL,
  `mirrored` int(11) DEFAULT '0',
  PRIMARY KEY (`lens_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-01-19 17:30:10