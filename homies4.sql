-- MySQL dump 10.13  Distrib 8.0.29, for macos12 (arm64)
--
-- Host: localhost    Database: homies
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account_types`
--

DROP TABLE IF EXISTS `account_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_types` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` mediumtext NOT NULL,
  `replaced_record` char(36) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `replaced_record` (`replaced_record`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `account_types_ibfk_1` FOREIGN KEY (`replaced_record`) REFERENCES `account_types` (`id`),
  CONSTRAINT `account_types_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `account_types_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_types`
--

LOCK TABLES `account_types` WRITE;
/*!40000 ALTER TABLE `account_types` DISABLE KEYS */;
INSERT INTO `account_types` VALUES ('00827961-53a8-4825-ae4a-8639ab34ad9b','Contra Asset','6000','',NULL,'Active','2022-03-22 17:44:06','2022-08-31 06:03:25','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('215320f4-8753-48f4-894f-0ba0798a8e8b','Liability','2000','',NULL,'Active','2022-03-22 17:42:55','2022-08-31 06:03:25','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('5bbe6492-bb3f-4991-819e-3e0d9c6b3932','Equity','3000','',NULL,'Active','2022-03-22 17:43:04','2022-08-31 06:03:25','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','Expense','5000','',NULL,'Active','2022-03-22 17:43:49','2022-08-31 06:03:25','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('917824d2-7713-45b0-8988-0ad18af2fbcb','Asset','1000','',NULL,'Active','2022-03-22 17:42:34','2022-08-31 06:03:25','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('e7db9b47-a012-42d7-a1ba-71122ff63bec','Revenue','4000','',NULL,'Active','2022-03-22 17:43:31','2022-08-31 06:03:25','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL);
/*!40000 ALTER TABLE `account_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_accounts_receivable_ledgers`
--

DROP TABLE IF EXISTS `ar_accounts_receivable_ledgers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_accounts_receivable_ledgers` (
  `id` char(36) NOT NULL,
  `inpatient_bill_id` char(36) NOT NULL,
  `inpatient_payment_id` varchar(36) NOT NULL,
  `amount_outstanding` float NOT NULL DEFAULT '0',
  `days_overdue` decimal(10,0) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `inpatient_bill_id` (`inpatient_bill_id`),
  KEY `inpatient_payment_id` (`inpatient_payment_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_accounts_receivable_ledgers`
--

LOCK TABLES `ar_accounts_receivable_ledgers` WRITE;
/*!40000 ALTER TABLE `ar_accounts_receivable_ledgers` DISABLE KEYS */;
/*!40000 ALTER TABLE `ar_accounts_receivable_ledgers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_discharge_management`
--

DROP TABLE IF EXISTS `ar_discharge_management`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_discharge_management` (
  `discharge_id` varchar(255) NOT NULL,
  `discharge_no` varchar(255) NOT NULL,
  `patient_id` varchar(255) DEFAULT NULL,
  `admission_id` varchar(255) DEFAULT NULL,
  `reason_of_admittance` varchar(255) NOT NULL,
  `diagnosis_at_admittance` varchar(255) NOT NULL,
  `date_admitted` datetime DEFAULT NULL,
  `treatment_summary` varchar(255) NOT NULL,
  `discharge_date` datetime DEFAULT NULL,
  `physician_approved` varchar(255) NOT NULL,
  `discharge_diagnosis` varchar(255) NOT NULL,
  `further_treatment_plan` varchar(255) NOT NULL,
  `next_check_up_date` date DEFAULT NULL,
  `client_consent_approval` varchar(255) NOT NULL,
  `active_status` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`discharge_id`),
  KEY `admission_id` (`admission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_discharge_management`
--

LOCK TABLES `ar_discharge_management` WRITE;
/*!40000 ALTER TABLE `ar_discharge_management` DISABLE KEYS */;
INSERT INTO `ar_discharge_management` VALUES ('eccd0945-e2f4-4299-90d8-e37d99f2118f','DSCHRG7677-20220305','7c25893d-4ee3-4fd6-8ddd-deddaef4e192','98e2745d-4145-4714-97cf-4202c1d20a28','checkup','cold','2022-03-05 16:10:00','medicine intake','2022-03-05 08:08:39','approved','complete','none','2022-03-05','approbe',NULL,'2022-03-05 08:08:39',NULL);
/*!40000 ALTER TABLE `ar_discharge_management` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_discount_privillages`
--

DROP TABLE IF EXISTS `ar_discount_privillages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_discount_privillages` (
  `dp_id` varchar(36) NOT NULL,
  `ph_id` varchar(255) DEFAULT NULL,
  `end_of_validity` varchar(255) DEFAULT NULL,
  `sc_id` varchar(255) DEFAULT NULL,
  `municipality` varchar(255) DEFAULT NULL,
  `pwd_id` varchar(255) DEFAULT NULL,
  `type_of_disability` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`dp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_discount_privillages`
--

LOCK TABLES `ar_discount_privillages` WRITE;
/*!40000 ALTER TABLE `ar_discount_privillages` DISABLE KEYS */;
INSERT INTO `ar_discount_privillages` VALUES ('40f7697b-4d46-4be9-a7e7-b925266609f5','09567','2055-10-10','182649','ncr','1098','down syndrome','2022-03-05 07:36:56',NULL);
/*!40000 ALTER TABLE `ar_discount_privillages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_doctor_fee_bill`
--

DROP TABLE IF EXISTS `ar_doctor_fee_bill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_doctor_fee_bill` (
  `id` char(36) NOT NULL,
  `invoice_no` varchar(100) DEFAULT NULL,
  `invoice_date` datetime NOT NULL,
  `inpatient_bill_id` varchar(36) DEFAULT NULL,
  `doctor_id` varchar(36) NOT NULL,
  `actual_pf` float NOT NULL,
  `sc_pwd_discount` float DEFAULT NULL,
  `philhealth` float DEFAULT NULL,
  `discount` float DEFAULT NULL,
  `hmo` float DEFAULT NULL,
  `patient_due` float NOT NULL,
  `status` varchar(100) DEFAULT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_no` (`invoice_no`),
  KEY `inpatient_bill_id` (`inpatient_bill_id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `ix_doctor_fee_bill_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_doctor_fee_bill`
--

LOCK TABLES `ar_doctor_fee_bill` WRITE;
/*!40000 ALTER TABLE `ar_doctor_fee_bill` DISABLE KEYS */;
/*!40000 ALTER TABLE `ar_doctor_fee_bill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_doctor_profile`
--

DROP TABLE IF EXISTS `ar_doctor_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_doctor_profile` (
  `doctor_id` char(36) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `label` varchar(5) NOT NULL,
  `doctor_first_name` varchar(255) NOT NULL,
  `doctor_middle_name` varchar(255) DEFAULT NULL,
  `doctor_last_name` varchar(255) NOT NULL,
  `doctor_home_address` varchar(255) DEFAULT NULL,
  `doctor_location` varchar(255) DEFAULT NULL,
  `doctor_mobile` varchar(255) DEFAULT NULL,
  `doctor_schedule` varchar(255) DEFAULT NULL,
  `specialization_id` char(36) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`doctor_id`),
  KEY `specialization_id` (`specialization_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_doctor_profile`
--

LOCK TABLES `ar_doctor_profile` WRITE;
/*!40000 ALTER TABLE `ar_doctor_profile` DISABLE KEYS */;
INSERT INTO `ar_doctor_profile` VALUES ('2e5e52f7-9e2e-46e1-8197-847aeb466acd','asd','Dr.','name','middle','last','home','Quezon City','09123456789','Monday toFriday','95728eb1-4ef2-446f-b063-dd23efbadc40','Active','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 15:16:40',NULL,'2022-03-05 15:16:40');
/*!40000 ALTER TABLE `ar_doctor_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_employees`
--

DROP TABLE IF EXISTS `ar_employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_employees` (
  `id` char(36) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `extension_name` varchar(255) DEFAULT NULL,
  `birthdate` date NOT NULL,
  `birthplace` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `civil_status` varchar(255) NOT NULL,
  `house_number` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `barangay` varchar(255) DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `contact_number` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `job` varchar(255) NOT NULL,
  `hire_date` date NOT NULL,
  `manager` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_employees`
--

LOCK TABLES `ar_employees` WRITE;
/*!40000 ALTER TABLE `ar_employees` DISABLE KEYS */;
INSERT INTO `ar_employees` VALUES ('85dd4c11-0417-4637-8e7e-a1f129d88c34','image-upload/Pink Purple Gradients Modern Aesthetic Retro Windows Computer Ice Cream Discount Poster.png','Michael','Jude','Culile',NULL,'1999-01-12','Pasay City','Male','Single','26','Sampaguita','San Jose','RIzal','Rizal','Philippines','09235250625','Jude@gmail.com','IT','Accountant','2022-02-05','Julie','Inactive',NULL,'2022-03-04 23:46:54','65501c6d-fad9-4401-9ff6-18a7b1626cea','2022-08-31 20:12:36');
/*!40000 ALTER TABLE `ar_employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_hospital_charges_bill`
--

DROP TABLE IF EXISTS `ar_hospital_charges_bill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_hospital_charges_bill` (
  `id` char(36) NOT NULL,
  `invoice_no` varchar(100) DEFAULT NULL,
  `invoice_date` datetime NOT NULL,
  `inpatient_bill_id` varchar(36) DEFAULT NULL,
  `hospital_services_id` varchar(36) NOT NULL,
  `total_amount` float NOT NULL,
  `cancellation_return` float DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_hospital_charges_bill`
--

LOCK TABLES `ar_hospital_charges_bill` WRITE;
/*!40000 ALTER TABLE `ar_hospital_charges_bill` DISABLE KEYS */;
/*!40000 ALTER TABLE `ar_hospital_charges_bill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_hospital_service_name`
--

DROP TABLE IF EXISTS `ar_hospital_service_name`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_hospital_service_name` (
  `id` varchar(36) NOT NULL,
  `description_name` varchar(255) NOT NULL,
  `unit_price` float NOT NULL,
  `status` varchar(100) DEFAULT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_hospital_service_name`
--

LOCK TABLES `ar_hospital_service_name` WRITE;
/*!40000 ALTER TABLE `ar_hospital_service_name` DISABLE KEYS */;
/*!40000 ALTER TABLE `ar_hospital_service_name` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_hospital_services`
--

DROP TABLE IF EXISTS `ar_hospital_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_hospital_services` (
  `id` varchar(36) NOT NULL,
  `admission_id` varchar(36) NOT NULL,
  `hospital_service_name_id` varchar(36) NOT NULL,
  `quantity` float NOT NULL,
  `date` date NOT NULL,
  `total_amount` float NOT NULL,
  `status` varchar(100) NOT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_hospital_services`
--

LOCK TABLES `ar_hospital_services` WRITE;
/*!40000 ALTER TABLE `ar_hospital_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `ar_hospital_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_inpatient_bills`
--

DROP TABLE IF EXISTS `ar_inpatient_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_inpatient_bills` (
  `id` char(36) NOT NULL,
  `inpatient_bill_no` varchar(255) NOT NULL,
  `admission_id` varchar(36) NOT NULL,
  `inpatient_payment_id` varchar(36) DEFAULT NULL,
  `date_of_billing` date NOT NULL,
  `due_date` date NOT NULL,
  `balance_due` float NOT NULL DEFAULT '0',
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_inpatient_bills`
--

LOCK TABLES `ar_inpatient_bills` WRITE;
/*!40000 ALTER TABLE `ar_inpatient_bills` DISABLE KEYS */;
INSERT INTO `ar_inpatient_bills` VALUES ('2679ddd1-1330-411c-bcaf-8d3f7410126a','SOA255f20220305','98e2745d-4145-4714-97cf-4202c1d20a28',NULL,'2022-03-05','2022-03-05',21039,'Pending',NULL,'2022-03-05 15:43:18','752c703a-3ecf-4d57-925c-14774bdeace9','2022-08-02 19:09:31');
/*!40000 ALTER TABLE `ar_inpatient_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_inpatient_payments`
--

DROP TABLE IF EXISTS `ar_inpatient_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_inpatient_payments` (
  `id` char(36) NOT NULL,
  `or_no` varchar(255) NOT NULL,
  `inpatient_bill_id` char(36) NOT NULL,
  `total_amount_paid` float NOT NULL,
  `payment_term_id` char(36) NOT NULL,
  `date_of_payment` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `patient_cash_payment_id` char(36) DEFAULT NULL,
  `patient_check_payment_id` char(36) DEFAULT NULL,
  `payment_method_id` char(36) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_inpatient_payments`
--

LOCK TABLES `ar_inpatient_payments` WRITE;
/*!40000 ALTER TABLE `ar_inpatient_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `ar_inpatient_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_inpatients`
--

DROP TABLE IF EXISTS `ar_inpatients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_inpatients` (
  `admission_id` varchar(255) NOT NULL,
  `inpatient_no` varchar(255) NOT NULL,
  `patient_id` varchar(36) DEFAULT NULL,
  `date_admitted` datetime NOT NULL,
  `reason_of_admittance` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `diagnosis` varchar(255) DEFAULT NULL,
  `tests` varchar(255) DEFAULT NULL,
  `treatments` varchar(255) DEFAULT NULL,
  `surgery` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `is_accepting_visits` varchar(255) DEFAULT NULL,
  `patient_status` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_inpatients`
--

LOCK TABLES `ar_inpatients` WRITE;
/*!40000 ALTER TABLE `ar_inpatients` DISABLE KEYS */;
INSERT INTO `ar_inpatients` VALUES ('98e2745d-4145-4714-97cf-4202c1d20a28','PT2121-6945','7c25893d-4ee3-4fd6-8ddd-deddaef4e192','2020-03-11 07:41:37','check-up','special','cold','x-ray','medicine intake','none','Active',NULL,'Discharge','2022-03-05 15:43:18',NULL);
/*!40000 ALTER TABLE `ar_inpatients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_insurances`
--

DROP TABLE IF EXISTS `ar_insurances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_insurances` (
  `insurance_id` varchar(36) NOT NULL,
  `policy_holder` varchar(255) DEFAULT NULL,
  `policy_number` varchar(255) DEFAULT NULL,
  `company_phone` varchar(255) DEFAULT NULL,
  `company_address` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_insurances`
--

LOCK TABLES `ar_insurances` WRITE;
/*!40000 ALTER TABLE `ar_insurances` DISABLE KEYS */;
INSERT INTO `ar_insurances` VALUES ('93d40000-c10b-41ff-9323-fd14364d0e1b','oiuy','100','099999999999','marikina','insurance','2022-03-05 07:35:53','2022-03-05 07:35:53');
/*!40000 ALTER TABLE `ar_insurances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_lab_requests`
--

DROP TABLE IF EXISTS `ar_lab_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_lab_requests` (
  `id` varchar(36) NOT NULL,
  `lab_test_id` varchar(36) NOT NULL,
  `patient_id` varchar(36) NOT NULL,
  `lab_request_no` varchar(100) NOT NULL,
  `quantity` float NOT NULL DEFAULT '1',
  `cancellation_return` float NOT NULL,
  `is_active` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_lab_requests`
--

LOCK TABLES `ar_lab_requests` WRITE;
/*!40000 ALTER TABLE `ar_lab_requests` DISABLE KEYS */;
INSERT INTO `ar_lab_requests` VALUES ('0d1ead39-a588-4d7f-9629-148c0121f931','1f4dfd75-8a98-46fa-b65b-f2c2fc12eb37','7c25893d-4ee3-4fd6-8ddd-deddaef4e192','LAB816a-20220305',1000,11,'FOR BILLING','FOR BILLING','2022-03-05 08:04:19','2022-08-02 19:09:31'),('3079a082-383d-4245-818a-33585bb31e77','1f4dfd75-8a98-46fa-b65b-f2c2fc12eb37','7c25893d-4ee3-4fd6-8ddd-deddaef4e192','LAB2ecd-20220802',11,0,'ACTIVE','PENDING','2022-08-02 11:22:44',NULL);
/*!40000 ALTER TABLE `ar_lab_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_lab_requests_bill`
--

DROP TABLE IF EXISTS `ar_lab_requests_bill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_lab_requests_bill` (
  `id` char(36) NOT NULL,
  `invoice_no` varchar(100) DEFAULT NULL,
  `invoice_date` datetime NOT NULL,
  `inpatient_bill_id` varchar(36) DEFAULT NULL,
  `lab_requests_id` varchar(36) NOT NULL,
  `total_amount` float NOT NULL,
  `cancellation_return` float DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_lab_requests_bill`
--

LOCK TABLES `ar_lab_requests_bill` WRITE;
/*!40000 ALTER TABLE `ar_lab_requests_bill` DISABLE KEYS */;
INSERT INTO `ar_lab_requests_bill` VALUES ('4b2cf571-8650-4c8c-b24c-1cf16ed22d80','TRTMNTBILL-4515','2022-03-05 16:52:52','2679ddd1-1330-411c-bcaf-8d3f7410126a','0d1ead39-a588-4d7f-9629-148c0121f931',494500,11,'Pending','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 16:52:52','752c703a-3ecf-4d57-925c-14774bdeace9','2022-08-02 19:09:31');
/*!40000 ALTER TABLE `ar_lab_requests_bill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_lab_service_name`
--

DROP TABLE IF EXISTS `ar_lab_service_name`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_lab_service_name` (
  `id` varchar(36) NOT NULL,
  `lab_service_name` varchar(255) NOT NULL,
  `lab_test_types_id` varchar(36) NOT NULL,
  `unit_price` float NOT NULL,
  `status` varchar(100) DEFAULT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_lab_service_name`
--

LOCK TABLES `ar_lab_service_name` WRITE;
/*!40000 ALTER TABLE `ar_lab_service_name` DISABLE KEYS */;
INSERT INTO `ar_lab_service_name` VALUES ('1f4dfd75-8a98-46fa-b65b-f2c2fc12eb37','x-ray lab','bd7df91c-9a35-4cec-8427-f25ce96f34cb',500,'Active','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 07:19:50',NULL,NULL);
/*!40000 ALTER TABLE `ar_lab_service_name` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_lab_test_types`
--

DROP TABLE IF EXISTS `ar_lab_test_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_lab_test_types` (
  `id` char(36) NOT NULL,
  `lab_test_type_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_lab_test_types`
--

LOCK TABLES `ar_lab_test_types` WRITE;
/*!40000 ALTER TABLE `ar_lab_test_types` DISABLE KEYS */;
INSERT INTO `ar_lab_test_types` VALUES ('bd7df91c-9a35-4cec-8427-f25ce96f34cb','x-ray','x-ray','active','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 07:18:57',NULL,NULL);
/*!40000 ALTER TABLE `ar_lab_test_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_medicalsupplies`
--

DROP TABLE IF EXISTS `ar_medicalsupplies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_medicalsupplies` (
  `id` char(36) NOT NULL,
  `ms_product_name` varchar(255) NOT NULL,
  `ms_quantity` int NOT NULL,
  `ms_manufacturer` char(36) DEFAULT NULL,
  `ms_manufactured_date` date NOT NULL,
  `ms_import_date` date NOT NULL,
  `ms_expiration_date` date NOT NULL,
  `ms_batch_number` int NOT NULL,
  `ms_unit_price` float NOT NULL,
  `ms_tax` int DEFAULT NULL,
  `ms_purpose` varchar(255) NOT NULL,
  `condition` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_medicalsupplies`
--

LOCK TABLES `ar_medicalsupplies` WRITE;
/*!40000 ALTER TABLE `ar_medicalsupplies` DISABLE KEYS */;
INSERT INTO `ar_medicalsupplies` VALUES ('901754c6-1b48-4735-8722-4ae149122e08','loperamide',100,'ritemed','2022-03-05','2022-03-05','2022-03-05',1,10,1,'diarrhea','No issue','High','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 15:30:35',NULL,NULL);
/*!40000 ALTER TABLE `ar_medicalsupplies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_medicalsupplies_pr`
--

DROP TABLE IF EXISTS `ar_medicalsupplies_pr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_medicalsupplies_pr` (
  `medicsupp_prid` char(36) NOT NULL,
  `ms_no` int NOT NULL,
  `medical_id` char(36) DEFAULT NULL,
  `quantity` int NOT NULL,
  `prescription_id` char(36) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_medicalsupplies_pr`
--

LOCK TABLES `ar_medicalsupplies_pr` WRITE;
/*!40000 ALTER TABLE `ar_medicalsupplies_pr` DISABLE KEYS */;
INSERT INTO `ar_medicalsupplies_pr` VALUES ('fa738af7-f654-4945-9829-bc8e10385f9d',1615,'901754c6-1b48-4735-8722-4ae149122e08',0,'7853eed2-0964-40ba-b477-4aa48453158a','Unpaid','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 08:01:47',NULL,NULL);
/*!40000 ALTER TABLE `ar_medicalsupplies_pr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_medicine_pr`
--

DROP TABLE IF EXISTS `ar_medicine_pr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_medicine_pr` (
  `medpr_id` char(36) NOT NULL,
  `medicine_no` int NOT NULL,
  `medicine_id` char(36) DEFAULT NULL,
  `quantity` int NOT NULL,
  `cancellation_return` float NOT NULL,
  `intake` varchar(255) NOT NULL,
  `frequency` varchar(255) NOT NULL,
  `dosage` varchar(255) NOT NULL,
  `doctor_prescribed` varchar(255) NOT NULL,
  `prescription_id` char(36) DEFAULT NULL,
  `med_pres_status` varchar(255) NOT NULL,
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_medicine_pr`
--

LOCK TABLES `ar_medicine_pr` WRITE;
/*!40000 ALTER TABLE `ar_medicine_pr` DISABLE KEYS */;
INSERT INTO `ar_medicine_pr` VALUES ('134567890',10,'aab5b99b-1f5f-421b-817c-4bcf30efabde',100,11,'3','1','500','500','7853eed2-0964-40ba-b477-4aa48453158a','FOR BILLING','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 08:59:06',NULL,'2022-03-05 08:59:06');
/*!40000 ALTER TABLE `ar_medicine_pr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_medicines`
--

DROP TABLE IF EXISTS `ar_medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_medicines` (
  `id` char(36) NOT NULL,
  `med_product_name` varchar(255) NOT NULL,
  `med_quantity` int NOT NULL,
  `med_manufacturer` char(36) DEFAULT NULL,
  `med_manufactured_date` date NOT NULL,
  `med_import_date` date NOT NULL,
  `med_expiration_date` date NOT NULL,
  `med_batch_number` int NOT NULL,
  `med_unit_price` float NOT NULL,
  `med_tax` int DEFAULT NULL,
  `med_purpose` varchar(255) NOT NULL,
  `condition` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `dosage` int NOT NULL,
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_medicines`
--

LOCK TABLES `ar_medicines` WRITE;
/*!40000 ALTER TABLE `ar_medicines` DISABLE KEYS */;
INSERT INTO `ar_medicines` VALUES ('aab5b99b-1f5f-421b-817c-4bcf30efabde','paracetamol',100,'ritemed','2022-03-05','2022-03-05','2022-03-05',1,10,1,'headache','No issue','High',500,'752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 15:28:20',NULL,NULL);
/*!40000 ALTER TABLE `ar_medicines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_patient_registration`
--

DROP TABLE IF EXISTS `ar_patient_registration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_patient_registration` (
  `patient_id` varchar(36) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `sex` varchar(255) NOT NULL,
  `birthday` date NOT NULL,
  `weight` varchar(255) NOT NULL,
  `height` varchar(255) NOT NULL,
  `blood_type` varchar(255) NOT NULL,
  `guardian` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `contact_number` varchar(255) NOT NULL,
  `medical_history_number` varchar(36) DEFAULT NULL,
  `dp_id` varchar(36) DEFAULT NULL,
  `insurance_id` varchar(36) DEFAULT NULL,
  `patient_type` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_patient_registration`
--

LOCK TABLES `ar_patient_registration` WRITE;
/*!40000 ALTER TABLE `ar_patient_registration` DISABLE KEYS */;
INSERT INTO `ar_patient_registration` VALUES ('7c25893d-4ee3-4fd6-8ddd-deddaef4e192','carl','jeffrey','austria','male','2001-03-05','70','155','O','wemina','Quezon City','09090909099','1','40f7697b-4d46-4be9-a7e7-b925266609f5','93d40000-c10b-41ff-9323-fd14364d0e1b','inpatient','2022-03-05 07:30:53',NULL);
/*!40000 ALTER TABLE `ar_patient_registration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_payment_terms`
--

DROP TABLE IF EXISTS `ar_payment_terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_payment_terms` (
  `id` char(36) NOT NULL,
  `term_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_payment_terms`
--

LOCK TABLES `ar_payment_terms` WRITE;
/*!40000 ALTER TABLE `ar_payment_terms` DISABLE KEYS */;
/*!40000 ALTER TABLE `ar_payment_terms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_pharmacy_bill`
--

DROP TABLE IF EXISTS `ar_pharmacy_bill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_pharmacy_bill` (
  `id` char(36) NOT NULL,
  `invoice_no` varchar(100) DEFAULT NULL,
  `invoice_date` datetime NOT NULL,
  `inpatient_bill_id` varchar(36) DEFAULT NULL,
  `medpr_id` char(36) NOT NULL,
  `total_amount` float NOT NULL,
  `cancellation_return` float DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_pharmacy_bill`
--

LOCK TABLES `ar_pharmacy_bill` WRITE;
/*!40000 ALTER TABLE `ar_pharmacy_bill` DISABLE KEYS */;
INSERT INTO `ar_pharmacy_bill` VALUES ('ec7646b0-062c-4092-8c9c-9288bb04356f','PHRMCYBILL-8663','2022-03-05 16:52:52','2679ddd1-1330-411c-bcaf-8d3f7410126a','134567890',890,11,'Pending','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 16:52:52','752c703a-3ecf-4d57-925c-14774bdeace9','2022-08-02 19:09:31');
/*!40000 ALTER TABLE `ar_pharmacy_bill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_prescriptions`
--

DROP TABLE IF EXISTS `ar_prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_prescriptions` (
  `prescription_id` char(36) NOT NULL,
  `prescription_no` varchar(255) NOT NULL,
  `admission_id` char(36) DEFAULT NULL,
  `outpatient_id` varchar(255) DEFAULT NULL,
  `date_prescribed` date NOT NULL,
  `patient_status` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_prescriptions`
--

LOCK TABLES `ar_prescriptions` WRITE;
/*!40000 ALTER TABLE `ar_prescriptions` DISABLE KEYS */;
INSERT INTO `ar_prescriptions` VALUES ('7853eed2-0964-40ba-b477-4aa48453158a','PR-1001','98e2745d-4145-4714-97cf-4202c1d20a28',NULL,'2022-03-05','active','FOR BILLING','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 15:51:52',NULL,NULL);
/*!40000 ALTER TABLE `ar_prescriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_purchase_order`
--

DROP TABLE IF EXISTS `ar_purchase_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_purchase_order` (
  `id` char(36) NOT NULL,
  `purchase_order_number` varchar(255) NOT NULL,
  `total_bill` float NOT NULL,
  `order_date` date NOT NULL,
  `expected_delivery_date` date NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `notes` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_purchase_order`
--

LOCK TABLES `ar_purchase_order` WRITE;
/*!40000 ALTER TABLE `ar_purchase_order` DISABLE KEYS */;
INSERT INTO `ar_purchase_order` VALUES ('188236ff-e395-4112-b866-efd92d224c49','PO001',16400,'2022-02-01','2022-02-02','Cheque','Supplies','Approved','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 14:12:05','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 14:16:41'),('4935f4d0-f161-47e2-89e2-f72d9ff403a8','PO005',89000,'2022-03-09','2022-03-10','Cheque','Equipments','Approved','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 14:16:23','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 14:16:58'),('4cb8ee0a-90c2-41cd-ad52-4b8e5d2c9e0b','PO0003',21500,'2022-02-05','2022-02-06','Cash','Furnitures','Approved','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 14:14:11','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 17:41:01'),('5549fa14-746c-4fbb-bd9d-624eecf19d15','123-456',500,'2022-02-04','2022-05-05','Cash','No to Cancellations','Inactive','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 00:01:18','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 14:10:33'),('77e91128-90bd-4e70-90d7-c6527139fb4a','PC002',65000,'2022-02-03','2022-02-04','Cheque','Computers','Inactive','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 14:13:26','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 14:17:20'),('9f211d2a-72f1-4c4f-9f33-99b409a527c6','PO004',12000,'2022-03-07','2022-03-08','Cheque','Softwares','Approved','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 14:15:31','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 14:17:05');
/*!40000 ALTER TABLE `ar_purchase_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_room_bill`
--

DROP TABLE IF EXISTS `ar_room_bill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_room_bill` (
  `id` char(36) NOT NULL,
  `invoice_no` varchar(100) NOT NULL,
  `invoice_date` datetime NOT NULL,
  `admission_id` varchar(36) NOT NULL,
  `inpatient_bill_id` varchar(36) DEFAULT NULL,
  `total_amount` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_room_bill`
--

LOCK TABLES `ar_room_bill` WRITE;
/*!40000 ALTER TABLE `ar_room_bill` DISABLE KEYS */;
INSERT INTO `ar_room_bill` VALUES ('qwqwed2-0964-40ba-b477-4aa48453158a','984659235','2022-03-05 10:12:53','98e2745d-4145-4714-97cf-4202c1d20a28','2679ddd1-1330-411c-bcaf-8d3f7410126a',31500,'Pending','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 17:13:45','752c703a-3ecf-4d57-925c-14774bdeace9','2022-08-02 19:09:31');
/*!40000 ALTER TABLE `ar_room_bill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_room_types`
--

DROP TABLE IF EXISTS `ar_room_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_room_types` (
  `id` char(36) NOT NULL,
  `room_type_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `amount` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_room_types`
--

LOCK TABLES `ar_room_types` WRITE;
/*!40000 ALTER TABLE `ar_room_types` DISABLE KEYS */;
INSERT INTO `ar_room_types` VALUES ('f5f152a8-7ccc-4a4d-8ad4-670a25e3c6aa','ordinary','ordinary',500,'avaiable','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 15:17:58',NULL,NULL);
/*!40000 ALTER TABLE `ar_room_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_rooms`
--

DROP TABLE IF EXISTS `ar_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_rooms` (
  `room_id` varchar(36) NOT NULL,
  `room_number` varchar(255) NOT NULL,
  `date_admitted` datetime DEFAULT NULL,
  `admission_id` varchar(255) NOT NULL,
  `room_type_id` varchar(36) NOT NULL,
  `location` varchar(36) DEFAULT NULL,
  `room_count` int DEFAULT NULL,
  `room_status` varchar(36) NOT NULL,
  `active_status` varchar(36) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_rooms`
--

LOCK TABLES `ar_rooms` WRITE;
/*!40000 ALTER TABLE `ar_rooms` DISABLE KEYS */;
INSERT INTO `ar_rooms` VALUES ('bc592bb9-3902-4708-b774-1e44227da91e','RMb153-5050','2022-01-01 07:47:45','98e2745d-4145-4714-97cf-4202c1d20a28','f5f152a8-7ccc-4a4d-8ad4-670a25e3c6aa','commonwealth',5,'active','active','2022-03-05 07:47:45',NULL);
/*!40000 ALTER TABLE `ar_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_specialization`
--

DROP TABLE IF EXISTS `ar_specialization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_specialization` (
  `specialization_id` char(36) NOT NULL,
  `specialization_name` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_specialization`
--

LOCK TABLES `ar_specialization` WRITE;
/*!40000 ALTER TABLE `ar_specialization` DISABLE KEYS */;
INSERT INTO `ar_specialization` VALUES ('95728eb1-4ef2-446f-b063-dd23efbadc40','neurosurgeon','Active','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 15:11:41',NULL,'2022-03-05 15:11:41');
/*!40000 ALTER TABLE `ar_specialization` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_surgeries`
--

DROP TABLE IF EXISTS `ar_surgeries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_surgeries` (
  `id` varchar(36) NOT NULL,
  `surgery_no` varchar(100) NOT NULL,
  `patient_id` varchar(36) NOT NULL,
  `room` varchar(100) DEFAULT NULL,
  `surgery_type_id` varchar(36) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` varchar(100) DEFAULT NULL,
  `status` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_surgeries`
--

LOCK TABLES `ar_surgeries` WRITE;
/*!40000 ALTER TABLE `ar_surgeries` DISABLE KEYS */;
INSERT INTO `ar_surgeries` VALUES ('f5c54447-0745-426d-af5e-7c48e53b96e8','SRGYS4c68-3823','7c25893d-4ee3-4fd6-8ddd-deddaef4e192','bc592bb9-3902-4708-b774-1e44227da91e','d502ebcc-7c3f-4935-9513-0eaab3b53fd4','2022-03-05 07:23:47','2022-03-05 07:23:47','surgery','active','active','2022-03-05 07:23:47',NULL);
/*!40000 ALTER TABLE `ar_surgeries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_surgery_in_charge`
--

DROP TABLE IF EXISTS `ar_surgery_in_charge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_surgery_in_charge` (
  `id` char(36) NOT NULL,
  `dr_in_charge_id` char(36) NOT NULL,
  `head_surgeon_id` varchar(36) DEFAULT 'No',
  `nurse_charge_id` char(36) DEFAULT NULL,
  `surgery_id` varchar(36) NOT NULL,
  `status` varchar(100) NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_surgery_in_charge`
--

LOCK TABLES `ar_surgery_in_charge` WRITE;
/*!40000 ALTER TABLE `ar_surgery_in_charge` DISABLE KEYS */;
/*!40000 ALTER TABLE `ar_surgery_in_charge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_surgery_types`
--

DROP TABLE IF EXISTS `ar_surgery_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_surgery_types` (
  `id` char(36) NOT NULL,
  `surgery_type_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_surgery_types`
--

LOCK TABLES `ar_surgery_types` WRITE;
/*!40000 ALTER TABLE `ar_surgery_types` DISABLE KEYS */;
INSERT INTO `ar_surgery_types` VALUES ('d502ebcc-7c3f-4935-9513-0eaab3b53fd4','bone surgery','bone surgery','Active','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 07:22:42',NULL,NULL);
/*!40000 ALTER TABLE `ar_surgery_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_treatment_bill`
--

DROP TABLE IF EXISTS `ar_treatment_bill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_treatment_bill` (
  `id` char(36) NOT NULL,
  `invoice_no` varchar(100) DEFAULT NULL,
  `invoice_date` datetime NOT NULL,
  `inpatient_bill_id` varchar(36) DEFAULT NULL,
  `treatment_id` varchar(36) NOT NULL,
  `total_amount` float NOT NULL,
  `cancellation_return` float DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_treatment_bill`
--

LOCK TABLES `ar_treatment_bill` WRITE;
/*!40000 ALTER TABLE `ar_treatment_bill` DISABLE KEYS */;
INSERT INTO `ar_treatment_bill` VALUES ('56166f36-83e8-4644-8d78-177435501073','TRTMNTBILL-4143','2022-03-05 16:52:52','2679ddd1-1330-411c-bcaf-8d3f7410126a','1c71c925-5620-4863-8542-a34744543549',44500,11,'Pending','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 16:52:52','752c703a-3ecf-4d57-925c-14774bdeace9','2022-08-02 19:09:31');
/*!40000 ALTER TABLE `ar_treatment_bill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_treatment_service_name`
--

DROP TABLE IF EXISTS `ar_treatment_service_name`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_treatment_service_name` (
  `id` varchar(36) NOT NULL,
  `treatment_service_name` varchar(255) NOT NULL,
  `treatment_types_id` varchar(36) NOT NULL,
  `unit_price` float NOT NULL,
  `status` varchar(100) NOT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_treatment_service_name`
--

LOCK TABLES `ar_treatment_service_name` WRITE;
/*!40000 ALTER TABLE `ar_treatment_service_name` DISABLE KEYS */;
INSERT INTO `ar_treatment_service_name` VALUES ('6d0859b2-1924-45fd-91b4-aba33b0d23d8','paramedics','d1a23ee3-6267-4f9c-984d-f15b90f61993',500,'Pending','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 07:12:24',NULL,'2022-03-05 15:45:59');
/*!40000 ALTER TABLE `ar_treatment_service_name` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_treatment_types`
--

DROP TABLE IF EXISTS `ar_treatment_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_treatment_types` (
  `id` char(36) NOT NULL,
  `treatment_type_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_treatment_types`
--

LOCK TABLES `ar_treatment_types` WRITE;
/*!40000 ALTER TABLE `ar_treatment_types` DISABLE KEYS */;
INSERT INTO `ar_treatment_types` VALUES ('d1a23ee3-6267-4f9c-984d-f15b90f61993','naurosurgery','brain surgery','Active','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 15:13:29',NULL,'2022-03-05 15:13:29');
/*!40000 ALTER TABLE `ar_treatment_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_treatments`
--

DROP TABLE IF EXISTS `ar_treatments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_treatments` (
  `id` varchar(36) NOT NULL,
  `treatment_no` varchar(100) NOT NULL,
  `patient_id` varchar(36) NOT NULL,
  `treatment_service_name_id` varchar(36) NOT NULL,
  `doctor_profile_id` varchar(36) NOT NULL,
  `description` text,
  `quantity` float NOT NULL,
  `cancellation_return` float NOT NULL,
  `room` varchar(100) DEFAULT NULL,
  `session_no` text,
  `session_datetime` datetime NOT NULL,
  `drug` text,
  `dose` text,
  `next_schedule` datetime DEFAULT NULL,
  `comments` text,
  `status` varchar(100) NOT NULL,
  `is_active` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_treatments`
--

LOCK TABLES `ar_treatments` WRITE;
/*!40000 ALTER TABLE `ar_treatments` DISABLE KEYS */;
INSERT INTO `ar_treatments` VALUES ('1c71c925-5620-4863-8542-a34744543549','TRTMNT9d8e-2011','7c25893d-4ee3-4fd6-8ddd-deddaef4e192','6d0859b2-1924-45fd-91b4-aba33b0d23d8','2e5e52f7-9e2e-46e1-8197-847aeb466acd','treatment',100,11,'bc592bb9-3902-4708-b774-1e44227da91e','1','2022-03-05 07:43:40','paracetamol','500','2022-03-05 07:43:40','monitor condition','FOR BILLING','FOR BILLING','2022-03-05 07:43:40','2022-08-02 19:09:31'),('cfeb36d5-085d-4e68-9011-c70248fdb065','TRTMNT1393-5281','7c25893d-4ee3-4fd6-8ddd-deddaef4e192','6d0859b2-1924-45fd-91b4-aba33b0d23d8','2e5e52f7-9e2e-46e1-8197-847aeb466acd','asdadasd',11,0,'111ww','www11','2022-08-02 11:20:00','1','1','2022-08-02 11:20:00','1','Active','Active','2022-08-02 11:20:00',NULL);
/*!40000 ALTER TABLE `ar_treatments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_users`
--

DROP TABLE IF EXISTS `ar_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_users` (
  `id` char(36) NOT NULL,
  `employee_id` char(36) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_type` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_users`
--

LOCK TABLES `ar_users` WRITE;
/*!40000 ALTER TABLE `ar_users` DISABLE KEYS */;
INSERT INTO `ar_users` VALUES ('752c703a-3ecf-4d57-925c-14774bdeace9','85dd4c11-0417-4637-8e7e-a1f129d88c34','Jude@gmail.com','$2b$12$StHmhod5A3bZ2OAGbf5j0OO9nCd3oH7oOv14Se4zPi5dX.4OdenQi','Accountant','Active',NULL,'2022-03-04 23:47:47',NULL,NULL);
/*!40000 ALTER TABLE `ar_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_utilities`
--

DROP TABLE IF EXISTS `ar_utilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar_utilities` (
  `id` char(36) NOT NULL,
  `utility_type` varchar(255) NOT NULL,
  `utility_name` varchar(255) NOT NULL,
  `utility_bill` float NOT NULL,
  `due_date` date NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `notes` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_utilities`
--

LOCK TABLES `ar_utilities` WRITE;
/*!40000 ALTER TABLE `ar_utilities` DISABLE KEYS */;
INSERT INTO `ar_utilities` VALUES ('29abef1f-b849-49d0-b827-0447fb7076ad','Water','Maynilad',8000,'2022-02-28','Cheque','February Water Bill','Approved','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 14:19:35','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 14:20:38'),('5ba39ba6-e83b-4727-8bd8-ce6d50974d89','Landline','Converge',5000,'2022-01-31','Cheque','January Internet Bill','Approved','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 14:18:43','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 14:20:45'),('936d8a2c-af6a-40eb-9a0e-b9c192016cfa','Electricity','Meralco',1666,'2022-05-05','Cash','Dont delay.','Inactive','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 00:10:01','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 14:20:27'),('e9971cd4-fb95-455e-af21-f3c59e0f2f6e','Internet','Smart Fiber',7000,'2022-02-28','Cash','February Internet Bill','Active','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 14:21:38',NULL,NULL),('f07b5d7f-fee9-4f24-bd8a-633f1ddc779d','Gas','LPG',700,'2222-02-02','Cheque','Ple','Inactive','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 02:09:39','752c703a-3ecf-4d57-925c-14774bdeace9','2022-03-05 14:20:15');
/*!40000 ALTER TABLE `ar_utilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bank_accounts`
--

DROP TABLE IF EXISTS `bank_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bank_accounts` (
  `id` char(36) NOT NULL,
  `account_name` varchar(255) NOT NULL,
  `account_no` varchar(255) NOT NULL,
  `bank_name` varchar(255) NOT NULL,
  `bank_address` varchar(255) NOT NULL,
  `remaining_amount` float NOT NULL,
  `initial_amount` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `bank_accounts_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `bank_accounts_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bank_accounts`
--

LOCK TABLES `bank_accounts` WRITE;
/*!40000 ALTER TABLE `bank_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `bank_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cash_disbursement_journals`
--

DROP TABLE IF EXISTS `cash_disbursement_journals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cash_disbursement_journals` (
  `id` char(36) NOT NULL,
  `check_no` varchar(255) NOT NULL,
  `payee_name` varchar(255) NOT NULL,
  `account_credited` varchar(255) NOT NULL,
  `posting_reference` varchar(255) NOT NULL,
  `cash` float NOT NULL,
  `inventory` float NOT NULL,
  `other_accounts` float NOT NULL,
  `accounts_payable` float NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `check_no` (`check_no`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `cash_disbursement_journals_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `cash_disbursement_journals_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cash_disbursement_journals`
--

LOCK TABLES `cash_disbursement_journals` WRITE;
/*!40000 ALTER TABLE `cash_disbursement_journals` DISABLE KEYS */;
/*!40000 ALTER TABLE `cash_disbursement_journals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cash_receipt_journals`
--

DROP TABLE IF EXISTS `cash_receipt_journals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cash_receipt_journals` (
  `id` char(36) NOT NULL,
  `inpatient_payment_id` char(36) NOT NULL,
  `account_credited` varchar(255) NOT NULL,
  `posting_reference` varchar(255) NOT NULL,
  `explanation` varchar(255) NOT NULL,
  `cash` float NOT NULL,
  `sales_discount` float NOT NULL,
  `accounts_receivable` float NOT NULL,
  `accounts_payable` float NOT NULL,
  `sales` float NOT NULL,
  `other_accounts` float NOT NULL,
  `cods_inventory` float NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `inpatient_payment_id` (`inpatient_payment_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `cash_receipt_journals_ibfk_1` FOREIGN KEY (`inpatient_payment_id`) REFERENCES `inpatient_payments` (`id`),
  CONSTRAINT `cash_receipt_journals_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `cash_receipt_journals_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cash_receipt_journals`
--

LOCK TABLES `cash_receipt_journals` WRITE;
/*!40000 ALTER TABLE `cash_receipt_journals` DISABLE KEYS */;
/*!40000 ALTER TABLE `cash_receipt_journals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chart_accounts`
--

DROP TABLE IF EXISTS `chart_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chart_accounts` (
  `id` char(36) NOT NULL,
  `account_title` varchar(255) NOT NULL,
  `account_type` char(36) DEFAULT NULL,
  `account_number` varchar(255) NOT NULL,
  `description` mediumtext NOT NULL,
  `replaced_record` char(36) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `account_type` (`account_type`),
  KEY `replaced_record` (`replaced_record`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `chart_accounts_ibfk_1` FOREIGN KEY (`account_type`) REFERENCES `account_types` (`id`),
  CONSTRAINT `chart_accounts_ibfk_2` FOREIGN KEY (`replaced_record`) REFERENCES `chart_accounts` (`id`),
  CONSTRAINT `chart_accounts_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `chart_accounts_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chart_accounts`
--

LOCK TABLES `chart_accounts` WRITE;
/*!40000 ALTER TABLE `chart_accounts` DISABLE KEYS */;
INSERT INTO `chart_accounts` VALUES ('0193c362-6080-42c4-9e6c-048f29e08ddc','Merch. Inventory - Food Supplies','917824d2-7713-45b0-8988-0ad18af2fbcb','1019','',NULL,'Active','2022-03-22 18:00:01','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('0553d46f-f309-4eb1-84bd-a8c0914e59ec','Laboratories Receivable','917824d2-7713-45b0-8988-0ad18af2fbcb','1033','',NULL,'Active','2022-09-02 11:02:15','2022-09-02 11:02:15','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('059bbe51-936c-43ea-a07f-d04d9b43b99f','Professional Services','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5033','',NULL,'Active','2022-03-22 18:27:23','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('073471d1-2e5b-46b0-8a9a-cace9e4624ac','Laboratory Supplies','917824d2-7713-45b0-8988-0ad18af2fbcb','1008','',NULL,'Active','2022-03-22 17:51:46','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('074fed28-cdeb-41b2-b033-1f295ff0f7e4','Trees, Plants & Crops','917824d2-7713-45b0-8988-0ad18af2fbcb','1006','',NULL,'Active','2022-03-22 17:50:57','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('09a91428-b9e5-4b01-8377-27fafc7ff6ab','Interest Expense','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5022','',NULL,'Active','2022-03-22 18:24:07','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('0a2de0b6-0cf6-44bf-ba00-29dae29cf1b4','Acc. Dep. – Trees, Plants & Crops','00827961-53a8-4825-ae4a-8639ab34ad9b','6006','',NULL,'Active','2022-03-22 18:32:10','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('0a538239-230c-48b2-b26f-2b06a0c59ea7','Transportation & Delivery Expenses','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5018','',NULL,'Active','2022-03-22 18:22:31','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('0ad3b4a9-1beb-4c5f-96ae-ee937cb513d1','Salaries Payable','215320f4-8753-48f4-894f-0ba0798a8e8b','2010','',NULL,'Active','2022-03-22 18:07:15','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('0b59ad2a-a7af-4333-b9aa-32d6226c8e8c','Awards/Rewards, Prizes & Indemnities','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5031','',NULL,'Active','2022-03-22 18:26:55','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('0da50104-dd9c-4a7f-ad66-d617207c222a','Professional Fee','e7db9b47-a012-42d7-a1ba-71122ff63bec','4002','',NULL,'Active','2022-03-22 18:12:55','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('10a17dbe-a813-4741-a1a3-6a4293c31696','Loss On Sale Of Property & Equipment','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5026','',NULL,'Active','2022-03-22 18:25:04','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('15860d68-9b72-47b5-afad-65f7357b54f1','Prescriptions Receivable','917824d2-7713-45b0-8988-0ad18af2fbcb','1032','','51f259f6-e5ca-4e96-8872-8a4f22a13733','Active','2022-09-02 11:01:19','2022-09-02 11:01:52','65501c6d-fad9-4401-9ff6-18a7b1626cea','65501c6d-fad9-4401-9ff6-18a7b1626cea'),('15de139c-dbb8-4381-8717-38d33162c11e','Security Services Expense','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5012','',NULL,'Active','2022-03-22 18:20:55','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('1b4504ba-8e27-4fc4-ab15-6e6ad12cfa45','Treatments Receivable','917824d2-7713-45b0-8988-0ad18af2fbcb','1034','',NULL,'Active','2022-09-02 11:02:36','2022-09-02 11:02:36','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('1bb53f4d-b6a1-4d34-9d5a-d946c49809b6','Interest Payable','215320f4-8753-48f4-894f-0ba0798a8e8b','2008','',NULL,'Active','2022-03-22 18:06:46','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('1e2de276-590f-4cc3-b59e-2dd6643da720','Purchase Order Expense','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5043','',NULL,'Active','2022-09-02 08:53:25','2022-09-02 08:53:25','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('1fec3e76-045a-494a-9596-33970c655e1e','Salaries Expense','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5032','',NULL,'Active','2022-03-22 18:27:08','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('200fd081-4f74-49b8-8622-c36773e2eb3b','Printing Expense','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5016','',NULL,'Active','2022-03-22 18:22:02','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('20b6b45c-c619-4431-944a-f5cbc4f67eca','Other Expenses','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5042','',NULL,'Active','2022-03-22 18:30:04','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('2147275c-b1a8-48f8-b3d9-fe6f2c894e88','Dep. Exp.–Trees, Plants & Crops','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5006','',NULL,'Active','2022-03-22 18:18:45','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('22f6b4c5-f2cd-4398-b3fd-b639f2c10689','Accounts Payable','215320f4-8753-48f4-894f-0ba0798a8e8b','2001','',NULL,'Active','2022-03-22 18:04:48','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('24847ecc-97b0-4eb7-9d6e-a5dbdfa639f8','Benefits','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5034','',NULL,'Active','2022-03-22 18:27:37','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('2678d902-c590-4543-81ad-ea9e5c70d4ce','Other Discounts','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5025','',NULL,'Active','2022-03-22 18:24:50','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('268f2ece-0bda-430a-911f-a6a5c9bb4563','Loss On Sale Of Other Assets','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5028','',NULL,'Active','2022-03-22 18:25:48','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('278e1b3f-6f1b-49c9-939b-97988ebca29c','Other Gains','e7db9b47-a012-42d7-a1ba-71122ff63bec','4012','',NULL,'Active','2022-03-22 18:15:46','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('2c0d1ee6-8d09-47aa-a099-9a8ec9aa0659','Surgery Fee','e7db9b47-a012-42d7-a1ba-71122ff63bec','4017','',NULL,'Active','2022-09-02 08:52:42','2022-09-02 08:52:42','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('2c0f5ad8-abab-4dd0-8daf-0491aa59604e','Office Supplies','917824d2-7713-45b0-8988-0ad18af2fbcb','1010','',NULL,'Active','2022-03-22 17:52:30','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('2c74a6c3-f1a9-4ca9-ad89-8d464e0798dd','Benefit Contributions Payable','215320f4-8753-48f4-894f-0ba0798a8e8b','2013','',NULL,'Active','2022-03-22 18:08:09','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('30c10774-d0ea-4ea8-a7dc-64d600fb480f','Sales Revenue','e7db9b47-a012-42d7-a1ba-71122ff63bec','4001','',NULL,'Active','2022-03-22 18:12:19','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('327b3d80-d53d-4881-aacc-57340976a39c','Awards & Rewards Payable','215320f4-8753-48f4-894f-0ba0798a8e8b','2009','',NULL,'Active','2022-03-22 18:06:59','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('32e075e1-c982-4435-9d71-6a2fb71f6422','Other Fees','e7db9b47-a012-42d7-a1ba-71122ff63bec','4006','',NULL,'Active','2022-03-22 18:13:56','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('33c1333f-0a1c-4916-a5fe-da46ea969236','Dep. Exp.–Motor Vehicles','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5003','',NULL,'Active','2022-03-22 18:17:46','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('345cd94e-430c-4dc5-b9eb-c341248a62e9','Compensations','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5035','',NULL,'Active','2022-03-22 18:27:53','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('355450f2-8755-4822-a814-1161d271e3f4','Prescription Fee','e7db9b47-a012-42d7-a1ba-71122ff63bec','4014','',NULL,'Active','2022-09-02 07:27:08','2022-09-02 07:27:08','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('39dca7d9-04e1-4994-9fac-ab561a6c265a','Other Intangible Assets','917824d2-7713-45b0-8988-0ad18af2fbcb','1023','',NULL,'Active','2022-03-22 18:01:16','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('3a4cab18-2ebc-494e-92e9-c85a51ab0189','Other Merchandise Inventories','917824d2-7713-45b0-8988-0ad18af2fbcb','1020','',NULL,'Active','2022-03-22 18:00:23','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('3c64ee52-714f-4091-b3a5-6b450d8a038d','Prepaid Insurance','917824d2-7713-45b0-8988-0ad18af2fbcb','1026','',NULL,'Active','2022-03-22 18:02:12','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('3e278920-6045-46fc-9f77-172316ec4709','Merch. Inventory - Drugs & Medicines','917824d2-7713-45b0-8988-0ad18af2fbcb','1017','',NULL,'Active','2022-03-22 17:59:23','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('403b11be-f7a6-48e9-a17e-c91d4253b5ac','Treatment Fee','e7db9b47-a012-42d7-a1ba-71122ff63bec','4016','',NULL,'Active','2022-09-02 08:52:03','2022-09-02 08:52:03','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('40ed94d3-ae1c-4279-a65e-77a4ecea4267','Sales Discount','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5024','',NULL,'Active','2022-03-22 18:24:33','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('413dec35-1d41-42e4-a99c-6d1cd421160b','Processing Fee','e7db9b47-a012-42d7-a1ba-71122ff63bec','4005','',NULL,'Active','2022-03-22 18:13:41','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('42393348-7897-468a-af86-78d1a65b96c2','Prepaid-Expenses Expense','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5040','',NULL,'Active','2022-03-22 18:29:09','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('4411650e-5d4d-4667-a654-9d2e20ccee96','Rooms Receivable','917824d2-7713-45b0-8988-0ad18af2fbcb','1036','',NULL,'Active','2022-09-02 11:03:16','2022-09-02 11:03:16','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('44c2f8d2-70d4-4468-af38-ebb3581abb70','Compensations Payable','215320f4-8753-48f4-894f-0ba0798a8e8b','2012','',NULL,'Active','2022-03-22 18:07:53','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('466077f6-8703-4289-8ca3-8ab288a9b7f1','Land','917824d2-7713-45b0-8988-0ad18af2fbcb','1029','',NULL,'Active','2022-03-22 18:03:00','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('4ac5ca51-357c-4084-aaca-7a6b2cfd4658','Softwares/Websites/Apps','917824d2-7713-45b0-8988-0ad18af2fbcb','1022','',NULL,'Active','2022-03-22 18:01:00','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('4dd7815c-7837-467c-8056-6582d1116e89','Notes Receivable','917824d2-7713-45b0-8988-0ad18af2fbcb','1013','',NULL,'Active','2022-03-22 17:58:01','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('50204c63-6eae-4a1f-ba75-8f5f130e183e','Acc. Dep. – Furniture & Fixtures','00827961-53a8-4825-ae4a-8639ab34ad9b','6004','',NULL,'Active','2022-03-22 18:31:36','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('50c01dbd-573c-42ed-bed1-7e51f9d6b27f','Amortization - Intangible Assets','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5007','',NULL,'Active','2022-03-22 18:19:29','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('50d572fc-783c-47f4-b2d8-5959b8b04200','Accounts Receivable','917824d2-7713-45b0-8988-0ad18af2fbcb','1012','',NULL,'Active','2022-03-22 17:57:26','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('51f259f6-e5ca-4e96-8872-8a4f22a13733','Prescription Receivable','917824d2-7713-45b0-8988-0ad18af2fbcb','1032','',NULL,'Overwritten','2022-09-02 11:01:19','2022-09-02 11:01:51','65501c6d-fad9-4401-9ff6-18a7b1626cea','65501c6d-fad9-4401-9ff6-18a7b1626cea'),('5646ee2a-63a5-4f2c-80a7-8e8d2403b31f','Loss Of Assets','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5029','',NULL,'Active','2022-03-22 18:26:09','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('578b51a9-fd87-49cc-abc4-c45dcd0ce4d9','Homies, Withdrawal','5bbe6492-bb3f-4991-819e-3e0d9c6b3932','3002','',NULL,'Active','2022-03-22 18:10:20','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('5910e79e-3a9e-44d6-ab2b-7670e870acc4','Other Revenues','e7db9b47-a012-42d7-a1ba-71122ff63bec','4013','',NULL,'Active','2022-03-22 18:16:43','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('5c1b2367-01c6-4ec2-9bc0-0bfced694b8b','Clearance & Certification Fee','e7db9b47-a012-42d7-a1ba-71122ff63bec','4004','',NULL,'Active','2022-03-22 18:13:22','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('5ca2eedc-3d9c-4ab4-836f-b55cf1f39987','Long-Term Notes Payable','215320f4-8753-48f4-894f-0ba0798a8e8b','2015','',NULL,'Active','2022-03-22 18:08:46','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('5e458533-f35c-4b29-9fc6-d8f559d8b2a8','Mortgage Payable','215320f4-8753-48f4-894f-0ba0798a8e8b','2007','',NULL,'Active','2022-03-22 18:06:26','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('612b62f6-e8fa-4830-ad8e-bbe3c29df560','Laboratory Fee','e7db9b47-a012-42d7-a1ba-71122ff63bec','4015','',NULL,'Active','2022-09-02 08:51:28','2022-09-02 08:51:28','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('623b5fae-85b5-4f85-b542-d2219a5bb548','Prepaid Rent','917824d2-7713-45b0-8988-0ad18af2fbcb','1030','',NULL,'Active','2022-03-22 18:03:26','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('643111a3-91ff-4a2c-8eab-c6468e135df4','Gain On Sale Of Property & Equipment','e7db9b47-a012-42d7-a1ba-71122ff63bec','4009','',NULL,'Active','2022-03-22 18:14:54','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('6b42c9b4-8be7-4eb7-af10-3b9ff7f95e74','Cash In Banks','917824d2-7713-45b0-8988-0ad18af2fbcb','1016','',NULL,'Active','2022-03-22 17:59:06','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('7263e916-d138-4e6d-8a10-aed9d16e4e92','Acc. Amor.- Other Intangible Assets','00827961-53a8-4825-ae4a-8639ab34ad9b','6009','',NULL,'Active','2022-03-22 18:33:03','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('73c33b1e-4aa3-473d-bbd5-472b38022964','Advertising, Promotional & Marketing Expenses','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5017','',NULL,'Active','2022-03-22 18:22:17','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('76f4b926-bb89-4457-bdec-02ae52b80993','Gain On Sale Of Intangible Assets','e7db9b47-a012-42d7-a1ba-71122ff63bec','4010','',NULL,'Active','2022-03-22 18:15:11','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('78ab66dc-e73a-416c-9928-599454bbd4eb','Benefit Contributions','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5036','',NULL,'Active','2022-03-22 18:28:05','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('7aee1022-50df-41a8-b36a-c0c3b0f5564a','Cost Of Sales','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5039','',NULL,'Active','2022-03-22 18:28:52','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('7b8dc7ef-661c-4537-ae5a-b81f25c2e1f5','Other Liabilities','215320f4-8753-48f4-894f-0ba0798a8e8b','2016','',NULL,'Active','2022-03-22 18:09:45','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('81589b06-74d7-44ee-bb1f-699222e793a6','Medical Supplies','917824d2-7713-45b0-8988-0ad18af2fbcb','1007','',NULL,'Active','2022-03-22 17:51:17','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('83eef04e-d1f7-4122-b5b1-8e41daaf84d4','Taxes, Duties & Licenses Expenses','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5015','',NULL,'Active','2022-03-22 18:21:47','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('84412695-be49-4864-af24-097c206e4328','Machinery & Equipment','917824d2-7713-45b0-8988-0ad18af2fbcb','1005','',NULL,'Active','2022-03-22 17:50:15','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('85919266-7560-4681-b8fe-aaab6868f6f2','Motor Vehicles','917824d2-7713-45b0-8988-0ad18af2fbcb','1003','',NULL,'Active','2022-03-22 17:49:10','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('878818ce-cd6e-4cfc-8db5-1652e3f33673','Acc. Amor.- Patents/Copyrights','00827961-53a8-4825-ae4a-8639ab34ad9b','6007','',NULL,'Active','2022-03-22 18:32:21','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('9071120f-2e59-4d78-b8e2-68d90a78bd38','Bank Charges','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5020','',NULL,'Active','2022-03-22 18:23:01','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('90adcfa1-9e43-4ae7-a7e5-2b55fdbc1ea2','Acc. Dep. – Machinery & Equipment','00827961-53a8-4825-ae4a-8639ab34ad9b','6005','',NULL,'Active','2022-03-22 18:31:52','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('919a885d-b66f-44de-aeeb-3087a685500c','Prepayment To Contractors','917824d2-7713-45b0-8988-0ad18af2fbcb','1025','',NULL,'Active','2022-03-22 18:01:56','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('97706fcf-2225-48cb-9267-88e704df2a0c','Gain On Sale Of Other Assets','e7db9b47-a012-42d7-a1ba-71122ff63bec','4011','',NULL,'Active','2022-03-22 18:15:23','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('9af04fa4-fd89-4c6a-a4fb-4be91b290191','Hospital Discount','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5023','',NULL,'Active','2022-03-22 18:24:22','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('9b0aa0e8-b4fe-43c9-add7-af39d61e194f','Notes Payable','215320f4-8753-48f4-894f-0ba0798a8e8b','2002','',NULL,'Active','2022-03-22 18:05:06','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('9fba18ad-5658-4881-a3c0-6697b7be2288','Acc. Dep. – Buildings & Other Structures','00827961-53a8-4825-ae4a-8639ab34ad9b','6002','',NULL,'Active','2022-03-22 18:30:53','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('a69edf35-734c-4c16-909f-93f35d2e232f','Buildings & Other Structures','917824d2-7713-45b0-8988-0ad18af2fbcb','1002','',NULL,'Active','2022-03-22 17:48:49','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('a86ecdfd-e5f9-4eb0-809d-d06b74204494','Acc. Dep. – Motor Vehicles','00827961-53a8-4825-ae4a-8639ab34ad9b','6003','',NULL,'Active','2022-03-22 18:31:19','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('a8dce638-b89d-4640-897c-8d70c24820d4','Other General Services Expense','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5013','',NULL,'Active','2022-03-22 18:21:12','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('a935f68f-6d16-4481-ae33-d8db41492335','Dep. Exp.–Buildings & Other Structures','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5002','',NULL,'Active','2022-03-22 18:17:29','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('a97ceef9-75ce-45ab-9042-e2fa3520915e','Homies, Capital','5bbe6492-bb3f-4991-819e-3e0d9c6b3932','3001','',NULL,'Active','2022-03-22 18:10:02','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('a9b12137-5630-4f02-bd18-d6489055dd80','Acc. Dep. – Land Improvements','00827961-53a8-4825-ae4a-8639ab34ad9b','6001','',NULL,'Active','2022-03-22 18:30:32','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('a9bf2487-b5f3-4c01-8eea-81548500a0ff','Merch. Inventory - Supplies & Materials','917824d2-7713-45b0-8988-0ad18af2fbcb','1018','',NULL,'Active','2022-03-22 17:59:42','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('a9de521b-499d-431d-8baf-661855618af4','Utilities Expense','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5009','',NULL,'Active','2022-03-22 18:20:02','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('ab308e45-28a9-40ae-aeed-3fd94cedbfec','Other Supplies','917824d2-7713-45b0-8988-0ad18af2fbcb','1011','',NULL,'Active','2022-03-22 17:57:11','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('abb9f105-4909-4715-ae77-f1a1a3fce231','Furniture & Fixtures','917824d2-7713-45b0-8988-0ad18af2fbcb','1004','',NULL,'Active','2022-03-22 17:50:02','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('ac019bd5-e800-4ea5-b2f9-450edfe4926c','Other Losses','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5030','',NULL,'Active','2022-03-22 18:26:25','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('acd7bcac-3180-45f4-a8ca-10db30ca2abd','Allowance For Bad Debts','00827961-53a8-4825-ae4a-8639ab34ad9b','6010','',NULL,'Active','2022-03-22 18:33:18','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('ad831144-9291-4be2-adf3-8651caabaa2b','Supplies Expense','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5008','',NULL,'Active','2022-03-22 18:19:46','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','Cash','917824d2-7713-45b0-8988-0ad18af2fbcb','1015','',NULL,'Active','2022-03-22 17:58:44','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('b57da476-1d35-4005-b5d5-57becd3bdc86','Repairs & Maintenance Expenses','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5014','',NULL,'Active','2022-03-22 18:21:31','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('ba1fef42-6677-409b-be9a-bce95ed59970','Environment/Sanitary Services Expense','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5010','',NULL,'Active','2022-03-22 18:20:17','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('ba30ba41-cb0b-432a-bba2-d36ed6cb68b2','Other Equity','5bbe6492-bb3f-4991-819e-3e0d9c6b3932','3003','',NULL,'Active','2022-03-22 18:11:43','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('bfe78c0a-adf4-479b-92b2-7138bdec0f8f','Grants & Donations','e7db9b47-a012-42d7-a1ba-71122ff63bec','4008','',NULL,'Active','2022-03-22 18:14:34','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('c32be492-bfeb-47dd-bc3c-066c55ee62a8','Dep. Exp.–Machinery & Equipment','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5005','',NULL,'Active','2022-03-22 18:18:18','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('c6b5b218-9819-4639-8629-ba4c41d813ff','Other Assets','917824d2-7713-45b0-8988-0ad18af2fbcb','1031','',NULL,'Active','2022-03-22 18:04:24','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('c6f73482-bf0f-4788-b93c-2125390811f8','Janitorial Services Expense','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5011','',NULL,'Active','2022-03-22 18:20:39','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('cb8944e7-7cf2-456f-ae05-c93088a5b301','Dep. Exp.–Land Improvements','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5001','',NULL,'Active','2022-03-22 18:17:11','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('d3fac80a-cdf8-4efa-8565-b8223ad5afcf','Loss On Sale Of Intangible Assets','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5027','',NULL,'Active','2022-03-22 18:25:29','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('d48e3caa-b17b-4a22-8bcc-8fabfdb3b707','Dep. Exp.–Land','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5038','',NULL,'Active','2022-03-22 18:28:39','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('d5385c93-a751-40fb-8daa-e11db1d84a8e','Acc. Amor.- Softwares/Websites/Apps','00827961-53a8-4825-ae4a-8639ab34ad9b','6008','',NULL,'Active','2022-03-22 18:32:44','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('d5a986fa-143e-47d4-a088-d49fc2027e0e','Prepaid Interest','917824d2-7713-45b0-8988-0ad18af2fbcb','1027','',NULL,'Active','2022-03-22 18:02:31','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('d78e4af1-6aca-4b03-9f28-e3bc2fcbeeab','Dep. Exp.–Furniture & Fixtures','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5004','',NULL,'Active','2022-03-22 18:17:59','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('da5a2067-7723-4f08-8687-e3196b207944','Medical Record Fee','e7db9b47-a012-42d7-a1ba-71122ff63bec','4003','',NULL,'Active','2022-03-22 18:13:09','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('daedbf6e-db96-4dcf-a313-03fdeb0aa4f3','Room Fee','e7db9b47-a012-42d7-a1ba-71122ff63bec','4018','',NULL,'Active','2022-09-02 08:52:54','2022-09-02 08:52:54','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('db33ff11-6b8e-4a64-b2e7-f7105b7da331','Land Improvements','917824d2-7713-45b0-8988-0ad18af2fbcb','1001','',NULL,'Active','2022-03-22 17:47:47','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('e2267c78-d756-4b22-b8f9-14fea1d0fcf1','Insurance Expense','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5021','',NULL,'Active','2022-03-22 18:23:49','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('e2c8ec3a-0fb9-4025-8548-7e33e1347a88','Surgeries Receivable','917824d2-7713-45b0-8988-0ad18af2fbcb','1035','',NULL,'Active','2022-09-02 11:02:56','2022-09-02 11:02:56','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('e53325e8-7670-4c7c-a9c4-417b9e645a90','Patents/Copyrights','917824d2-7713-45b0-8988-0ad18af2fbcb','1021','',NULL,'Active','2022-03-22 18:00:39','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('e6306734-acea-4711-ba67-18302711188f','Acc. Dep. – Land','00827961-53a8-4825-ae4a-8639ab34ad9b','6011','',NULL,'Active','2022-03-22 18:33:42','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('e77371da-e597-46b3-b335-46b5a334c7e3','Taxes & Licenses Payable','215320f4-8753-48f4-894f-0ba0798a8e8b','2005','',NULL,'Active','2022-03-22 18:05:56','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('e9d9886b-84fc-4533-a10b-9d153a7967f6','Rent Expense','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5041','',NULL,'Active','2022-03-22 18:29:21','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('eb547251-baa8-4839-afd1-1f77860f186a','Deferred Revenue','215320f4-8753-48f4-894f-0ba0798a8e8b','2003','',NULL,'Active','2022-03-22 18:05:22','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('ec3ebb28-b863-4f3e-bd47-7fea51eb4407','Assistance & Subsidy','e7db9b47-a012-42d7-a1ba-71122ff63bec','4007','',NULL,'Active','2022-03-22 18:14:12','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('f2d63f03-0fab-4bf3-8acb-b709a11499ff','Bonds Payable','215320f4-8753-48f4-894f-0ba0798a8e8b','2006','',NULL,'Active','2022-03-22 18:06:12','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('f364ca08-0221-46d1-bb60-55c4c49b890e','Dental Supplies','917824d2-7713-45b0-8988-0ad18af2fbcb','1009','',NULL,'Active','2022-03-22 17:52:01','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('f40ca716-2b82-4350-8496-7e2b1b52aece','Program Expense','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5019','',NULL,'Active','2022-03-22 18:22:43','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('f779c049-2409-484b-a6b5-4e97cf7ffe8d','Loans Payable','215320f4-8753-48f4-894f-0ba0798a8e8b','2014','',NULL,'Active','2022-03-22 18:08:32','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('f8e95f89-5573-4925-80e6-ead1a7f08294','Benefits Payable','215320f4-8753-48f4-894f-0ba0798a8e8b','2011','',NULL,'Active','2022-03-22 18:07:29','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('f9268d25-73ca-4fcc-8cf7-2ccd1514082d','Utilities Payable','215320f4-8753-48f4-894f-0ba0798a8e8b','2004','',NULL,'Active','2022-03-22 18:05:38','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('f9f4387d-357a-479a-aa73-1b4f8a947dfc','Other Receivables','917824d2-7713-45b0-8988-0ad18af2fbcb','1014','',NULL,'Active','2022-03-22 17:58:19','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('fb4bcf30-2f72-4f23-8d58-4247ae443b81','Prepayment For Operating Expenses','917824d2-7713-45b0-8988-0ad18af2fbcb','1024','',NULL,'Active','2022-03-22 18:01:40','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('fc01190b-344e-4222-a01c-a8c5ed20ce40','Bad Debts Expense','5bd87e90-1f5e-4c44-afbb-9a9ad8581f33','5037','',NULL,'Active','2022-03-22 18:28:20','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('fd4c187d-d2f0-47a1-a03e-6ec794fa3a5f','Prepaid Expenses','917824d2-7713-45b0-8988-0ad18af2fbcb','1028','',NULL,'Active','2022-03-22 18:02:45','2022-08-31 06:05:21','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('feebafe1-e8a8-4d07-bb39-969935102420','Purchase Orders Payable','215320f4-8753-48f4-894f-0ba0798a8e8b','2017','',NULL,'Active','2022-09-02 11:03:41','2022-09-02 11:03:41','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL);
/*!40000 ALTER TABLE `chart_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_sources`
--

DROP TABLE IF EXISTS `data_sources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_sources` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `endpoint` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `data_sources_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `data_sources_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_sources`
--

LOCK TABLES `data_sources` WRITE;
/*!40000 ALTER TABLE `data_sources` DISABLE KEYS */;
INSERT INTO `data_sources` VALUES ('0df1781b-7723-46cf-9bbd-a49f84487068','Purchase Order Vendor Payment','/general_ledger/accountant/data_source/transaction_table/Purchase_order_vendor_payment','','Active','2022-09-03 05:06:12','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('16892c9c-114e-4fa7-9fa0-5c70d3007c95','Sales','/general_ledger/accountant/data_source/transaction_table/Sales','','Active','2022-09-03 05:07:42','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('16bd04fc-9eb9-449d-b298-21e0c2b7675a','Inpatient Room Payment','/general_ledger/accountant/data_source/transaction_table/Inpatient_room_payment','','Active','2022-09-03 05:05:32','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('1dea9f20-473e-46d4-a0e1-7bf23fa4531d','Room Bill','/general_ledger/accountant/data_source/transaction_table/Room_bill','','Active','2022-09-03 05:05:19','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('206b9eb8-7429-45e8-a1b6-aee34d8cfd3d','Purchase Order Payment','/general_ledger/accountant/data_source/transaction_table/Purchase_order_payment','','Active','2022-09-03 05:06:59','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('24777423-ef07-4b82-9e72-7add01b5f407','Outpatient Lab Request Payment','/general_ledger/accountant/data_source/transaction_table/Outpatient_lab_request_payment','','Active','2022-09-03 05:03:34','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('3a9ff516-1405-4e5a-b4a7-8833adb874bb','Deposit','/general_ledger/accountant/data_source/transaction_table/Deposit','','Active','2022-09-03 05:07:25','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('3f9a4be7-348c-4723-b2bd-933ad883035c','Treatment Bill','/general_ledger/accountant/data_source/transaction_table/Treatment_bill','','Active','2022-09-03 05:03:54','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('410c1e0a-50d0-4b1c-b271-77001d966781','Inpatient Surgery Payment','/general_ledger/accountant/data_source/transaction_table/Inpatient_surgery_payment','','Active','2022-09-03 05:05:03','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('54ce7f68-5c99-4c4e-9eac-51242fdcb5ee','Inpatient Treatment Payment','/general_ledger/accountant/data_source/transaction_table/Inpatient_treatment_payment','','Active','2022-09-03 05:04:17','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('54fae6e0-2ce5-4908-8232-467fc53c2848','Outpatient Treatment Payment','/general_ledger/accountant/data_source/transaction_table/Outpatient_treatment_payment','','Active','2022-09-03 05:04:32','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('6b391589-7818-4419-96a3-d6414d401afc','Purchase Order Bill','/general_ledger/accountant/data_source/transaction_table/Purchase_order_bill','','Active','2022-09-03 05:06:30','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('763da8d5-2bb5-497d-af58-3f90352fe68c','Purchase Order Vendor Bill','/general_ledger/accountant/data_source/transaction_table/Purchase_order_vendor_bill','','Active','2022-09-03 05:05:51','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('a1ad523a-dba9-4acf-aa6e-f7f1e559fab4','Ar Utilities','/general_ledger/accountant/data_source/transaction_table/AR_Utilities','','Active','2022-09-03 05:07:10','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('a3938c8d-4c8a-47a5-97e7-5faa66c2add6','Surgery Bill','/general_ledger/accountant/data_source/transaction_table/Surgery_bill','','Active','2022-09-03 05:04:44','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('b4eddf0c-64c7-456c-beb0-9e693abaefc9','Prescription Bill','/general_ledger/accountant/data_source/transaction_table/Prescription_bill','','Active','2022-09-03 05:01:51','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('c5aa2dee-0095-4858-92be-f00b69e2f034','Inpatient Lab Request Payment','/general_ledger/accountant/data_source/transaction_table/Inpatient_lab_request_payment','','Active','2022-09-03 05:03:12','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('cb7a83a5-7460-4074-bb09-b6db6fa0bce6','Withdrawal','/general_ledger/accountant/data_source/transaction_table/Withdrawal','','Active','2022-09-03 05:07:33','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('cecea5c3-4774-48ae-be70-403586f8d699','Inpatient Prescription Payment','/general_ledger/accountant/data_source/transaction_table/Inpatient_prescription_payment','','Active','2022-09-03 05:02:11','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('da410a54-8b8b-42e9-bf6a-6c794a541e8a','Bank Account','/general_ledger/accountant/data_source/transaction_table/Bank_account','','Active','2022-09-03 05:01:17','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL),('fad9e9af-dc64-4140-910e-7e11c04b2b3f','Lab Request Bill','/general_ledger/accountant/data_source/transaction_table/Lab_request_bill','','Active','2022-09-03 05:02:28','2022-09-03 07:48:52','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL);
/*!40000 ALTER TABLE `data_sources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` char(36) NOT NULL,
  `main_department_name` char(36) DEFAULT NULL,
  `main_department_desc` text,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `departments_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES ('DEPT-001','Accounting Department','It is responsible for billings, payroll, cost accounting, the production of financial statements, paying suppliers, and similar activities.','Active',NULL,'2021-11-18 21:32:29',NULL,NULL),('DEPT-002','ICU','A special department of a hospital or health care facility that provides intensive treatment medicine and caters to patients with severe and life-threatening illnesses and injuries, which require constant, close monitoring and support from specialist equipment and medications.','Active',NULL,'2021-11-18 21:32:29',NULL,NULL),('DEPT-003','Human Resources','Role is to provide a professional, efficient and customer focused service to managers and staff and in turn facilitate the delivery of a professional, efficient and customer focused service to patients.','Active',NULL,'2021-11-18 21:32:29',NULL,NULL),('DEPT-004','Dermatology','The Department of Dermatology offers a comprehensive array of services with state-of-the-art aesthetic and therapeutic skin care devices and treatment protocols for adult and pediatric patients of all skin types.','Active',NULL,'2021-11-18 21:32:29',NULL,NULL);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deposits`
--

DROP TABLE IF EXISTS `deposits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deposits` (
  `id` char(36) NOT NULL,
  `bank_account_id` char(36) NOT NULL,
  `deposit_no` varchar(255) NOT NULL,
  `amount` float NOT NULL,
  `description` text NOT NULL,
  `date_of_deposit` date NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `deposit_no` (`deposit_no`),
  KEY `bank_account_id` (`bank_account_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `deposits_ibfk_1` FOREIGN KEY (`bank_account_id`) REFERENCES `bank_accounts` (`id`),
  CONSTRAINT `deposits_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `deposits_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deposits`
--

LOCK TABLES `deposits` WRITE;
/*!40000 ALTER TABLE `deposits` DISABLE KEYS */;
/*!40000 ALTER TABLE `deposits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discharges`
--

DROP TABLE IF EXISTS `discharges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discharges` (
  `id` char(36) NOT NULL,
  `discharge_no` varchar(255) NOT NULL,
  `inpatient_id` char(36) NOT NULL,
  `discharge_date` datetime NOT NULL,
  `discharge_diagnosis` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `inpatient_id` (`inpatient_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `discharges_ibfk_1` FOREIGN KEY (`inpatient_id`) REFERENCES `inpatients` (`id`),
  CONSTRAINT `discharges_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `discharges_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discharges`
--

LOCK TABLES `discharges` WRITE;
/*!40000 ALTER TABLE `discharges` DISABLE KEYS */;
/*!40000 ALTER TABLE `discharges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discount_privileges`
--

DROP TABLE IF EXISTS `discount_privileges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount_privileges` (
  `id` char(36) NOT NULL,
  `patient_id` char(36) DEFAULT NULL,
  `phil_health_id` varchar(255) DEFAULT NULL,
  `end_of_validity` date DEFAULT NULL,
  `senior_citizen_id` varchar(255) DEFAULT NULL,
  `municipality` varchar(255) DEFAULT NULL,
  `pwd_id` varchar(255) DEFAULT NULL,
  `type_of_disability` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `discount_privileges_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`),
  CONSTRAINT `discount_privileges_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `discount_privileges_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_privileges`
--

LOCK TABLES `discount_privileges` WRITE;
/*!40000 ALTER TABLE `discount_privileges` DISABLE KEYS */;
/*!40000 ALTER TABLE `discount_privileges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_types`
--

DROP TABLE IF EXISTS `employee_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_types` (
  `id` char(36) NOT NULL,
  `employee_type` varchar(15) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `updated_by` (`updated_by`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `employee_types_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`),
  CONSTRAINT `employee_types_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_types`
--

LOCK TABLES `employee_types` WRITE;
/*!40000 ALTER TABLE `employee_types` DISABLE KEYS */;
INSERT INTO `employee_types` VALUES ('EMPTYPE-001','Full-time','Active',NULL,'2021-11-18 22:00:37',NULL,NULL),('EMPTYPE-002','Part-time','Active',NULL,'2021-11-18 22:00:37',NULL,NULL);
/*!40000 ALTER TABLE `employee_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` char(60) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `extension_name` varchar(255) DEFAULT NULL,
  `birth_date` date NOT NULL,
  `gender` varchar(255) NOT NULL,
  `civil_status` varchar(255) NOT NULL DEFAULT 'Active',
  `house_number` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `barangay` varchar(255) DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `region` varchar(255) NOT NULL,
  `zip_code` char(4) NOT NULL,
  `contact_number` char(11) NOT NULL,
  `job_id` char(36) DEFAULT NULL,
  `department_id` char(36) DEFAULT NULL,
  `employee_type_id` char(36) DEFAULT NULL,
  `leave_balance` smallint DEFAULT '0',
  `hire_date` date NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_employees_contact_number` (`contact_number`),
  KEY `ix_employees_id` (`id`),
  KEY `job_id` (`job_id`),
  KEY `department_id` (`department_id`),
  KEY `employee_type_id` (`employee_type_id`),
  KEY `updated_by` (`updated_by`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`),
  CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `employees_ibfk_3` FOREIGN KEY (`employee_type_id`) REFERENCES `employee_types` (`id`),
  CONSTRAINT `employees_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`),
  CONSTRAINT `employees_ibfk_5` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES ('EMP-001','photo','Angeline','T.','Balbarino',NULL,'2000-08-01','Female','Single','Blk 44 Lot 9','Sampaloc','Brgy 178','Caloocan','Metro Manila','NCR','','','JOB-001','DEPT-001','EMPTYPE-001',0,'2022-03-05','Active',NULL,'2022-03-05 13:23:43',NULL,NULL),('EMP-002','photo','Lucia','','Pacioli',NULL,'1497-08-01','Male','Single','Blk 44 Lot 9','Sampaloc','Brgy 178','Caloocan','Metro Manila','NCR','','09123412567','JOB-001','DEPT-001','EMPTYPE-001',0,'2022-03-05','Active',NULL,'2022-03-05 13:23:43',NULL,NULL),('EMP-003','photo','Vicky','','Belo',NULL,'1497-08-01','Female','Single','Blk 44 Lot 9','Sampaloc','Brgy 178','Caloocan','Metro Manila','NCR','','09123412565','JOB-002','DEPT-004','EMPTYPE-001',0,'2022-03-05','Active',NULL,'2022-03-05 13:23:43',NULL,NULL),('EMP-004','photo','Willie','','Ong',NULL,'1497-08-01','Male','Single','Blk 44 Lot 9','Sampaloc','Brgy 178','Caloocan','Metro Manila','NCR','','09123412564','JOB-002','DEPT-002','EMPTYPE-001',0,'2022-03-05','Active',NULL,'2022-03-05 13:23:43',NULL,NULL);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospital_cash_payments`
--

DROP TABLE IF EXISTS `hospital_cash_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hospital_cash_payments` (
  `id` char(36) NOT NULL,
  `cash_payment_no` varchar(255) NOT NULL,
  `amount` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cash_payment_no` (`cash_payment_no`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `hospital_cash_payments_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `hospital_cash_payments_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospital_cash_payments`
--

LOCK TABLES `hospital_cash_payments` WRITE;
/*!40000 ALTER TABLE `hospital_cash_payments` DISABLE KEYS */;
INSERT INTO `hospital_cash_payments` VALUES ('6f9cf3e2-94be-466e-9684-3e2fadc13a6c','POP-CP-81295',12000,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2022-03-05 13:16:41',NULL,NULL);
/*!40000 ALTER TABLE `hospital_cash_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospital_check_payments`
--

DROP TABLE IF EXISTS `hospital_check_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hospital_check_payments` (
  `id` char(36) NOT NULL,
  `check_no` varchar(255) NOT NULL,
  `check_date` date NOT NULL,
  `account_name` varchar(255) NOT NULL,
  `account_no` varchar(255) NOT NULL,
  `rt_number` varchar(255) NOT NULL,
  `payee_name` varchar(255) NOT NULL,
  `amount` float NOT NULL,
  `bank_name` varchar(255) NOT NULL,
  `bank_address` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `check_status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `check_no` (`check_no`),
  UNIQUE KEY `rt_number` (`rt_number`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `hospital_check_payments_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `hospital_check_payments_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospital_check_payments`
--

LOCK TABLES `hospital_check_payments` WRITE;
/*!40000 ALTER TABLE `hospital_check_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `hospital_check_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inpatient_bills`
--

DROP TABLE IF EXISTS `inpatient_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inpatient_bills` (
  `id` char(36) NOT NULL,
  `inpatient_id` char(36) NOT NULL,
  `inpatient_bill_no` varchar(255) NOT NULL,
  `total_professional_fee` float NOT NULL,
  `total_lab_test_fee` float NOT NULL,
  `total_prescription_fee` float NOT NULL,
  `total_treatment_fee` float NOT NULL,
  `total_surgery_fee` float NOT NULL,
  `total_room_fee` float NOT NULL,
  `total_discounts` float NOT NULL,
  `total_bill` float NOT NULL,
  `remaining_balance` float NOT NULL DEFAULT '0',
  `date_of_billing` date NOT NULL,
  `due_date` date NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `inpatient_bill_no` (`inpatient_bill_no`),
  KEY `inpatient_id` (`inpatient_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `inpatient_bills_ibfk_1` FOREIGN KEY (`inpatient_id`) REFERENCES `inpatients` (`id`),
  CONSTRAINT `inpatient_bills_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `inpatient_bills_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inpatient_bills`
--

LOCK TABLES `inpatient_bills` WRITE;
/*!40000 ALTER TABLE `inpatient_bills` DISABLE KEYS */;
INSERT INTO `inpatient_bills` VALUES ('INPATIENTBILL-001','INPATIENT-001','INPATIENTBILL01',3000,200,550,1000,45000,25000,0,74750,74750,'2021-11-18','2021-12-18','Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-18 23:21:50','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:05:37'),('INPATIENTBILL-002','INPATIENT-002','INPATIENTBILL02',4000,200,1200,15000,44500,37500,0,102400,102400,'2021-11-01','2021-11-06','Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:23:51','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:16:16'),('INPATIENTBILL-003','INPATIENT-003','INPATIENTBILL03',10000,550,1000,10800,80000,50000,0,152350,152350,'2021-12-16','2022-01-16','Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:23:51','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:16:16'),('INPATIENTBILL-004','INPATIENT-004','INPATIENTBILL04',6000,300,500,3000,8400,30000,0,48200,48200,'2021-12-01','2021-12-15','Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:23:51','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:16:16');
/*!40000 ALTER TABLE `inpatient_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inpatient_lab_request_payments`
--

DROP TABLE IF EXISTS `inpatient_lab_request_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inpatient_lab_request_payments` (
  `id` char(36) NOT NULL,
  `or_no` varchar(255) NOT NULL,
  `lab_request_bill_id` char(36) NOT NULL,
  `inpatient_payment_id` char(36) NOT NULL,
  `patient_cash_payment_id` char(36) DEFAULT NULL,
  `patient_check_payment_id` char(36) DEFAULT NULL,
  `payment_method_id` char(36) NOT NULL,
  `amount_paid` float NOT NULL,
  `date_of_payment` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `or_no` (`or_no`),
  KEY `lab_request_bill_id` (`lab_request_bill_id`),
  KEY `inpatient_payment_id` (`inpatient_payment_id`),
  KEY `patient_cash_payment_id` (`patient_cash_payment_id`),
  KEY `patient_check_payment_id` (`patient_check_payment_id`),
  KEY `payment_method_id` (`payment_method_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `inpatient_lab_request_payments_ibfk_1` FOREIGN KEY (`lab_request_bill_id`) REFERENCES `lab_request_bills` (`id`),
  CONSTRAINT `inpatient_lab_request_payments_ibfk_2` FOREIGN KEY (`inpatient_payment_id`) REFERENCES `inpatient_payments` (`id`),
  CONSTRAINT `inpatient_lab_request_payments_ibfk_3` FOREIGN KEY (`patient_cash_payment_id`) REFERENCES `patient_cash_payments` (`id`),
  CONSTRAINT `inpatient_lab_request_payments_ibfk_4` FOREIGN KEY (`patient_check_payment_id`) REFERENCES `patient_check_payments` (`id`),
  CONSTRAINT `inpatient_lab_request_payments_ibfk_5` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`),
  CONSTRAINT `inpatient_lab_request_payments_ibfk_6` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `inpatient_lab_request_payments_ibfk_7` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inpatient_lab_request_payments`
--

LOCK TABLES `inpatient_lab_request_payments` WRITE;
/*!40000 ALTER TABLE `inpatient_lab_request_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `inpatient_lab_request_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inpatient_payments`
--

DROP TABLE IF EXISTS `inpatient_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inpatient_payments` (
  `id` char(36) NOT NULL,
  `or_no` varchar(255) NOT NULL,
  `inpatient_bill_id` char(36) NOT NULL,
  `total_amount_paid` float NOT NULL,
  `payment_term_id` char(36) NOT NULL,
  `date_of_payment` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `patient_cash_payment_id` char(36) DEFAULT NULL,
  `patient_check_payment_id` char(36) DEFAULT NULL,
  `payment_method_id` char(36) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `or_no` (`or_no`),
  KEY `inpatient_bill_id` (`inpatient_bill_id`),
  KEY `payment_term_id` (`payment_term_id`),
  KEY `patient_cash_payment_id` (`patient_cash_payment_id`),
  KEY `patient_check_payment_id` (`patient_check_payment_id`),
  KEY `payment_method_id` (`payment_method_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `inpatient_payments_ibfk_1` FOREIGN KEY (`inpatient_bill_id`) REFERENCES `inpatient_bills` (`id`),
  CONSTRAINT `inpatient_payments_ibfk_2` FOREIGN KEY (`payment_term_id`) REFERENCES `payment_terms` (`id`),
  CONSTRAINT `inpatient_payments_ibfk_3` FOREIGN KEY (`patient_cash_payment_id`) REFERENCES `patient_cash_payments` (`id`),
  CONSTRAINT `inpatient_payments_ibfk_4` FOREIGN KEY (`patient_check_payment_id`) REFERENCES `patient_check_payments` (`id`),
  CONSTRAINT `inpatient_payments_ibfk_5` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`),
  CONSTRAINT `inpatient_payments_ibfk_6` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `inpatient_payments_ibfk_7` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inpatient_payments`
--

LOCK TABLES `inpatient_payments` WRITE;
/*!40000 ALTER TABLE `inpatient_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `inpatient_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inpatient_prescription_payments`
--

DROP TABLE IF EXISTS `inpatient_prescription_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inpatient_prescription_payments` (
  `id` char(36) NOT NULL,
  `or_no` varchar(255) NOT NULL,
  `prescription_bill_id` char(36) NOT NULL,
  `inpatient_payment_id` char(36) NOT NULL,
  `patient_cash_payment_id` char(36) DEFAULT NULL,
  `patient_check_payment_id` char(36) DEFAULT NULL,
  `payment_method_id` char(36) NOT NULL,
  `amount_paid` float NOT NULL,
  `date_of_payment` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `or_no` (`or_no`),
  KEY `prescription_bill_id` (`prescription_bill_id`),
  KEY `inpatient_payment_id` (`inpatient_payment_id`),
  KEY `patient_cash_payment_id` (`patient_cash_payment_id`),
  KEY `patient_check_payment_id` (`patient_check_payment_id`),
  KEY `payment_method_id` (`payment_method_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `inpatient_prescription_payments_ibfk_1` FOREIGN KEY (`prescription_bill_id`) REFERENCES `prescription_bills` (`id`),
  CONSTRAINT `inpatient_prescription_payments_ibfk_2` FOREIGN KEY (`inpatient_payment_id`) REFERENCES `inpatient_payments` (`id`),
  CONSTRAINT `inpatient_prescription_payments_ibfk_3` FOREIGN KEY (`patient_cash_payment_id`) REFERENCES `patient_cash_payments` (`id`),
  CONSTRAINT `inpatient_prescription_payments_ibfk_4` FOREIGN KEY (`patient_check_payment_id`) REFERENCES `patient_check_payments` (`id`),
  CONSTRAINT `inpatient_prescription_payments_ibfk_5` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`),
  CONSTRAINT `inpatient_prescription_payments_ibfk_6` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `inpatient_prescription_payments_ibfk_7` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inpatient_prescription_payments`
--

LOCK TABLES `inpatient_prescription_payments` WRITE;
/*!40000 ALTER TABLE `inpatient_prescription_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `inpatient_prescription_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inpatient_room_payments`
--

DROP TABLE IF EXISTS `inpatient_room_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inpatient_room_payments` (
  `id` char(36) NOT NULL,
  `or_no` varchar(255) NOT NULL,
  `room_bill_id` char(36) NOT NULL,
  `inpatient_payment_id` char(36) NOT NULL,
  `patient_cash_payment_id` char(36) DEFAULT NULL,
  `patient_check_payment_id` char(36) DEFAULT NULL,
  `payment_method_id` char(36) NOT NULL,
  `amount_paid` float NOT NULL,
  `date_of_payment` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `or_no` (`or_no`),
  KEY `room_bill_id` (`room_bill_id`),
  KEY `inpatient_payment_id` (`inpatient_payment_id`),
  KEY `patient_cash_payment_id` (`patient_cash_payment_id`),
  KEY `patient_check_payment_id` (`patient_check_payment_id`),
  KEY `payment_method_id` (`payment_method_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `inpatient_room_payments_ibfk_1` FOREIGN KEY (`room_bill_id`) REFERENCES `room_bills` (`id`),
  CONSTRAINT `inpatient_room_payments_ibfk_2` FOREIGN KEY (`inpatient_payment_id`) REFERENCES `inpatient_payments` (`id`),
  CONSTRAINT `inpatient_room_payments_ibfk_3` FOREIGN KEY (`patient_cash_payment_id`) REFERENCES `patient_cash_payments` (`id`),
  CONSTRAINT `inpatient_room_payments_ibfk_4` FOREIGN KEY (`patient_check_payment_id`) REFERENCES `patient_check_payments` (`id`),
  CONSTRAINT `inpatient_room_payments_ibfk_5` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`),
  CONSTRAINT `inpatient_room_payments_ibfk_6` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `inpatient_room_payments_ibfk_7` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inpatient_room_payments`
--

LOCK TABLES `inpatient_room_payments` WRITE;
/*!40000 ALTER TABLE `inpatient_room_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `inpatient_room_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inpatient_surgery_payments`
--

DROP TABLE IF EXISTS `inpatient_surgery_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inpatient_surgery_payments` (
  `id` char(36) NOT NULL,
  `or_no` varchar(255) NOT NULL,
  `surgery_bill_id` char(36) NOT NULL,
  `inpatient_payment_id` char(36) NOT NULL,
  `patient_cash_payment_id` char(36) DEFAULT NULL,
  `patient_check_payment_id` char(36) DEFAULT NULL,
  `payment_method_id` char(36) NOT NULL,
  `amount_paid` float NOT NULL,
  `date_of_payment` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `or_no` (`or_no`),
  KEY `surgery_bill_id` (`surgery_bill_id`),
  KEY `inpatient_payment_id` (`inpatient_payment_id`),
  KEY `patient_cash_payment_id` (`patient_cash_payment_id`),
  KEY `patient_check_payment_id` (`patient_check_payment_id`),
  KEY `payment_method_id` (`payment_method_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `inpatient_surgery_payments_ibfk_1` FOREIGN KEY (`surgery_bill_id`) REFERENCES `surgery_bills` (`id`),
  CONSTRAINT `inpatient_surgery_payments_ibfk_2` FOREIGN KEY (`inpatient_payment_id`) REFERENCES `inpatient_payments` (`id`),
  CONSTRAINT `inpatient_surgery_payments_ibfk_3` FOREIGN KEY (`patient_cash_payment_id`) REFERENCES `patient_cash_payments` (`id`),
  CONSTRAINT `inpatient_surgery_payments_ibfk_4` FOREIGN KEY (`patient_check_payment_id`) REFERENCES `patient_check_payments` (`id`),
  CONSTRAINT `inpatient_surgery_payments_ibfk_5` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`),
  CONSTRAINT `inpatient_surgery_payments_ibfk_6` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `inpatient_surgery_payments_ibfk_7` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inpatient_surgery_payments`
--

LOCK TABLES `inpatient_surgery_payments` WRITE;
/*!40000 ALTER TABLE `inpatient_surgery_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `inpatient_surgery_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inpatient_treatment_payments`
--

DROP TABLE IF EXISTS `inpatient_treatment_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inpatient_treatment_payments` (
  `id` char(36) NOT NULL,
  `or_no` varchar(255) NOT NULL,
  `treatment_bill_id` char(36) NOT NULL,
  `inpatient_payment_id` char(36) NOT NULL,
  `patient_cash_payment_id` char(36) DEFAULT NULL,
  `patient_check_payment_id` char(36) DEFAULT NULL,
  `payment_method_id` char(36) NOT NULL,
  `amount_paid` float NOT NULL,
  `date_of_payment` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `or_no` (`or_no`),
  KEY `treatment_bill_id` (`treatment_bill_id`),
  KEY `inpatient_payment_id` (`inpatient_payment_id`),
  KEY `patient_cash_payment_id` (`patient_cash_payment_id`),
  KEY `patient_check_payment_id` (`patient_check_payment_id`),
  KEY `payment_method_id` (`payment_method_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `inpatient_treatment_payments_ibfk_1` FOREIGN KEY (`treatment_bill_id`) REFERENCES `treatment_bills` (`id`),
  CONSTRAINT `inpatient_treatment_payments_ibfk_2` FOREIGN KEY (`inpatient_payment_id`) REFERENCES `inpatient_payments` (`id`),
  CONSTRAINT `inpatient_treatment_payments_ibfk_3` FOREIGN KEY (`patient_cash_payment_id`) REFERENCES `patient_cash_payments` (`id`),
  CONSTRAINT `inpatient_treatment_payments_ibfk_4` FOREIGN KEY (`patient_check_payment_id`) REFERENCES `patient_check_payments` (`id`),
  CONSTRAINT `inpatient_treatment_payments_ibfk_5` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`),
  CONSTRAINT `inpatient_treatment_payments_ibfk_6` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `inpatient_treatment_payments_ibfk_7` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inpatient_treatment_payments`
--

LOCK TABLES `inpatient_treatment_payments` WRITE;
/*!40000 ALTER TABLE `inpatient_treatment_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `inpatient_treatment_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inpatients`
--

DROP TABLE IF EXISTS `inpatients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inpatients` (
  `id` char(36) NOT NULL,
  `inpatient_no` varchar(255) NOT NULL,
  `patient_id` char(36) NOT NULL,
  `date_admitted` date NOT NULL,
  `reason_admittance` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `diagnosis` varchar(255) NOT NULL,
  `tests` varchar(255) DEFAULT NULL,
  `treatment` varchar(255) DEFAULT NULL,
  `surgery` varchar(255) DEFAULT NULL,
  `patient_status` varchar(255) NOT NULL DEFAULT 'Admitted',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `inpatients_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`),
  CONSTRAINT `inpatients_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `inpatients_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inpatients`
--

LOCK TABLES `inpatients` WRITE;
/*!40000 ALTER TABLE `inpatients` DISABLE KEYS */;
INSERT INTO `inpatients` VALUES ('INPATIENT-001','INPATIENT01','PATIENT-001','2021-11-17','Heart Attack','Ewan',' Coronary artery disease','Secret','Secret','Secret','Admitted','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-18 23:19:47',NULL,NULL),('INPATIENT-002','INPATIENT02','PATIENT-002','2021-11-01','Idk','Idk','Cancer','Secret','Srecte','Secret','Admitted','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:22:20',NULL,NULL),('INPATIENT-003','INPATIENT03','PATIENT-005','2021-11-01','reason','department','diagnosis','test','treatment','surgery','Admitted','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:22:20',NULL,NULL),('INPATIENT-004','INPATIENT04','PATIENT-006','2021-11-01','reason','department','diagnosis','test','treatment','surgery','Admitted','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:22:20',NULL,NULL),('INPATIENT-005','INPATIENT05','PATIENT-007','2022-01-05','reason','department','diagnosis','test','treatment','surgery','Admitted','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:22:20',NULL,NULL);
/*!40000 ALTER TABLE `inpatients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` char(36) NOT NULL,
  `job_title` varchar(40) DEFAULT NULL,
  `job_desc` text,
  `sub_department_id` char(36) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `updated_by` (`updated_by`),
  KEY `sub_department_id` (`sub_department_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`),
  CONSTRAINT `jobs_ibfk_2` FOREIGN KEY (`sub_department_id`) REFERENCES `sub_departments` (`id`),
  CONSTRAINT `jobs_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES ('JOB-001','Accountant','An accountant is a professional who is responsible for keeping and interpreting financial records.',NULL,'Active',NULL,'2021-11-18 21:53:18',NULL,NULL),('JOB-002','Doctor','A qualified practitioner of medicine; a physician.',NULL,'Active',NULL,'2021-11-18 21:53:18',NULL,NULL),('JOB-003','Nurse','A person trained to care for the sick or infirm, especially in a hospital.',NULL,'Active',NULL,'2021-11-18 21:53:18',NULL,NULL);
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `journal_accounts`
--

DROP TABLE IF EXISTS `journal_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `journal_accounts` (
  `id` char(36) NOT NULL,
  `account_title` char(36) DEFAULT NULL,
  `pr` varchar(255) NOT NULL,
  `debit` decimal(13,2) NOT NULL DEFAULT '0.00',
  `credit` decimal(13,2) NOT NULL DEFAULT '0.00',
  `is_adjustable` tinyint(1) NOT NULL DEFAULT '0',
  `salvage_value` decimal(13,2) NOT NULL DEFAULT '0.00',
  `useful_life` int NOT NULL DEFAULT '0',
  `rate` int NOT NULL DEFAULT '0',
  `month_no` int NOT NULL DEFAULT '0',
  `interest` decimal(13,2) NOT NULL DEFAULT '0.00',
  `is_interest_adjustable` tinyint(1) NOT NULL DEFAULT '0',
  `balance` decimal(13,2) NOT NULL DEFAULT '0.00',
  `journal_entry` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `account_title` (`account_title`),
  KEY `journal_entry` (`journal_entry`),
  CONSTRAINT `journal_accounts_ibfk_1` FOREIGN KEY (`account_title`) REFERENCES `chart_accounts` (`id`),
  CONSTRAINT `journal_accounts_ibfk_2` FOREIGN KEY (`journal_entry`) REFERENCES `journal_entries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_accounts`
--

LOCK TABLES `journal_accounts` WRITE;
/*!40000 ALTER TABLE `journal_accounts` DISABLE KEYS */;
INSERT INTO `journal_accounts` VALUES ('0342bd22-924e-4d24-89d4-5a95f4a4f33d','1bb53f4d-b6a1-4d34-9d5a-d946c49809b6','2008',0.00,16.67,0,0.00,0,0,0,0.00,0,16.67,'450130c3-d780-44c0-9550-b8266f913fde'),('04b52dfe-dda5-4ffe-8dff-4479fee91533','22f6b4c5-f2cd-4398-b3fd-b639f2c10689','2001',0.00,1000.00,1,0.00,0,0,0,0.00,0,1000.00,'bcd2b28d-bfae-4325-a8fb-8e86b5b3dd7f'),('0526abd3-b2be-4d75-99aa-434332cf64d5','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',0.00,420000.00,0,0.00,0,0,0,0.00,0,420000.00,'cfeddd6e-5693-42c8-a855-ba0f78e3c6ef'),('059d2f13-1b76-487d-a059-e689f4578b0d','e9d9886b-84fc-4533-a10b-9d153a7967f6','5041',4000.00,0.00,0,0.00,0,0,0,0.00,0,4000.00,'77e3e97d-97dd-4875-a7d7-306a7cc71a0e'),('060f0a47-980e-48b5-b432-67488a5d0d3d','22f6b4c5-f2cd-4398-b3fd-b639f2c10689','2001',0.00,1000.00,1,0.00,0,0,0,0.00,0,1000.00,'fdaa5621-e4be-43f3-8b9d-588a1740ce50'),('079c7b4b-4e53-47d8-9ad6-a58d810abe24','9b0aa0e8-b4fe-43c9-add7-af39d61e194f','2002',0.00,2000.00,1,0.00,0,10,12,0.00,1,2000.00,'bcd2b28d-bfae-4325-a8fb-8e86b5b3dd7f'),('08121448-8d60-4a80-8fe3-314ae83754fe','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',0.00,8000.00,0,0.00,0,0,0,0.00,0,8000.00,'8312a1eb-6847-4309-9609-c64725c3b6b9'),('0a9f4e1f-9277-4466-a1c5-f686a30b319a','1fec3e76-045a-494a-9596-33970c655e1e','5032',6600.00,0.00,0,0.00,0,0,0,0.00,0,6600.00,'fc1b3cc4-afdb-4c9f-ab5c-e08e8ae363c8'),('0bc619e3-3f85-4107-bf85-af24a862259a','a69edf35-734c-4c16-909f-93f35d2e232f','1002',0.00,2.00,0,0.00,0,0,0,0.00,0,2.00,'0bebd345-e699-476d-9cbd-2239bc313cf3'),('0e5a3cb5-a84b-4015-acca-9415d2581dfa','a97ceef9-75ce-45ab-9042-e2fa3520915e','3001',0.00,250000.00,0,0.00,0,0,0,0.00,0,250000.00,'93c60958-104e-4acd-87ed-e9b894f0186b'),('15ddfcb4-ba46-4af3-830b-000f6027daf5','09a91428-b9e5-4b01-8377-27fafc7ff6ab','5022',16.67,0.00,0,0.00,0,0,0,0.00,0,16.67,'8296d68c-d8e2-414b-9fdd-47088cd9d6e8'),('1808ce09-1c89-4c33-9e0e-806d564a9d9e','22f6b4c5-f2cd-4398-b3fd-b639f2c10689','2001',10000.00,0.00,0,0.00,0,0,0,0.00,0,10000.00,'92d16e35-012f-4fb5-a9a0-e240af1b9727'),('1c70424d-579c-48f8-9466-902e6e156386','abb9f105-4909-4715-ae77-f1a1a3fce231','1004',0.00,1.00,0,0.00,0,0,0,0.00,0,1.00,'9e5bddb5-498f-4abd-b91f-a9def7001a93'),('1d12c815-011d-4b8b-a100-aefab2ea198f','85919266-7560-4681-b8fe-aaab6868f6f2','1003',420000.00,0.00,0,0.00,0,0,0,0.00,0,420000.00,'3a418191-5ff9-494a-bc3e-aa6339d5151b'),('1f2cec33-1b55-4db1-abfb-731589a88bb6','9b0aa0e8-b4fe-43c9-add7-af39d61e194f','2002',0.00,2000.00,1,0.00,0,10,12,33.34,1,2000.00,'71dbad62-fa63-4eba-904f-4d9187650c8a'),('200931b5-31a4-4c31-9f6f-63e19f10193a','2c0f5ad8-abab-4dd0-8daf-0491aa59604e','1010',18000.00,0.00,0,0.00,0,0,0,0.00,0,18000.00,'6e014ce6-9aec-4bcb-ae94-b275fd7bbef9'),('20a86262-3e2f-4b4a-99dd-04c8b0940440','9b0aa0e8-b4fe-43c9-add7-af39d61e194f','2002',0.00,2000.00,1,0.00,0,10,12,0.00,1,2000.00,'40267dbf-ffcc-409f-9094-1ce1221617b1'),('21ddf4fd-7acb-4272-b136-c8485c37ea55','09a91428-b9e5-4b01-8377-27fafc7ff6ab','5022',16.67,0.00,0,0.00,0,0,0,0.00,0,16.67,'3db8751e-84ab-43d9-980c-f2b064f26e41'),('230fb81c-7570-4148-9b01-5b9d0ab354d4','623b5fae-85b5-4f85-b542-d2219a5bb548','1030',8000.00,0.00,1,0.00,0,0,0,0.00,0,8000.00,'b57f844e-a016-4f02-8b34-6605aed7a5f2'),('247a5929-ff7b-4668-8db7-fa8270cf2619','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',0.00,8000.00,0,0.00,0,0,0,0.00,0,8000.00,'d568a83c-4d9d-43da-9cc3-3e78d1cbfac5'),('24e3af70-f01c-4dff-8a97-9a30a5d57660','22f6b4c5-f2cd-4398-b3fd-b639f2c10689','2001',0.00,1000.00,1,0.00,0,0,0,0.00,0,1000.00,'28d4c77f-8d4c-474d-9016-d23929218ff7'),('26500f7f-203e-4300-a530-efe13115473e','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',0.00,15000.00,0,0.00,0,0,0,0.00,0,15000.00,'55bd21f6-452a-4dc0-81ad-7c74c658ff26'),('29228791-3826-4ec9-a7fc-db9aa2ef41bb','abb9f105-4909-4715-ae77-f1a1a3fce231','1004',0.00,1.00,0,0.00,0,0,0,0.00,0,1.00,'32d121ca-5cee-4eb9-a8f1-0eeb4c778f25'),('2a39fffb-a219-4bbe-bc25-aa73b79c5027','1bb53f4d-b6a1-4d34-9d5a-d946c49809b6','2008',0.00,16.67,0,0.00,0,0,0,0.00,0,16.67,'4b8996bb-14e1-40db-98e4-f92ee5918dbe'),('2bedf686-e1a7-47ff-9e66-c07f3016d051','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',0.00,14000.00,0,0.00,0,0,0,0.00,0,14000.00,'c9d07e3f-c8a6-4b4c-8cf7-fe013b2b74d4'),('2e40025b-d365-4f5b-bb60-f9a9fe39c447','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',26400.00,0.00,0,0.00,0,0,0,0.00,0,26400.00,'0a515e8a-a52c-4a77-8d72-6bca7eab0a17'),('3130ec56-321f-4676-b838-bda99ad3714c','1bb53f4d-b6a1-4d34-9d5a-d946c49809b6','2008',0.00,16.67,0,0.00,0,0,0,0.00,0,16.67,'dc2d42cd-1964-4b4f-bcea-a8f4ba45c8d1'),('31c1d392-a975-4245-a1f2-873a423e6d03','84412695-be49-4864-af24-097c206e4328','1005',60000.00,0.00,0,0.00,0,0,0,0.00,0,60000.00,'55bd21f6-452a-4dc0-81ad-7c74c658ff26'),('38afba69-d33c-42a6-ac8b-81e8b06c2c33','9b0aa0e8-b4fe-43c9-add7-af39d61e194f','2002',0.00,2000.00,1,0.00,0,10,12,0.00,1,2000.00,'150fc6b8-90f1-4f58-a7da-bbfb438914e3'),('39594017-3e45-4db7-9281-92e112083423','0ad3b4a9-1beb-4c5f-96ae-ee937cb513d1','2010',0.00,1800.00,0,0.00,0,0,0,0.00,0,1800.00,'c4bf9586-b46a-416d-9eb9-22f3de243996'),('3a786f49-a53f-4966-916f-e8a3e2e059d5','1bb53f4d-b6a1-4d34-9d5a-d946c49809b6','2008',0.00,16.67,0,0.00,0,0,0,0.00,0,16.67,'dec4e021-2d68-4a48-b326-e48ebba0494b'),('3c2644c1-9ac3-4cb9-90b6-4813f8586068','1fec3e76-045a-494a-9596-33970c655e1e','5032',7200.00,0.00,0,0.00,0,0,0,0.00,0,7200.00,'6f50b0af-9415-4be6-93fb-18be9cda14c5'),('3db53803-1bbb-48e4-b857-65b97d8da809','623b5fae-85b5-4f85-b542-d2219a5bb548','1030',0.00,4000.00,0,0.00,0,0,0,0.00,0,4000.00,'d95f8bf3-d0b7-4383-8c5a-607784bd1413'),('4017c121-a32c-4031-9c8c-16a6c50e8b41','a69edf35-734c-4c16-909f-93f35d2e232f','1002',0.00,2.00,0,0.00,0,0,0,0.00,0,2.00,'2ccbff37-81d3-40e6-ba05-4f55b6a1583e'),('401a4f8e-23cc-4388-8601-b25796b6a016','a9de521b-499d-431d-8baf-661855618af4','5009',1400.00,0.00,0,0.00,0,0,0,0.00,0,1400.00,'fee13bda-c7c6-450e-801d-c898e495a796'),('41d42a0e-8fa9-4b10-a47a-d927e5339c9a','db33ff11-6b8e-4a64-b2e7-f7105b7da331','1001',1000.00,0.00,0,0.00,0,0,0,0.00,0,1000.00,'91f128f8-90ba-4a0a-bae6-4cfc59677c02'),('4a5b2b2d-b782-4f10-bf39-67d5cf5f02c7','e9d9886b-84fc-4533-a10b-9d153a7967f6','5041',4000.00,0.00,0,0.00,0,0,0,0.00,0,4000.00,'d95f8bf3-d0b7-4383-8c5a-607784bd1413'),('4a83fecf-00d0-4404-8e34-a66e3a23fd3d','22f6b4c5-f2cd-4398-b3fd-b639f2c10689','2001',0.00,1000.00,1,0.00,0,0,0,0.00,0,1000.00,'150fc6b8-90f1-4f58-a7da-bbfb438914e3'),('4b33ea6d-8b8c-4a2c-9eb9-5c7c2b9dd052','a69edf35-734c-4c16-909f-93f35d2e232f','1002',2.00,0.00,1,0.00,0,0,0,0.00,0,2.00,'2ccbff37-81d3-40e6-ba05-4f55b6a1583e'),('4b45852c-7469-47bd-b5e8-7ae1d4ea6dc1','22f6b4c5-f2cd-4398-b3fd-b639f2c10689','2001',0.00,1000.00,1,0.00,0,0,0,0.00,0,1000.00,'3f27b74c-12d9-43ec-a24a-d618fc82e5b9'),('4beb3c53-bc12-4ac6-a13e-96d759dcf7d0','09a91428-b9e5-4b01-8377-27fafc7ff6ab','5022',16.67,0.00,0,0.00,0,0,0,0.00,0,16.67,'dec4e021-2d68-4a48-b326-e48ebba0494b'),('4d583778-08bd-4586-8d62-b289c56a40ef','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',0.00,420000.00,0,0.00,0,0,0,0.00,0,420000.00,'166cd7ca-c30b-4ec4-8a85-e2a6cb061e9a'),('4ec2100b-a837-45ad-ae61-7d63651942c8','30c10774-d0ea-4ea8-a7dc-64d600fb480f','4001',0.00,5300.00,0,0.00,0,0,0,0.00,0,5300.00,'07e392ee-c1b3-4b43-bcb6-cdf9989045cd'),('4f8ae211-bad2-4f98-b69a-da220f72393b','09a91428-b9e5-4b01-8377-27fafc7ff6ab','5022',16.67,0.00,0,0.00,0,0,0,0.00,0,16.67,'450130c3-d780-44c0-9550-b8266f913fde'),('5216abed-b9f3-442a-961d-ecf07f8de037','ad831144-9291-4be2-adf3-8651caabaa2b','5008',3000.00,0.00,0,0.00,0,0,0,0.00,0,3000.00,'790e15e3-874d-4c46-aab1-011a31cda9b6'),('54a9ff8c-c204-406b-8df0-d7a38efc4dc2','85919266-7560-4681-b8fe-aaab6868f6f2','1003',420000.00,0.00,1,84000.00,84,0,0,0.00,0,4000.00,'cfeddd6e-5693-42c8-a855-ba0f78e3c6ef'),('54f42059-5365-485b-9add-f708ed1014a6','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',250000.00,0.00,0,0.00,0,0,0,0.00,0,250000.00,'93c60958-104e-4acd-87ed-e9b894f0186b'),('59e70d8c-0092-4370-ba8a-03dbf13910a8','db33ff11-6b8e-4a64-b2e7-f7105b7da331','1001',1000.00,0.00,0,0.00,0,0,0,0.00,0,1000.00,'28d4c77f-8d4c-474d-9016-d23929218ff7'),('5dd5dc07-c3e9-45dc-bd13-6143bee6ad6c','a69edf35-734c-4c16-909f-93f35d2e232f','1002',2000.00,0.00,0,0.00,0,0,0,0.00,0,2000.00,'bcd2b28d-bfae-4325-a8fb-8e86b5b3dd7f'),('60f3949e-6607-421b-8544-1d66eca40f1c','db33ff11-6b8e-4a64-b2e7-f7105b7da331','1001',1000.00,0.00,0,0.00,0,0,0,0.00,0,1000.00,'3f27b74c-12d9-43ec-a24a-d618fc82e5b9'),('613f9770-e43c-4aac-a589-835318a39b28','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',10000.00,0.00,0,0.00,0,0,0,0.00,0,10000.00,'914ba684-0038-4e5e-9613-d7edb621ead8'),('63a3c286-ea93-400e-a589-79af1c4ace52','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',0.00,420000.00,0,0.00,0,0,0,0.00,0,420000.00,'3a418191-5ff9-494a-bc3e-aa6339d5151b'),('640f43ea-a198-49bf-84c6-9af24d90c72d','db33ff11-6b8e-4a64-b2e7-f7105b7da331','1001',1000.00,0.00,0,0.00,0,0,0,0.00,0,1000.00,'71dbad62-fa63-4eba-904f-4d9187650c8a'),('64d91181-7750-4bf2-aa20-737be3487795','09a91428-b9e5-4b01-8377-27fafc7ff6ab','5022',16.67,0.00,0,0.00,0,0,0,0.00,0,16.67,'4ecd02ad-de00-4ef3-ae75-ab9503a7add2'),('72f487e2-7029-4560-81ca-749da02514f8','623b5fae-85b5-4f85-b542-d2219a5bb548','1030',8000.00,0.00,1,0.00,0,0,0,0.00,0,4000.00,'d568a83c-4d9d-43da-9cc3-3e78d1cbfac5'),('73b02a7d-40c2-4b04-9eef-389a5d778969','623b5fae-85b5-4f85-b542-d2219a5bb548','1030',0.00,4000.00,0,0.00,0,0,0,0.00,0,4000.00,'77e3e97d-97dd-4875-a7d7-306a7cc71a0e'),('77660e08-92a1-4d26-abac-e01fbcb12403','50d572fc-783c-47f4-b2d8-5959b8b04200','1012',0.00,24000.00,0,0.00,0,0,0,0.00,0,24000.00,'484cde37-14d3-4d7b-b193-c066abab9111'),('785a5dec-54e1-4db3-b917-c31e079c822b','22f6b4c5-f2cd-4398-b3fd-b639f2c10689','2001',0.00,1000.00,1,0.00,0,0,0,0.00,0,1000.00,'71dbad62-fa63-4eba-904f-4d9187650c8a'),('7a1108a6-ad91-474f-a96a-ef3d9ab80405','22f6b4c5-f2cd-4398-b3fd-b639f2c10689','2001',0.00,1000.00,1,0.00,0,0,0,0.00,0,1000.00,'91f128f8-90ba-4a0a-bae6-4cfc59677c02'),('7b599b87-db99-4ec3-a54a-e313b47e1bdd','eb547251-baa8-4839-afd1-1f77860f186a','2003',0.00,10000.00,1,0.00,0,0,0,0.00,0,6000.00,'914ba684-0038-4e5e-9613-d7edb621ead8'),('7c14c937-fb58-4e70-95e1-ce883499d331','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',0.00,14400.00,0,0.00,0,0,0,0.00,0,14400.00,'aa6075c0-3a2e-4aec-9ffd-a73119895f72'),('7e4ef57c-dfdb-4850-b718-7d0c9caf060c','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',24000.00,0.00,0,0.00,0,0,0,0.00,0,24000.00,'484cde37-14d3-4d7b-b193-c066abab9111'),('7ea10671-ba7e-4d9d-a191-594930db01c7','22f6b4c5-f2cd-4398-b3fd-b639f2c10689','2001',0.00,45000.00,1,0.00,0,0,0,0.00,0,45000.00,'55bd21f6-452a-4dc0-81ad-7c74c658ff26'),('80411c5c-2a51-4ca9-9c4b-ce1a555f9308','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',0.00,10000.00,0,0.00,0,0,0,0.00,0,10000.00,'92d16e35-012f-4fb5-a9a0-e240af1b9727'),('819a0bd2-ace2-4eb1-872c-52001c3ddb67','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',210000.00,0.00,0,0.00,0,0,0,0.00,0,210000.00,'4f3066cf-1e35-40c6-900a-918c9be4c881'),('85ff655e-fdac-4ac2-b051-47afff5fc4af','09a91428-b9e5-4b01-8377-27fafc7ff6ab','5022',16.67,0.00,0,0.00,0,0,0,0.00,0,16.67,'4b8996bb-14e1-40db-98e4-f92ee5918dbe'),('8879bfff-8f27-477f-8116-559377c5b0e3','a9de521b-499d-431d-8baf-661855618af4','5009',3000.00,0.00,0,0.00,0,0,0,0.00,0,3000.00,'5b055243-e4c1-4b71-b6ee-5ee8fc358542'),('8b16637e-bd2c-4e2b-ba53-b899b6682ca7','a69edf35-734c-4c16-909f-93f35d2e232f','1002',2000.00,0.00,0,0.00,0,0,0,0.00,0,2000.00,'40267dbf-ffcc-409f-9094-1ce1221617b1'),('8ba32711-f998-4e99-bf29-d7a385d01040','30c10774-d0ea-4ea8-a7dc-64d600fb480f','4001',0.00,4000.00,0,0.00,0,0,0,0.00,0,4000.00,'fc984c6e-d244-462d-83fd-d2a27ede1cdc'),('8bb300df-1194-480d-ba99-09c6b8c1f85e','db33ff11-6b8e-4a64-b2e7-f7105b7da331','1001',1000.00,0.00,0,0.00,0,0,0,0.00,0,1000.00,'bcd2b28d-bfae-4325-a8fb-8e86b5b3dd7f'),('8ca95178-ed61-4bf7-b592-62be77c9b89f','9b0aa0e8-b4fe-43c9-add7-af39d61e194f','2002',0.00,2000.00,1,0.00,0,10,12,0.00,1,2000.00,'91f128f8-90ba-4a0a-bae6-4cfc59677c02'),('8fca8d25-dfc3-4519-aef9-b14a898c342f','85919266-7560-4681-b8fe-aaab6868f6f2','1003',420000.00,0.00,0,0.00,0,0,0,0.00,0,420000.00,'166cd7ca-c30b-4ec4-8a85-e2a6cb061e9a'),('91daa731-238b-4d61-90c7-a857dc3d0e64','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',0.00,6600.00,0,0.00,0,0,0,0.00,0,6600.00,'fc1b3cc4-afdb-4c9f-ab5c-e08e8ae363c8'),('927789bb-f202-4cfb-b397-6bab4bb4d1fb','a69edf35-734c-4c16-909f-93f35d2e232f','1002',2000.00,0.00,0,0.00,0,0,0,0.00,0,2000.00,'3f27b74c-12d9-43ec-a24a-d618fc82e5b9'),('934fbf4d-1e6b-41f5-9d43-c99786017334','1bb53f4d-b6a1-4d34-9d5a-d946c49809b6','2008',0.00,3500.00,0,0.00,0,0,0,0.00,0,3500.00,'64ac2704-a4ae-4529-868c-b686b2d4e4fc'),('9567c1e4-f95e-4a0d-a3b1-f5626a288410','50d572fc-783c-47f4-b2d8-5959b8b04200','1012',5300.00,0.00,0,0.00,0,0,0,0.00,0,5300.00,'07e392ee-c1b3-4b43-bcb6-cdf9989045cd'),('97ec1276-3853-4719-8c3d-e5a57f02b94b','db33ff11-6b8e-4a64-b2e7-f7105b7da331','1001',1000.00,0.00,0,0.00,0,0,0,0.00,0,1000.00,'fdaa5621-e4be-43f3-8b9d-588a1740ce50'),('9be0e597-f227-4b3b-a4b0-4a10a873e4e6','1bb53f4d-b6a1-4d34-9d5a-d946c49809b6','2008',0.00,16.67,0,0.00,0,0,0,0.00,0,16.67,'3db8751e-84ab-43d9-980c-f2b064f26e41'),('9dffe01a-bace-44b5-8566-de022f0853d3','e9d9886b-84fc-4533-a10b-9d153a7967f6','5041',4000.00,0.00,0,0.00,0,0,0,0.00,0,4000.00,'40bd3e2a-0bbf-4fb6-a7df-848d47583814'),('9e6681af-6eba-456a-ab69-2575d22ca7f9','1bb53f4d-b6a1-4d34-9d5a-d946c49809b6','2008',0.00,16.67,0,0.00,0,0,0,0.00,0,16.67,'8296d68c-d8e2-414b-9fdd-47088cd9d6e8'),('a283ceb2-fd87-42bc-ad70-9b993a893e7d','9b0aa0e8-b4fe-43c9-add7-af39d61e194f','2002',0.00,2000.00,1,0.00,0,10,12,0.00,1,2000.00,'28d4c77f-8d4c-474d-9016-d23929218ff7'),('a52c8f79-1012-43d4-9cfe-246f44953b7e','33c1333f-0a1c-4916-a5fe-da46ea969236','5003',4000.00,0.00,0,0.00,0,0,0,0.00,0,4000.00,'a485d30c-c6ee-470f-ae0a-ebed95131975'),('a974d96e-cbcf-4e3c-8519-b10b37155399','a97ceef9-75ce-45ab-9042-e2fa3520915e','3001',0.00,250000.00,0,0.00,0,0,0,0.00,0,250000.00,'a4fa1128-7d7f-4f63-879a-4d6b65ae05ae'),('ac962adb-9637-44b6-b134-994e1b23eacb','a69edf35-734c-4c16-909f-93f35d2e232f','1002',0.00,1.00,0,0.00,0,0,0,0.00,0,1.00,'172464fe-13d7-4600-821c-ca77d6fc6cd8'),('adabb1b4-219b-4312-be27-d36721ff901f','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',0.00,7200.00,0,0.00,0,0,0,0.00,0,7200.00,'6f50b0af-9415-4be6-93fb-18be9cda14c5'),('b40aeaba-a089-4e1e-94fa-7e5e84d5990a','eb547251-baa8-4839-afd1-1f77860f186a','2003',4000.00,0.00,0,0.00,0,0,0,0.00,0,4000.00,'fc984c6e-d244-462d-83fd-d2a27ede1cdc'),('bb336a4b-1f7d-4a0f-822a-d245ae8e8168','a69edf35-734c-4c16-909f-93f35d2e232f','1002',2000.00,0.00,0,0.00,0,0,0,0.00,0,2000.00,'71dbad62-fa63-4eba-904f-4d9187650c8a'),('bbb9d8b7-be98-4e8c-9981-aba2f4b3023d','623b5fae-85b5-4f85-b542-d2219a5bb548','1030',0.00,4000.00,0,0.00,0,0,0,0.00,0,4000.00,'40bd3e2a-0bbf-4fb6-a7df-848d47583814'),('c01585e2-40fe-4ca6-915e-861686056f0c','84412695-be49-4864-af24-097c206e4328','1005',1.00,0.00,0,0.00,0,0,0,0.00,0,1.00,'32d121ca-5cee-4eb9-a8f1-0eeb4c778f25'),('c05a09f2-4fec-4f03-a9e3-4bf0e3465d5a','a86ecdfd-e5f9-4eb0-809d-d06b74204494','6003',0.00,4000.00,0,0.00,0,0,0,0.00,0,4000.00,'a485d30c-c6ee-470f-ae0a-ebed95131975'),('c16b4a2c-ffc4-4c53-9612-23ac6d8ab827','f9268d25-73ca-4fcc-8cf7-2ccd1514082d','2004',0.00,1400.00,1,0.00,0,0,0,0.00,0,1400.00,'fee13bda-c7c6-450e-801d-c898e495a796'),('c2ebdc3e-8a01-4c9a-9c9d-08f8c86ed7af','623b5fae-85b5-4f85-b542-d2219a5bb548','1030',8000.00,0.00,1,0.00,0,0,0,0.00,0,8000.00,'8312a1eb-6847-4309-9609-c64725c3b6b9'),('c42907ed-2bf3-4586-afc6-2bb05fb4f6ca','09a91428-b9e5-4b01-8377-27fafc7ff6ab','5022',16.67,0.00,0,0.00,0,0,0,0.00,0,16.67,'dc2d42cd-1964-4b4f-bcea-a8f4ba45c8d1'),('c42e8493-f68e-471c-9fd9-b744d3b8246a','22f6b4c5-f2cd-4398-b3fd-b639f2c10689','2001',0.00,18000.00,1,0.00,0,0,0,0.00,0,18000.00,'0a155c54-b72e-4adc-8938-59225747edcc'),('c547b08d-f494-4bed-a314-d23db3119722','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',0.00,8000.00,0,0.00,0,0,0,0.00,0,8000.00,'b57f844e-a016-4f02-8b34-6605aed7a5f2'),('c59fa289-a628-4e70-9bbb-18377b6a1da0','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',0.00,3000.00,0,0.00,0,0,0,0.00,0,3000.00,'5b055243-e4c1-4b71-b6ee-5ee8fc358542'),('cc968fce-6bc6-4341-98a5-d451370e4069','a69edf35-734c-4c16-909f-93f35d2e232f','1002',0.00,2.00,0,0.00,0,0,0,0.00,0,2.00,'ef9aa610-47c2-4418-b72a-437cf5c24fe8'),('d32ccb9d-33cf-4f87-8b06-b66d85ecc2c5','9b0aa0e8-b4fe-43c9-add7-af39d61e194f','2002',0.00,210000.00,1,0.00,0,20,12,3500.00,1,210000.00,'4f3066cf-1e35-40c6-900a-918c9be4c881'),('d3e91378-041d-470e-9c30-7c694ed54fd4','db33ff11-6b8e-4a64-b2e7-f7105b7da331','1001',1.00,0.00,0,0.00,0,0,0,0.00,0,1.00,'172464fe-13d7-4600-821c-ca77d6fc6cd8'),('d59e5960-ba94-4851-8ae3-b2bab2c2b932','3c64ee52-714f-4091-b3a5-6b450d8a038d','1026',14400.00,0.00,1,0.00,0,0,0,0.00,0,13200.00,'aa6075c0-3a2e-4aec-9ffd-a73119895f72'),('d8047f13-ad63-4833-b338-03f757633009','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',250000.00,0.00,0,0.00,0,0,0,0.00,0,250000.00,'a4fa1128-7d7f-4f63-879a-4d6b65ae05ae'),('d820df5e-dd84-4de5-8a24-335a768f5bd5','22f6b4c5-f2cd-4398-b3fd-b639f2c10689','2001',0.00,18000.00,1,0.00,0,0,0,0.00,0,18000.00,'6e014ce6-9aec-4bcb-ae94-b275fd7bbef9'),('da7f493a-d1e2-402a-9b82-bad59dadd37a','a69edf35-734c-4c16-909f-93f35d2e232f','1002',2000.00,0.00,0,0.00,0,0,0,0.00,0,2000.00,'150fc6b8-90f1-4f58-a7da-bbfb438914e3'),('dbbae2f1-92ae-49d4-87a2-d96c55740572','a69edf35-734c-4c16-909f-93f35d2e232f','1002',2.00,0.00,0,0.00,0,0,0,0.00,0,2.00,'0bebd345-e699-476d-9cbd-2239bc313cf3'),('e026f54a-d838-4cfc-a992-66e720efe9e0','578b51a9-fd87-49cc-abc4-c45dcd0ce4d9','3002',14000.00,0.00,0,0.00,0,0,0,0.00,0,14000.00,'c9d07e3f-c8a6-4b4c-8cf7-fe013b2b74d4'),('e22a9d1a-ed19-4387-b325-f6ce9ed03f03','db33ff11-6b8e-4a64-b2e7-f7105b7da331','1001',1000.00,0.00,0,0.00,0,0,0,0.00,0,1000.00,'150fc6b8-90f1-4f58-a7da-bbfb438914e3'),('e42c6df0-55be-4654-b588-a456a074c8c2','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',250000.00,0.00,0,0.00,0,0,0,0.00,0,250000.00,'0ee16771-a79b-4428-a144-df6217993f35'),('e7a46082-9bee-43a0-9929-adbf0073a6fb','a97ceef9-75ce-45ab-9042-e2fa3520915e','3001',0.00,250000.00,0,0.00,0,0,0,0.00,0,250000.00,'0ee16771-a79b-4428-a144-df6217993f35'),('e7a515de-6218-4bb5-83b9-fa4063655420','9b0aa0e8-b4fe-43c9-add7-af39d61e194f','2002',0.00,2000.00,1,0.00,0,10,12,2000.00,1,2000.00,'fdaa5621-e4be-43f3-8b9d-588a1740ce50'),('e9e42256-96dd-4edf-979d-e8df183d76b6','a69edf35-734c-4c16-909f-93f35d2e232f','1002',2000.00,0.00,0,0.00,0,0,0,0.00,0,2000.00,'fdaa5621-e4be-43f3-8b9d-588a1740ce50'),('ead4731f-1375-42b6-8beb-b60a6e77e2da','2c0f5ad8-abab-4dd0-8daf-0491aa59604e','1010',18000.00,0.00,1,0.00,0,0,0,0.00,0,15000.00,'0a155c54-b72e-4adc-8938-59225747edcc'),('ed697fcc-4a7a-4453-b7ed-9302a2629012','30c10774-d0ea-4ea8-a7dc-64d600fb480f','4001',0.00,36000.00,0,0.00,0,0,0,0.00,0,36000.00,'07c66de0-1997-4d5f-8d1c-6c9b9334c0bb'),('ede69a6b-513f-4b1d-8705-161f083c6b7e','578b51a9-fd87-49cc-abc4-c45dcd0ce4d9','3002',14000.00,0.00,0,0.00,0,0,0,0.00,0,14000.00,'9cd1accf-cb25-4fb9-a993-7cdbfd73c0b8'),('ee4eb671-6e8e-4312-ba47-3e0f1678fc66','84412695-be49-4864-af24-097c206e4328','1005',1.00,0.00,1,0.00,0,0,0,0.00,0,1.00,'9e5bddb5-498f-4abd-b91f-a9def7001a93'),('f0edc8e8-2409-4332-b930-0783c28bf0df','1fec3e76-045a-494a-9596-33970c655e1e','5032',1800.00,0.00,0,0.00,0,0,0,0.00,0,1800.00,'c4bf9586-b46a-416d-9eb9-22f3de243996'),('f1d93cf7-6288-4a0c-ba48-8f735413549c','e2267c78-d756-4b22-b8f9-14fea1d0fcf1','5021',1200.00,0.00,0,0.00,0,0,0,0.00,0,1200.00,'0656248d-c30c-4fce-b26f-17a6b40dc51d'),('f1f0da1d-6a69-461c-89cf-eacd0e3baa8a','30c10774-d0ea-4ea8-a7dc-64d600fb480f','4001',0.00,26400.00,0,0.00,0,0,0,0.00,0,26400.00,'0a515e8a-a52c-4a77-8d72-6bca7eab0a17'),('f2f64664-485b-4e85-96ff-1e0384075111','3c64ee52-714f-4091-b3a5-6b450d8a038d','1026',0.00,1200.00,0,0.00,0,0,0,0.00,0,1200.00,'0656248d-c30c-4fce-b26f-17a6b40dc51d'),('f4d501c2-c24a-41a7-9de7-0444b2250bfd','b3b4d9f9-7a0e-4092-b1b2-5ac3ed9b08df','1015',0.00,14000.00,0,0.00,0,0,0,0.00,0,14000.00,'9cd1accf-cb25-4fb9-a993-7cdbfd73c0b8'),('f7019d40-51c9-44ac-88d1-e40ba00a5096','9b0aa0e8-b4fe-43c9-add7-af39d61e194f','2002',0.00,2000.00,1,0.00,0,10,12,0.00,1,2000.00,'3f27b74c-12d9-43ec-a24a-d618fc82e5b9'),('f7727946-36f9-4931-a052-261cdf0a88b0','50d572fc-783c-47f4-b2d8-5959b8b04200','1012',36000.00,0.00,0,0.00,0,0,0,0.00,0,36000.00,'07c66de0-1997-4d5f-8d1c-6c9b9334c0bb'),('f7cde5de-0265-4ddc-b6e9-28225cb0ccc9','1bb53f4d-b6a1-4d34-9d5a-d946c49809b6','2008',0.00,16.67,0,0.00,0,0,0,0.00,0,16.67,'4ecd02ad-de00-4ef3-ae75-ab9503a7add2'),('f8e3d12c-f585-4e8b-9370-04638ab73701','22f6b4c5-f2cd-4398-b3fd-b639f2c10689','2001',0.00,1000.00,1,0.00,0,0,0,0.00,0,1000.00,'40267dbf-ffcc-409f-9094-1ce1221617b1'),('fb1ec15c-168a-4543-b481-8327bfc9a3cb','a69edf35-734c-4c16-909f-93f35d2e232f','1002',2000.00,0.00,0,0.00,0,0,0,0.00,0,2000.00,'28d4c77f-8d4c-474d-9016-d23929218ff7'),('fb8d8c30-776c-4d9d-be3e-c83e27982a5f','2c0f5ad8-abab-4dd0-8daf-0491aa59604e','1010',0.00,3000.00,0,0.00,0,0,0,0.00,0,3000.00,'790e15e3-874d-4c46-aab1-011a31cda9b6'),('fee6dd2e-5ee7-41aa-a322-7f8566e1ca8c','a69edf35-734c-4c16-909f-93f35d2e232f','1002',2.00,0.00,1,0.00,0,0,0,0.00,0,2.00,'ef9aa610-47c2-4418-b72a-437cf5c24fe8'),('fef7ebf2-478d-4a76-bb29-52d1c2bbc795','a69edf35-734c-4c16-909f-93f35d2e232f','1002',2000.00,0.00,0,0.00,0,0,0,0.00,0,2000.00,'91f128f8-90ba-4a0a-bae6-4cfc59677c02'),('ffc275d0-25fe-4db7-89f7-17dc132d0b35','09a91428-b9e5-4b01-8377-27fafc7ff6ab','5022',3500.00,0.00,0,0.00,0,0,0,0.00,0,3500.00,'64ac2704-a4ae-4529-868c-b686b2d4e4fc'),('fff8f662-29f8-4b13-a8ed-69ad45b4bf9b','db33ff11-6b8e-4a64-b2e7-f7105b7da331','1001',1000.00,0.00,0,0.00,0,0,0,0.00,0,1000.00,'40267dbf-ffcc-409f-9094-1ce1221617b1');
/*!40000 ALTER TABLE `journal_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `journal_entries`
--

DROP TABLE IF EXISTS `journal_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `journal_entries` (
  `id` char(36) NOT NULL,
  `source_document_path` text,
  `entry_type` varchar(255) NOT NULL DEFAULT 'Initial',
  `date` char(10) NOT NULL,
  `is_adjustable` tinyint(1) NOT NULL DEFAULT '0',
  `explanation` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Journalized',
  `originating_entry` char(36) DEFAULT NULL,
  `adjusted_account` char(36) DEFAULT NULL,
  `adjusted_balance` decimal(13,2) NOT NULL DEFAULT '0.00',
  `replaced_record` char(36) DEFAULT NULL,
  `journalized_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `posted_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `journalized_by` char(36) DEFAULT NULL,
  `posted_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `originating_entry` (`originating_entry`),
  KEY `replaced_record` (`replaced_record`),
  KEY `journalized_by` (`journalized_by`),
  KEY `posted_by` (`posted_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `journal_entries_ibfk_1` FOREIGN KEY (`originating_entry`) REFERENCES `journal_entries` (`id`),
  CONSTRAINT `journal_entries_ibfk_2` FOREIGN KEY (`replaced_record`) REFERENCES `journal_entries` (`id`) ON DELETE CASCADE,
  CONSTRAINT `journal_entries_ibfk_3` FOREIGN KEY (`journalized_by`) REFERENCES `users` (`id`),
  CONSTRAINT `journal_entries_ibfk_4` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`),
  CONSTRAINT `journal_entries_ibfk_5` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_entries`
--

LOCK TABLES `journal_entries` WRITE;
/*!40000 ALTER TABLE `journal_entries` DISABLE KEYS */;
INSERT INTO `journal_entries` VALUES ('0656248d-c30c-4fce-b26f-17a6b40dc51d','assets/img/source_documents/fc7ea1a91b1fa2bf9e07.jpeg','Adjusting','2022-08-31',0,'','Posted','aa6075c0-3a2e-4aec-9ffd-a73119895f72','d59e5960-ba94-4851-8ae3-b2bab2c2b932',1200.00,NULL,'2022-08-04 03:34:41','2022-08-04 03:34:41','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf',NULL),('07c66de0-1997-4d5f-8d1c-6c9b9334c0bb','assets/img/source_documents/b75b2d3a277cff49f45b.jpeg','Initial','2022-08-19',0,'','Posted',NULL,NULL,0.00,NULL,'2022-08-04 02:56:42','2022-08-04 02:56:43','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf',NULL),('07e392ee-c1b3-4b43-bcb6-cdf9989045cd','assets/img/source_documents/efe98e47850fd4ef2a79.jpeg','Adjusting','2022-08-31',0,'','Posted',NULL,NULL,0.00,NULL,'2022-08-04 03:48:06','2022-08-04 03:48:06','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf',NULL),('0a155c54-b72e-4adc-8938-59225747edcc','assets/img/source_documents/157812823aaeb42caba2.jpeg','Initial','2022-08-08',1,'','Posted',NULL,NULL,0.00,'6e014ce6-9aec-4bcb-ae94-b275fd7bbef9','2022-08-04 02:48:00','2022-08-04 02:48:01','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('0a515e8a-a52c-4a77-8d72-6bca7eab0a17','assets/img/source_documents/7bac3998dbac6dc40378.jpeg','Initial','2022-08-10',0,'','Posted',NULL,NULL,0.00,NULL,'2022-08-04 02:53:26','2022-08-04 02:53:26','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf',NULL),('0bebd345-e699-476d-9cbd-2239bc313cf3','assets/img/source_documents/cc3fe90a5fbebe9eec7b.jpeg','Initial','2022-08-03',0,'','Overwritten',NULL,NULL,0.00,NULL,'2022-08-03 09:30:13','2022-08-03 09:30:14','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('0ee16771-a79b-4428-a144-df6217993f35','assets/img/source_documents/cc3fe90a5fbebe9eec7b.jpeg','Initial','2022-08-01',0,'','Overwritten',NULL,NULL,0.00,'2ccbff37-81d3-40e6-ba05-4f55b6a1583e','2022-08-03 09:30:13','2022-08-03 09:30:14','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('150fc6b8-90f1-4f58-a7da-bbfb438914e3','assets/img/source_documents/1e796e0ddd14c891e84c.jpeg','Initial','2022-08-01',1,'','Overwritten',NULL,NULL,0.00,'40267dbf-ffcc-409f-9094-1ce1221617b1','2022-08-01 11:18:00','2022-08-02 08:05:50','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('166cd7ca-c30b-4ec4-8a85-e2a6cb061e9a','assets/img/source_documents/ee6ac0b7a3593a63b773.jpeg','Initial','2022-08-03',0,'','Overwritten',NULL,NULL,0.00,NULL,'2022-08-04 02:41:23','2022-08-04 02:41:23','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('172464fe-13d7-4600-821c-ca77d6fc6cd8','assets/img/source_documents/311f65d808b983ab0292.jpeg','Adjusting','2022-08-03',0,'','Deleted','9e5bddb5-498f-4abd-b91f-a9def7001a93','ee4eb671-6e8e-4312-ba47-3e0f1678fc66',1.00,NULL,'2022-08-04 03:29:48','2022-08-04 03:29:49','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('28d4c77f-8d4c-474d-9016-d23929218ff7','assets/img/source_documents/1e796e0ddd14c891e84c.jpeg','Initial','2022-08-01',1,'','Overwritten',NULL,NULL,0.00,'150fc6b8-90f1-4f58-a7da-bbfb438914e3','2022-08-01 11:18:00','2022-08-02 08:05:50','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('2ccbff37-81d3-40e6-ba05-4f55b6a1583e','assets/img/source_documents/cc3fe90a5fbebe9eec7b.jpeg','Initial','2022-08-01',1,'','Overwritten',NULL,NULL,0.00,'ef9aa610-47c2-4418-b72a-437cf5c24fe8','2022-08-03 09:30:13','2022-08-03 09:30:14','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('32d121ca-5cee-4eb9-a8f1-0eeb4c778f25','assets/img/source_documents/0cda91372bf16ff3ad8d.jpeg','Initial','2022-08-31',0,'','Overwritten',NULL,NULL,0.00,NULL,'2022-08-04 03:11:09','2022-08-04 03:11:10','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('3a418191-5ff9-494a-bc3e-aa6339d5151b','assets/img/source_documents/ee6ac0b7a3593a63b773.jpeg','Initial','2022-08-04',0,'','Overwritten',NULL,NULL,0.00,'166cd7ca-c30b-4ec4-8a85-e2a6cb061e9a','2022-08-04 02:41:23','2022-08-04 02:41:23','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('3db8751e-84ab-43d9-980c-f2b064f26e41','assets/img/source_documents/1e796e0ddd14c891e84c.jpeg','Adjusting','2022-08-02',0,'','Deleted','71dbad62-fa63-4eba-904f-4d9187650c8a','1f2cec33-1b55-4db1-abfb-731589a88bb6',16.67,'4ecd02ad-de00-4ef3-ae75-ab9503a7add2','2022-08-02 08:09:33','2022-08-02 08:09:33','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('3f27b74c-12d9-43ec-a24a-d618fc82e5b9','assets/img/source_documents/1e796e0ddd14c891e84c.jpeg','Initial','2022-08-01',1,'','Overwritten',NULL,NULL,0.00,NULL,'2022-08-01 11:18:00','2022-08-01 11:18:01','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('40267dbf-ffcc-409f-9094-1ce1221617b1','assets/img/source_documents/1e796e0ddd14c891e84c.jpeg','Initial','2022-08-01',1,'','Overwritten',NULL,NULL,0.00,'fdaa5621-e4be-43f3-8b9d-588a1740ce50','2022-08-01 11:18:00',NULL,'2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL,'c7adf398-350a-43b4-a130-502051a0c1bf'),('40bd3e2a-0bbf-4fb6-a7df-848d47583814','assets/img/source_documents/bc8411f95768446a21bf.jpeg','Adjusting','2022-08-31',0,'','Overwritten','d568a83c-4d9d-43da-9cc3-3e78d1cbfac5','72f487e2-7029-4560-81ca-749da02514f8',4000.00,'77e3e97d-97dd-4875-a7d7-306a7cc71a0e','2022-08-04 03:33:08','2022-08-04 03:33:08','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('450130c3-d780-44c0-9550-b8266f913fde','assets/img/source_documents/1e796e0ddd14c891e84c.jpeg','Adjusting','2022-08-02',0,'','Deleted','71dbad62-fa63-4eba-904f-4d9187650c8a','1f2cec33-1b55-4db1-abfb-731589a88bb6',16.67,'dec4e021-2d68-4a48-b326-e48ebba0494b','2022-08-02 08:09:33','2022-08-02 08:09:33','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('484cde37-14d3-4d7b-b193-c066abab9111','assets/img/source_documents/39d0e4cc60b79ec5124a.jpeg','Initial','2022-08-30',0,'','Posted',NULL,NULL,0.00,NULL,'2022-08-04 03:01:17','2022-08-04 03:01:18','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf',NULL),('4b8996bb-14e1-40db-98e4-f92ee5918dbe','assets/img/source_documents/1e796e0ddd14c891e84c.jpeg','Adjusting','2022-08-02',0,'','Deleted','71dbad62-fa63-4eba-904f-4d9187650c8a','1f2cec33-1b55-4db1-abfb-731589a88bb6',16.67,'450130c3-d780-44c0-9550-b8266f913fde','2022-08-02 08:09:33','2022-08-02 08:09:33','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('4ecd02ad-de00-4ef3-ae75-ab9503a7add2','assets/img/source_documents/1e796e0ddd14c891e84c.jpeg','Adjusting','2022-08-02',0,'','Deleted','71dbad62-fa63-4eba-904f-4d9187650c8a','1f2cec33-1b55-4db1-abfb-731589a88bb6',16.67,'4b8996bb-14e1-40db-98e4-f92ee5918dbe','2022-08-02 08:09:33','2022-08-02 08:09:33','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('4f3066cf-1e35-40c6-900a-918c9be4c881','assets/img/source_documents/f2f909e5fb924ef18e4b.jpeg','Initial','2022-08-02',1,'','Posted',NULL,NULL,0.00,NULL,'2022-08-04 02:39:30','2022-08-04 02:39:31','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf',NULL),('55bd21f6-452a-4dc0-81ad-7c74c658ff26','assets/img/source_documents/33d7faffd2dda42971e6.jpeg','Initial','2022-08-05',1,'','Posted',NULL,NULL,0.00,NULL,'2022-08-04 02:46:52','2022-08-04 02:46:52','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf',NULL),('5b055243-e4c1-4b71-b6ee-5ee8fc358542','assets/img/source_documents/b8e52829f89356ee78e3.jpeg','Initial','2022-08-31',0,'','Posted',NULL,NULL,0.00,NULL,'2022-08-04 03:01:58','2022-08-04 03:01:58','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf',NULL),('64ac2704-a4ae-4529-868c-b686b2d4e4fc',NULL,'Adjusting','2022-08-31',0,'','Posted','4f3066cf-1e35-40c6-900a-918c9be4c881','d32ccb9d-33cf-4f87-8b06-b66d85ecc2c5',3500.00,NULL,'2022-08-04 03:47:20','2022-08-04 03:47:20','2022-08-31 06:07:53','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf',NULL),('6e014ce6-9aec-4bcb-ae94-b275fd7bbef9','assets/img/source_documents/157812823aaeb42caba2.jpeg','Initial','2022-08-08',1,'','Overwritten',NULL,NULL,0.00,NULL,'2022-08-04 02:48:00','2022-08-04 02:48:01','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('6f50b0af-9415-4be6-93fb-18be9cda14c5','assets/img/source_documents/d1955efa096aa6119cf7.jpeg','Initial','2022-08-27',0,'','Posted',NULL,NULL,0.00,NULL,'2022-08-04 02:59:03','2022-08-04 02:59:04','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf',NULL),('71dbad62-fa63-4eba-904f-4d9187650c8a','assets/img/source_documents/1e796e0ddd14c891e84c.jpeg','Initial','2022-08-01',1,'','Deleted',NULL,NULL,0.00,'28d4c77f-8d4c-474d-9016-d23929218ff7','2022-08-01 11:18:00','2022-08-02 08:05:50','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('77e3e97d-97dd-4875-a7d7-306a7cc71a0e','assets/img/source_documents/bc8411f95768446a21bf.jpeg','Adjusting','2022-08-31',0,'','Overwritten','d568a83c-4d9d-43da-9cc3-3e78d1cbfac5','72f487e2-7029-4560-81ca-749da02514f8',4000.00,NULL,'2022-08-04 03:33:08','2022-08-04 03:33:08','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('790e15e3-874d-4c46-aab1-011a31cda9b6','assets/img/source_documents/ea234e2a0a0aa73af3af.jpeg','Adjusting','2022-08-31',0,'','Posted','0a155c54-b72e-4adc-8938-59225747edcc','ead4731f-1375-42b6-8beb-b60a6e77e2da',3000.00,NULL,'2022-08-04 03:36:17','2022-08-04 03:36:17','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf',NULL),('8296d68c-d8e2-414b-9fdd-47088cd9d6e8',NULL,'Adjusting','2022-08-02',0,'','Deleted','71dbad62-fa63-4eba-904f-4d9187650c8a','1f2cec33-1b55-4db1-abfb-731589a88bb6',16.67,NULL,'2022-08-02 08:11:01','2022-08-02 08:11:01','2022-08-31 06:07:53','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('8312a1eb-6847-4309-9609-c64725c3b6b9','assets/img/source_documents/6801e68a8f314f81a467.jpeg','Initial','2022-08-03',1,'','Overwritten',NULL,NULL,0.00,NULL,'2022-08-04 02:37:54','2022-08-04 02:37:54','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('914ba684-0038-4e5e-9613-d7edb621ead8','assets/img/source_documents/4abac677409001263e9d.jpeg','Initial','2022-08-15',1,'','Posted',NULL,NULL,0.00,NULL,'2022-08-04 02:55:11','2022-08-04 02:55:11','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf',NULL),('91f128f8-90ba-4a0a-bae6-4cfc59677c02','assets/img/source_documents/1e796e0ddd14c891e84c.jpeg','Initial','2022-08-01',1,'','Overwritten',NULL,NULL,0.00,'3f27b74c-12d9-43ec-a24a-d618fc82e5b9','2022-08-01 11:18:00','2022-08-01 11:18:01','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('92d16e35-012f-4fb5-a9a0-e240af1b9727','assets/img/source_documents/5aea97ef8b6f7a408340.jpeg','Initial','2022-08-09',0,'','Posted',NULL,NULL,0.00,NULL,'2022-08-04 02:52:14','2022-08-04 02:52:15','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf',NULL),('93c60958-104e-4acd-87ed-e9b894f0186b','assets/img/source_documents/cc3fe90a5fbebe9eec7b.jpeg','Initial','2022-08-01',0,'','Journalized',NULL,NULL,0.00,'0ee16771-a79b-4428-a144-df6217993f35','2022-08-03 09:30:13',NULL,'2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL,'c7adf398-350a-43b4-a130-502051a0c1bf'),('9cd1accf-cb25-4fb9-a993-7cdbfd73c0b8','assets/img/source_documents/59dc992020d318f33e64.jpeg','Initial','2022-08-25',0,'','Posted',NULL,NULL,0.00,'c9d07e3f-c8a6-4b4c-8cf7-fe013b2b74d4','2022-08-04 02:57:24','2022-08-04 02:57:25','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('9e5bddb5-498f-4abd-b91f-a9def7001a93','assets/img/source_documents/0cda91372bf16ff3ad8d.jpeg','Initial','2022-08-31',1,'','Deleted',NULL,NULL,0.00,'32d121ca-5cee-4eb9-a8f1-0eeb4c778f25','2022-08-04 03:11:09','2022-08-04 03:11:10','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('a485d30c-c6ee-470f-ae0a-ebed95131975',NULL,'Adjusting','2022-08-31',0,'','Posted','cfeddd6e-5693-42c8-a855-ba0f78e3c6ef','54a9ff8c-c204-406b-8df0-d7a38efc4dc2',4000.00,NULL,'2022-08-04 03:42:25','2022-08-04 03:42:26','2022-08-31 06:07:53','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf',NULL),('a4fa1128-7d7f-4f63-879a-4d6b65ae05ae','assets/img/source_documents/6512579ef5f3b4f7aac9.jpeg','Initial','2022-08-03',0,'','Deleted',NULL,NULL,0.00,NULL,'2022-08-04 02:35:57','2022-08-04 02:35:58','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('aa6075c0-3a2e-4aec-9ffd-a73119895f72','assets/img/source_documents/5c638619988d9fd57207.jpeg','Initial','2022-08-04',1,'','Posted',NULL,NULL,0.00,NULL,'2022-08-04 02:45:12','2022-08-04 02:45:12','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf',NULL),('b57f844e-a016-4f02-8b34-6605aed7a5f2','assets/img/source_documents/6801e68a8f314f81a467.jpeg','Initial','2022-08-02',1,'','Overwritten',NULL,NULL,0.00,'8312a1eb-6847-4309-9609-c64725c3b6b9','2022-08-04 02:37:54','2022-08-04 02:37:54','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('bcd2b28d-bfae-4325-a8fb-8e86b5b3dd7f','assets/img/source_documents/1e796e0ddd14c891e84c.jpeg','Initial','2022-08-01',1,'','Overwritten',NULL,NULL,0.00,'91f128f8-90ba-4a0a-bae6-4cfc59677c02','2022-08-01 11:18:00',NULL,'2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea',NULL,'c7adf398-350a-43b4-a130-502051a0c1bf'),('c4bf9586-b46a-416d-9eb9-22f3de243996','assets/img/source_documents/1b6886ed2396d1a5c073.jpeg','Adjusting','2022-08-31',0,'','Posted',NULL,NULL,0.00,NULL,'2022-08-04 03:46:43','2022-08-04 03:46:43','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf',NULL),('c9d07e3f-c8a6-4b4c-8cf7-fe013b2b74d4','assets/img/source_documents/59dc992020d318f33e64.jpeg','Initial','2022-08-03',0,'','Overwritten',NULL,NULL,0.00,NULL,'2022-08-04 02:57:24','2022-08-04 02:57:25','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('cfeddd6e-5693-42c8-a855-ba0f78e3c6ef','assets/img/source_documents/ee6ac0b7a3593a63b773.jpeg','Initial','2022-08-04',1,'','Posted',NULL,NULL,0.00,'3a418191-5ff9-494a-bc3e-aa6339d5151b','2022-08-04 02:41:23','2022-08-04 02:41:23','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('d568a83c-4d9d-43da-9cc3-3e78d1cbfac5','assets/img/source_documents/6801e68a8f314f81a467.jpeg','Initial','2022-08-01',1,'','Posted',NULL,NULL,0.00,'b57f844e-a016-4f02-8b34-6605aed7a5f2','2022-08-04 02:37:54','2022-08-04 02:37:54','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('d95f8bf3-d0b7-4383-8c5a-607784bd1413','assets/img/source_documents/bc8411f95768446a21bf.jpeg','Adjusting','2022-08-31',0,'','Posted','d568a83c-4d9d-43da-9cc3-3e78d1cbfac5','72f487e2-7029-4560-81ca-749da02514f8',4000.00,'40bd3e2a-0bbf-4fb6-a7df-848d47583814','2022-08-04 03:33:08','2022-08-04 03:33:08','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('dc2d42cd-1964-4b4f-bcea-a8f4ba45c8d1',NULL,'Adjusting','2022-08-02',0,'','Deleted','71dbad62-fa63-4eba-904f-4d9187650c8a','1f2cec33-1b55-4db1-abfb-731589a88bb6',16.67,NULL,'2022-08-02 08:10:52','2022-08-02 08:10:52','2022-08-31 06:07:53','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('dec4e021-2d68-4a48-b326-e48ebba0494b',NULL,'Adjusting','2022-08-02',0,'','Deleted','71dbad62-fa63-4eba-904f-4d9187650c8a','1f2cec33-1b55-4db1-abfb-731589a88bb6',16.67,NULL,'2022-08-02 08:09:33','2022-08-02 08:09:33','2022-08-31 06:07:53','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('ef9aa610-47c2-4418-b72a-437cf5c24fe8','assets/img/source_documents/cc3fe90a5fbebe9eec7b.jpeg','Initial','2022-08-03',1,'','Overwritten',NULL,NULL,0.00,'0bebd345-e699-476d-9cbd-2239bc313cf3','2022-08-03 09:30:13','2022-08-03 09:30:14','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('fc1b3cc4-afdb-4c9f-ab5c-e08e8ae363c8','assets/img/source_documents/71654ed6a99fa757940f.jpeg','Initial','2022-08-13',0,'','Posted',NULL,NULL,0.00,NULL,'2022-08-04 02:54:22','2022-08-04 02:54:22','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf',NULL),('fc984c6e-d244-462d-83fd-d2a27ede1cdc','assets/img/source_documents/cf4865694e0ea08b4503.jpeg','Adjusting','2022-08-31',0,'','Posted','914ba684-0038-4e5e-9613-d7edb621ead8','7b599b87-db99-4ec3-a54a-e313b47e1bdd',4000.00,NULL,'2022-08-04 03:45:47','2022-08-04 03:45:47','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf',NULL),('fdaa5621-e4be-43f3-8b9d-588a1740ce50','assets/img/source_documents/1e796e0ddd14c891e84c.jpeg','Initial','2022-08-01',1,'','Overwritten',NULL,NULL,0.00,'bcd2b28d-bfae-4325-a8fb-8e86b5b3dd7f','2022-08-01 11:18:00','2022-08-02 08:02:45','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf','c7adf398-350a-43b4-a130-502051a0c1bf'),('fee13bda-c7c6-450e-801d-c898e495a796','assets/img/source_documents/554a4c8ee180071f3a98.jpeg','Initial','2022-08-30',1,'','Posted',NULL,NULL,0.00,NULL,'2022-08-04 03:00:02','2022-08-04 03:00:03','2022-09-01 01:37:36','65501c6d-fad9-4401-9ff6-18a7b1626cea','c7adf398-350a-43b4-a130-502051a0c1bf',NULL);
/*!40000 ALTER TABLE `journal_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lab_request_bills`
--

DROP TABLE IF EXISTS `lab_request_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_request_bills` (
  `id` char(36) NOT NULL,
  `lab_request_bill_no` varchar(255) NOT NULL,
  `lab_request_id` char(36) NOT NULL,
  `inpatient_bill_id` char(36) NOT NULL,
  `total_amount` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lab_request_bill_no` (`lab_request_bill_no`),
  KEY `lab_request_id` (`lab_request_id`),
  KEY `inpatient_bill_id` (`inpatient_bill_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `lab_request_bills_ibfk_1` FOREIGN KEY (`lab_request_id`) REFERENCES `lab_requests` (`id`),
  CONSTRAINT `lab_request_bills_ibfk_2` FOREIGN KEY (`inpatient_bill_id`) REFERENCES `inpatient_bills` (`id`),
  CONSTRAINT `lab_request_bills_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `lab_request_bills_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lab_request_bills`
--

LOCK TABLES `lab_request_bills` WRITE;
/*!40000 ALTER TABLE `lab_request_bills` DISABLE KEYS */;
INSERT INTO `lab_request_bills` VALUES ('LABREQUESTBILL-001','LABREQUESTBILL01','LABREQUEST-001','INPATIENTBILL-001',200,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 21:02:37','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:04:53'),('LABREQUESTBILL-002','LABREQUESTBILL02','LABREQUEST-002','INPATIENTBILL-002',200,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 21:03:12','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:15:21'),('LABREQUESTBILL-003','LABREQUESTBILL03','LABREQUEST-005','INPATIENTBILL-003',550,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 21:03:12','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:15:21'),('LABREQUESTBILL-004','LABREQUESTBILL04','LABREQUEST-006','INPATIENTBILL-004',300,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 21:03:12','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:15:21');
/*!40000 ALTER TABLE `lab_request_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lab_requests`
--

DROP TABLE IF EXISTS `lab_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_requests` (
  `id` char(36) NOT NULL,
  `lab_request_no` varchar(255) NOT NULL,
  `lab_test_type_id` char(36) NOT NULL,
  `inpatient_id` char(36) DEFAULT NULL,
  `outpatient_id` char(36) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lab_request_no` (`lab_request_no`),
  KEY `lab_test_type_id` (`lab_test_type_id`),
  KEY `inpatient_id` (`inpatient_id`),
  KEY `outpatient_id` (`outpatient_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `lab_requests_ibfk_1` FOREIGN KEY (`lab_test_type_id`) REFERENCES `lab_test_types` (`id`),
  CONSTRAINT `lab_requests_ibfk_2` FOREIGN KEY (`inpatient_id`) REFERENCES `inpatients` (`id`),
  CONSTRAINT `lab_requests_ibfk_3` FOREIGN KEY (`outpatient_id`) REFERENCES `outpatients` (`id`),
  CONSTRAINT `lab_requests_ibfk_4` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `lab_requests_ibfk_5` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lab_requests`
--

LOCK TABLES `lab_requests` WRITE;
/*!40000 ALTER TABLE `lab_requests` DISABLE KEYS */;
INSERT INTO `lab_requests` VALUES ('LABREQUEST-001','LABREQUEST01','ff47b866-eace-457d-aa32-24df80a0e863','INPATIENT-001',NULL,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 21:02:04',NULL,NULL),('LABREQUEST-002','LABREQUEST02','ff47b866-eace-457d-aa32-24df80a0e863','INPATIENT-002',NULL,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:30:54',NULL,NULL),('LABREQUEST-003','LABREQUEST03','ff47b866-eace-457d-aa32-24df80a0e863',NULL,'OUTPATIENT-001','Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:30:54','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-08 00:01:30'),('LABREQUEST-004','LABREQUEST04','41cd44da-9b58-42c1-b16b-2fb7cf93a32a',NULL,'OUTPATIENT-002','Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:30:54','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-08 00:01:30'),('LABREQUEST-005','LABREQUEST05','3628c49d-0a5c-4672-8a04-aee1994bf669','INPATIENT-003',NULL,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:30:54',NULL,NULL),('LABREQUEST-006','LABREQUEST06','ae873496-1128-4b6e-98d0-03957b0a1bd0','INPATIENT-004',NULL,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:30:54',NULL,NULL);
/*!40000 ALTER TABLE `lab_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lab_results`
--

DROP TABLE IF EXISTS `lab_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_results` (
  `id` char(36) NOT NULL,
  `lab_result_no` varchar(255) NOT NULL,
  `lab_request_id` char(36) NOT NULL,
  `specimen` varchar(255) NOT NULL,
  `result` varchar(255) NOT NULL,
  `reference` varchar(255) NOT NULL,
  `unit` varchar(255) NOT NULL,
  `detailed_result` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lab_request_id` (`lab_request_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `lab_results_ibfk_1` FOREIGN KEY (`lab_request_id`) REFERENCES `lab_requests` (`id`),
  CONSTRAINT `lab_results_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `lab_results_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lab_results`
--

LOCK TABLES `lab_results` WRITE;
/*!40000 ALTER TABLE `lab_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `lab_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lab_test_types`
--

DROP TABLE IF EXISTS `lab_test_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_test_types` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `fee` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `lab_test_types_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `lab_test_types_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lab_test_types`
--

LOCK TABLES `lab_test_types` WRITE;
/*!40000 ALTER TABLE `lab_test_types` DISABLE KEYS */;
INSERT INTO `lab_test_types` VALUES ('2f541acb-8d46-4976-ad0a-654100d92ed8','Urinalysis','is a test of your urine',80,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-16 12:40:41',NULL,NULL),('3628c49d-0a5c-4672-8a04-aee1994bf669','Thyroid Ultrasound','Uses sound waves to produce pictures of the thyroid gland within the neck.',550,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-16 12:39:01',NULL,NULL),('41cd44da-9b58-42c1-b16b-2fb7cf93a32a','CBC','A complete blood count (CBC) is a blood test used to evaluate your overall health and detect a wide range of disorders, including anemia, infection and leukemia.',300,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-16 12:46:15',NULL,NULL),('ae873496-1128-4b6e-98d0-03957b0a1bd0','Chest X-Ray','uses a very small dose of ionizing radiation to produce pictures of the inside of the chest',300,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-16 12:39:57',NULL,NULL),('ff47b866-eace-457d-aa32-24df80a0e863','Blood Test','A blood test usually involves taking a blood sample from a blood vessel in your arm',200,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-18 23:03:22',NULL,NULL);
/*!40000 ALTER TABLE `lab_test_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medical_supplies`
--

DROP TABLE IF EXISTS `medical_supplies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_supplies` (
  `id` char(36) NOT NULL,
  `ms_product_name` varchar(255) NOT NULL,
  `ms_quantity` int NOT NULL,
  `ms_manufactured_date` date NOT NULL,
  `ms_import_date` date NOT NULL,
  `ms_expire_date` date NOT NULL,
  `ms_manufacturer` varchar(255) NOT NULL,
  `ms_batch_number` int NOT NULL,
  `ms_unit_price` float NOT NULL,
  `ms_tax` float NOT NULL,
  `ms_purpose` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `medical_supplies_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `medical_supplies_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_supplies`
--

LOCK TABLES `medical_supplies` WRITE;
/*!40000 ALTER TABLE `medical_supplies` DISABLE KEYS */;
INSERT INTO `medical_supplies` VALUES ('MEDICALSUPPLIES-001','Oxygen Tank',12,'2021-11-01','2021-11-02','2021-11-03','manufacturer',1425,500,0,'purpose','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:56:30',NULL,NULL);
/*!40000 ALTER TABLE `medical_supplies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medical_supplies_prescriptions`
--

DROP TABLE IF EXISTS `medical_supplies_prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medical_supplies_prescriptions` (
  `id` char(36) NOT NULL,
  `medical_supply_prescription_no` varchar(255) NOT NULL,
  `prescription_id` char(36) DEFAULT NULL,
  `medical_supply_id` char(36) DEFAULT NULL,
  `quantity` int NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `prescription_id` (`prescription_id`),
  KEY `medical_supply_id` (`medical_supply_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `medical_supplies_prescriptions_ibfk_1` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`id`),
  CONSTRAINT `medical_supplies_prescriptions_ibfk_2` FOREIGN KEY (`medical_supply_id`) REFERENCES `medical_supplies` (`id`),
  CONSTRAINT `medical_supplies_prescriptions_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `medical_supplies_prescriptions_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_supplies_prescriptions`
--

LOCK TABLES `medical_supplies_prescriptions` WRITE;
/*!40000 ALTER TABLE `medical_supplies_prescriptions` DISABLE KEYS */;
INSERT INTO `medical_supplies_prescriptions` VALUES ('MEDICALSUPPLIESPRESCRIPTION-001','MEDICALSUPPLIESPRESCRIPTION01','PRESCRIPTION-001','MEDICALSUPPLIES-001',1,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:59:11',NULL,NULL),('MEDICALSUPPLIESPRESCRIPTION-002','MEDICALSUPPLIESPRESCRIPTION02','PRESCRIPTION-002','MEDICALSUPPLIES-001',2,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:59:11',NULL,NULL);
/*!40000 ALTER TABLE `medical_supplies_prescriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicine_prescriptions`
--

DROP TABLE IF EXISTS `medicine_prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicine_prescriptions` (
  `id` char(36) NOT NULL,
  `medicine_prescription_no` varchar(255) NOT NULL,
  `prescription_id` char(36) NOT NULL,
  `medicine_id` char(36) NOT NULL,
  `quantity` int NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `prescription_id` (`prescription_id`),
  KEY `medicine_id` (`medicine_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `medicine_prescriptions_ibfk_1` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`id`),
  CONSTRAINT `medicine_prescriptions_ibfk_2` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`),
  CONSTRAINT `medicine_prescriptions_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `medicine_prescriptions_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicine_prescriptions`
--

LOCK TABLES `medicine_prescriptions` WRITE;
/*!40000 ALTER TABLE `medicine_prescriptions` DISABLE KEYS */;
INSERT INTO `medicine_prescriptions` VALUES ('MEDICINEPRESCRIPTION-001','MEDICINEPRESCRIPTION01','PRESCRIPTION-001','MEDICINE-001',5,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:57:45',NULL,NULL),('MEDICINEPRESCRIPTION-002','MEDICINEPRESCRIPTION02','PRESCRIPTION-002','MEDICINE-002',10,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:57:45',NULL,NULL);
/*!40000 ALTER TABLE `medicine_prescriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicines`
--

DROP TABLE IF EXISTS `medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicines` (
  `id` char(36) NOT NULL,
  `med_product_name` varchar(255) NOT NULL,
  `med_quantity` int NOT NULL,
  `med_manufactured_date` date NOT NULL,
  `med_import_date` date NOT NULL,
  `med_expiration_date` date NOT NULL,
  `med_manufacturer` varchar(255) NOT NULL,
  `med_batch_number` int NOT NULL,
  `med_unit_price` float NOT NULL,
  `med_tax` float NOT NULL,
  `med_purpose` text NOT NULL,
  `dosage` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `medicines_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `medicines_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicines`
--

LOCK TABLES `medicines` WRITE;
/*!40000 ALTER TABLE `medicines` DISABLE KEYS */;
INSERT INTO `medicines` VALUES ('MEDICINE-001','Amoxicillin',300,'2021-11-01','2021-11-08','2021-11-15','manufacturer',1021,10,0,'purpose','500','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:54:32',NULL,NULL),('MEDICINE-002','Painkiller',500,'2021-11-01','2021-11-08','2021-11-15','manufacturer',1021,20,0,'purpose','500','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:54:32',NULL,NULL);
/*!40000 ALTER TABLE `medicines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outpatient_lab_request_payments`
--

DROP TABLE IF EXISTS `outpatient_lab_request_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `outpatient_lab_request_payments` (
  `id` char(36) NOT NULL,
  `or_no` varchar(255) NOT NULL,
  `lab_request_id` char(36) NOT NULL,
  `patient_cash_payment_id` char(36) DEFAULT NULL,
  `patient_check_payment_id` char(36) DEFAULT NULL,
  `payment_method_id` char(36) NOT NULL,
  `payment_term_id` char(36) NOT NULL,
  `amount_paid` float NOT NULL,
  `date_of_payment` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `or_no` (`or_no`),
  KEY `lab_request_id` (`lab_request_id`),
  KEY `patient_cash_payment_id` (`patient_cash_payment_id`),
  KEY `patient_check_payment_id` (`patient_check_payment_id`),
  KEY `payment_method_id` (`payment_method_id`),
  KEY `payment_term_id` (`payment_term_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `outpatient_lab_request_payments_ibfk_1` FOREIGN KEY (`lab_request_id`) REFERENCES `lab_requests` (`id`),
  CONSTRAINT `outpatient_lab_request_payments_ibfk_2` FOREIGN KEY (`patient_cash_payment_id`) REFERENCES `patient_cash_payments` (`id`),
  CONSTRAINT `outpatient_lab_request_payments_ibfk_3` FOREIGN KEY (`patient_check_payment_id`) REFERENCES `patient_check_payments` (`id`),
  CONSTRAINT `outpatient_lab_request_payments_ibfk_4` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`),
  CONSTRAINT `outpatient_lab_request_payments_ibfk_5` FOREIGN KEY (`payment_term_id`) REFERENCES `payment_terms` (`id`),
  CONSTRAINT `outpatient_lab_request_payments_ibfk_6` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `outpatient_lab_request_payments_ibfk_7` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outpatient_lab_request_payments`
--

LOCK TABLES `outpatient_lab_request_payments` WRITE;
/*!40000 ALTER TABLE `outpatient_lab_request_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `outpatient_lab_request_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outpatient_treatment_payments`
--

DROP TABLE IF EXISTS `outpatient_treatment_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `outpatient_treatment_payments` (
  `id` char(36) NOT NULL,
  `or_no` varchar(255) NOT NULL,
  `treatment_id` char(36) NOT NULL,
  `patient_cash_payment_id` char(36) DEFAULT NULL,
  `patient_check_payment_id` char(36) DEFAULT NULL,
  `payment_method_id` char(36) NOT NULL,
  `payment_term_id` char(36) NOT NULL,
  `amount_paid` float NOT NULL,
  `date_of_payment` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `or_no` (`or_no`),
  KEY `treatment_id` (`treatment_id`),
  KEY `patient_cash_payment_id` (`patient_cash_payment_id`),
  KEY `patient_check_payment_id` (`patient_check_payment_id`),
  KEY `payment_method_id` (`payment_method_id`),
  KEY `payment_term_id` (`payment_term_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `outpatient_treatment_payments_ibfk_1` FOREIGN KEY (`treatment_id`) REFERENCES `treatments` (`id`),
  CONSTRAINT `outpatient_treatment_payments_ibfk_2` FOREIGN KEY (`patient_cash_payment_id`) REFERENCES `patient_cash_payments` (`id`),
  CONSTRAINT `outpatient_treatment_payments_ibfk_3` FOREIGN KEY (`patient_check_payment_id`) REFERENCES `patient_check_payments` (`id`),
  CONSTRAINT `outpatient_treatment_payments_ibfk_4` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`),
  CONSTRAINT `outpatient_treatment_payments_ibfk_5` FOREIGN KEY (`payment_term_id`) REFERENCES `payment_terms` (`id`),
  CONSTRAINT `outpatient_treatment_payments_ibfk_6` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `outpatient_treatment_payments_ibfk_7` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outpatient_treatment_payments`
--

LOCK TABLES `outpatient_treatment_payments` WRITE;
/*!40000 ALTER TABLE `outpatient_treatment_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `outpatient_treatment_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outpatients`
--

DROP TABLE IF EXISTS `outpatients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `outpatients` (
  `id` char(36) NOT NULL,
  `outpatient_no` varchar(255) NOT NULL,
  `patient_id` char(36) DEFAULT NULL,
  `walk_in_date` date NOT NULL,
  `purpose` varchar(255) NOT NULL,
  `tests` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `outpatients_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`),
  CONSTRAINT `outpatients_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `outpatients_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outpatients`
--

LOCK TABLES `outpatients` WRITE;
/*!40000 ALTER TABLE `outpatients` DISABLE KEYS */;
INSERT INTO `outpatients` VALUES ('OUTPATIENT-001','OUTPATIENT01','PATIENT-003','2021-12-01','purpose','tests','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-07 06:59:01',NULL,NULL),('OUTPATIENT-002','OUTPATIENT02','PATIENT-004','2021-12-01','purpose','tests','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-07 06:59:01',NULL,NULL),('OUTPATIENT-003','OUTPATIENT03','PATIENT-008','2021-12-16','purpose','tests','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-07 06:59:01',NULL,NULL);
/*!40000 ALTER TABLE `outpatients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient_cash_payments`
--

DROP TABLE IF EXISTS `patient_cash_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_cash_payments` (
  `id` char(36) NOT NULL,
  `cash_payment_no` varchar(255) NOT NULL,
  `amount` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cash_payment_no` (`cash_payment_no`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `patient_cash_payments_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `patient_cash_payments_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient_cash_payments`
--

LOCK TABLES `patient_cash_payments` WRITE;
/*!40000 ALTER TABLE `patient_cash_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `patient_cash_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient_check_payments`
--

DROP TABLE IF EXISTS `patient_check_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_check_payments` (
  `id` char(36) NOT NULL,
  `check_no` varchar(255) NOT NULL,
  `check_date` date NOT NULL,
  `account_name` varchar(255) NOT NULL,
  `account_no` varchar(255) NOT NULL,
  `rt_number` varchar(255) NOT NULL,
  `payee_name` varchar(255) NOT NULL,
  `amount` float NOT NULL,
  `bank_name` varchar(255) NOT NULL,
  `bank_address` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `check_status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `check_no` (`check_no`),
  UNIQUE KEY `rt_number` (`rt_number`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `patient_check_payments_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `patient_check_payments_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient_check_payments`
--

LOCK TABLES `patient_check_payments` WRITE;
/*!40000 ALTER TABLE `patient_check_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `patient_check_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `id` char(36) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `sex` varchar(255) NOT NULL,
  `birthdate` date NOT NULL,
  `weight` varchar(255) NOT NULL,
  `height` varchar(255) NOT NULL,
  `blood_type` varchar(255) NOT NULL,
  `guardian` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `contact_number` varchar(255) NOT NULL,
  `patient_type` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `patients_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES ('PATIENT-001','Jhon Paul','P.','Cortezano','Male','2021-11-18','50','165','O','Marites Cortezano','San Mateo, Rizal','09123456789','Inpatient','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-18 23:14:55',NULL,NULL),('PATIENT-002','Michael Jude','C.','Culile','Male','2021-11-02','60','150','AB','Bogart Culile','San Mateo, Rizal','09123456789','Inpatient','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 21:05:01',NULL,NULL),('PATIENT-003','Julie Ann','B.','Trucilla','Female','2021-11-03','70','149','B','Maria Trucilla','Somewhere, Quezon City','09123456789','Outpatient','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 21:10:09',NULL,NULL),('PATIENT-004','Michael','L.','Aficial','Male','2021-11-01','80','130','O','Marites Aficial','Payatas, Quezon City','09123456789','Outpatient','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 21:10:09',NULL,NULL),('PATIENT-005','Mery Anne','Z.','Fermin','Female','2021-09-09','60','140','AB','Susan Fermin','Malabon City','09123456789','Inpatient','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 21:10:09',NULL,NULL),('PATIENT-006','Juvielyn','Z.','Berzuela','Male','2021-09-11','50','120','AB','Nine Berzuela','Don Fabian, Quezon City','09123456789','Inpatient','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 21:10:09',NULL,NULL),('PATIENT-007','Rafael','P.','Malimban','Male','2021-09-11','50','120','AB','Bogart Malimban','Bagong Silanganan, Quezon City','09123456789','Outpatient','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 21:10:09',NULL,NULL),('PATIENT-008','Riezel Mae','P.','Sanchez','Female','2021-09-11','50','120','AB','Maria Sanchez','Bulacan','09123456789','Inpatient','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 21:10:09',NULL,NULL);
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `id` char(36) NOT NULL,
  `method_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `method_name` (`method_name`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `payment_methods_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `payment_methods_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES ('37c5d1b0-486f-43ab-bae9-1add99b7747a','Cash','an immediate payment in cash','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-18 22:39:57',NULL,NULL),('6f255895-bfa8-47e0-869a-002efc61d64e','Check','a negotiable instrument drawn against deposited funds','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-18 22:40:35',NULL,NULL);
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_terms`
--

DROP TABLE IF EXISTS `payment_terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_terms` (
  `id` char(36) NOT NULL,
  `term_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `term_name` (`term_name`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `payment_terms_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `payment_terms_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_terms`
--

LOCK TABLES `payment_terms` WRITE;
/*!40000 ALTER TABLE `payment_terms` DISABLE KEYS */;
INSERT INTO `payment_terms` VALUES ('9624a595-f735-41ca-b67f-3b6f11f5bdb9','Partial Payment','Partial payment refers to the payment of an invoice that is less than the full amount due','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-18 22:38:58',NULL,NULL),('a747bb82-49d1-4e9e-ac35-8ed8e7ae81b5','Full Payment','Fully paid and full payment both mean that there is no outstanding debt ie the balance previously owed on a transaction is zero','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-18 22:35:07',NULL,NULL);
/*!40000 ALTER TABLE `payment_terms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescription_bills`
--

DROP TABLE IF EXISTS `prescription_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescription_bills` (
  `id` char(36) NOT NULL,
  `prescription_bill_no` varchar(255) NOT NULL,
  `inpatient_bill_id` char(36) NOT NULL,
  `inpatient_id` char(36) NOT NULL,
  `billing_date` date NOT NULL,
  `medicine_amount` float NOT NULL,
  `medical_amount` float NOT NULL,
  `sub_total` float NOT NULL,
  `total_amount` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `inpatient_bill_id` (`inpatient_bill_id`),
  KEY `inpatient_id` (`inpatient_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `prescription_bills_ibfk_1` FOREIGN KEY (`inpatient_bill_id`) REFERENCES `inpatient_bills` (`id`),
  CONSTRAINT `prescription_bills_ibfk_2` FOREIGN KEY (`inpatient_id`) REFERENCES `inpatients` (`id`),
  CONSTRAINT `prescription_bills_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `prescription_bills_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescription_bills`
--

LOCK TABLES `prescription_bills` WRITE;
/*!40000 ALTER TABLE `prescription_bills` DISABLE KEYS */;
INSERT INTO `prescription_bills` VALUES ('PRESCRIPTIONBILL-001','PRESCRIPTIONBILL01','INPATIENTBILL-001','INPATIENT-001','2021-11-19',50,500,550,550,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 14:43:08','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:03:38'),('PRESCRIPTIONBILL-002','PRESCRIPTIONBILL02','INPATIENTBILL-002','INPATIENT-002','2021-11-20',200,1000,1200,1200,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 20:57:30','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:13:48'),('PRESCRIPTIONBILL-003','PRESCRIPTIONBILL03','INPATIENTBILL-003','INPATIENT-003','2021-12-20',500,500,1000,1000,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 20:57:30','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:13:48'),('PRESCRIPTIONBILL-004','PRESCRIPTIONBILL04','INPATIENTBILL-004','INPATIENT-004','2022-01-03',200,300,500,500,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 20:57:30','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:13:48');
/*!40000 ALTER TABLE `prescription_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescriptions`
--

DROP TABLE IF EXISTS `prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescriptions` (
  `id` char(36) NOT NULL,
  `prescription_no` varchar(255) NOT NULL,
  `inpatient_id` char(36) DEFAULT NULL,
  `outpatient_id` char(36) DEFAULT NULL,
  `date_prescribed` date NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `inpatient_id` (`inpatient_id`),
  KEY `outpatient_id` (`outpatient_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `prescriptions_ibfk_1` FOREIGN KEY (`inpatient_id`) REFERENCES `inpatients` (`id`),
  CONSTRAINT `prescriptions_ibfk_2` FOREIGN KEY (`outpatient_id`) REFERENCES `outpatients` (`id`),
  CONSTRAINT `prescriptions_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `prescriptions_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescriptions`
--

LOCK TABLES `prescriptions` WRITE;
/*!40000 ALTER TABLE `prescriptions` DISABLE KEYS */;
INSERT INTO `prescriptions` VALUES ('PRESCRIPTION-001','PRESCRIPTION01','INPATIENT-001',NULL,'2021-11-19','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 14:41:31',NULL,NULL),('PRESCRIPTION-002','PRESCRIPTION02','INPATIENT-002',NULL,'2021-11-22','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:52:02',NULL,NULL),('PRESCRIPTION-003','PRESCRIPTION03',NULL,'OUTPATIENT-001','2021-11-03','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:52:02',NULL,NULL),('PRESCRIPTION-004','PRESCRIPTION04',NULL,'OUTPATIENT-002','2021-12-16','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:52:02',NULL,NULL),('PRESCRIPTION-005','PRESCRIPTION05','INPATIENT-003',NULL,'2021-10-25','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:52:02',NULL,NULL),('PRESCRIPTION-006','PRESCRIPTION06','INPATIENT-004',NULL,'2021-12-01','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:52:02',NULL,NULL);
/*!40000 ALTER TABLE `prescriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_categories`
--

DROP TABLE IF EXISTS `product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_categories` (
  `id` char(36) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_name` (`category_name`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `product_categories_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `product_categories_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_categories`
--

LOCK TABLES `product_categories` WRITE;
/*!40000 ALTER TABLE `product_categories` DISABLE KEYS */;
INSERT INTO `product_categories` VALUES ('PRODUCTCATEGORY-001','Medical Supplies','Description','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:41:06',NULL,NULL),('PRODUCTCATEGORY-002','IT Supplies','computer products including hardware, software, upgrades, accessories and more','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-26 17:30:45',NULL,NULL);
/*!40000 ALTER TABLE `product_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` char(36) NOT NULL,
  `product_category_id` char(36) NOT NULL,
  `product_pic` varchar(255) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_details` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_category_id` (`product_category_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`product_category_id`) REFERENCES `product_categories` (`id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `products_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('PRODUCT-001','PRODUCTCATEGORY-001','PIC','Facemask','details','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:41:49',NULL,NULL),('PRODUCT-002','PRODUCTCATEGORY-002','PIC','HP Laptop','a reliable laptops with very competent customer service.','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-26 17:32:39',NULL,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_order_bills`
--

DROP TABLE IF EXISTS `purchase_order_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_order_bills` (
  `id` char(36) NOT NULL,
  `purchase_order_bill_no` varchar(255) NOT NULL,
  `purchase_order_vendor_bill_id` char(36) NOT NULL,
  `purchase_order_id` char(36) NOT NULL,
  `total_bill` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `purchase_order_bill_no` (`purchase_order_bill_no`),
  KEY `purchase_order_vendor_bill_id` (`purchase_order_vendor_bill_id`),
  KEY `purchase_order_id` (`purchase_order_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `purchase_order_bills_ibfk_1` FOREIGN KEY (`purchase_order_vendor_bill_id`) REFERENCES `purchase_order_vendor_bills` (`id`),
  CONSTRAINT `purchase_order_bills_ibfk_2` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`),
  CONSTRAINT `purchase_order_bills_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `purchase_order_bills_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_order_bills`
--

LOCK TABLES `purchase_order_bills` WRITE;
/*!40000 ALTER TABLE `purchase_order_bills` DISABLE KEYS */;
INSERT INTO `purchase_order_bills` VALUES ('PURCHASEORDERBILL-001','PURCHASEORDERBILL01','PURCHASEORDERVENDORBILLS-001','PURCHASEORDER-001',12000,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:49:15','65501c6d-fad9-4401-9ff6-18a7b1626cea','2022-03-05 13:16:41'),('PURCHASEORDERBILL-002','PURCHASEORDERBILL02','PURCHASEORDERVENDORBILLS-001','PURCHASEORDER-002',30000,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-26 17:47:11',NULL,NULL),('PURCHASEORDERBILL-003','PURCHASEORDERBILL03','PURCHASEORDERVENDORBILLS-002','PURCHASEORDER-003',50000,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-26 17:47:11',NULL,NULL);
/*!40000 ALTER TABLE `purchase_order_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_order_details`
--

DROP TABLE IF EXISTS `purchase_order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_order_details` (
  `id` char(36) NOT NULL,
  `purchase_order_id` char(36) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_category` varchar(255) DEFAULT NULL,
  `quantity` int NOT NULL,
  `product_price` float NOT NULL,
  `total_cost` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `purchase_order_id` (`purchase_order_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `ix_purchase_order_details_product_category` (`product_category`),
  CONSTRAINT `purchase_order_details_ibfk_1` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`),
  CONSTRAINT `purchase_order_details_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `purchase_order_details_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_order_details`
--

LOCK TABLES `purchase_order_details` WRITE;
/*!40000 ALTER TABLE `purchase_order_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_order_payments`
--

DROP TABLE IF EXISTS `purchase_order_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_order_payments` (
  `id` char(36) NOT NULL,
  `or_no` varchar(255) NOT NULL,
  `purchase_order_vendor_payment_id` char(36) NOT NULL,
  `purchase_order_bill_id` char(36) NOT NULL,
  `hospital_cash_payment_id` char(36) DEFAULT NULL,
  `hospital_check_payment_id` char(36) DEFAULT NULL,
  `payment_method_id` char(36) NOT NULL,
  `amount_paid` float NOT NULL,
  `date_of_payment` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `or_no` (`or_no`),
  KEY `purchase_order_vendor_payment_id` (`purchase_order_vendor_payment_id`),
  KEY `purchase_order_bill_id` (`purchase_order_bill_id`),
  KEY `hospital_cash_payment_id` (`hospital_cash_payment_id`),
  KEY `hospital_check_payment_id` (`hospital_check_payment_id`),
  KEY `payment_method_id` (`payment_method_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `purchase_order_payments_ibfk_1` FOREIGN KEY (`purchase_order_vendor_payment_id`) REFERENCES `purchase_order_vendor_payments` (`id`),
  CONSTRAINT `purchase_order_payments_ibfk_2` FOREIGN KEY (`purchase_order_bill_id`) REFERENCES `purchase_order_bills` (`id`),
  CONSTRAINT `purchase_order_payments_ibfk_3` FOREIGN KEY (`hospital_cash_payment_id`) REFERENCES `hospital_cash_payments` (`id`),
  CONSTRAINT `purchase_order_payments_ibfk_4` FOREIGN KEY (`hospital_check_payment_id`) REFERENCES `hospital_check_payments` (`id`),
  CONSTRAINT `purchase_order_payments_ibfk_5` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`),
  CONSTRAINT `purchase_order_payments_ibfk_6` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `purchase_order_payments_ibfk_7` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_order_payments`
--

LOCK TABLES `purchase_order_payments` WRITE;
/*!40000 ALTER TABLE `purchase_order_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_order_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_order_vendor_bills`
--

DROP TABLE IF EXISTS `purchase_order_vendor_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_order_vendor_bills` (
  `id` char(36) NOT NULL,
  `purchase_order_vendor_bill_no` varchar(255) NOT NULL,
  `vendor_id` char(36) NOT NULL,
  `total_vendor_bill` float NOT NULL,
  `date_of_billing` date NOT NULL,
  `due_date` date NOT NULL,
  `remaining_balance` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `purchase_order_vendor_bill_no` (`purchase_order_vendor_bill_no`),
  KEY `vendor_id` (`vendor_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `purchase_order_vendor_bills_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`),
  CONSTRAINT `purchase_order_vendor_bills_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `purchase_order_vendor_bills_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_order_vendor_bills`
--

LOCK TABLES `purchase_order_vendor_bills` WRITE;
/*!40000 ALTER TABLE `purchase_order_vendor_bills` DISABLE KEYS */;
INSERT INTO `purchase_order_vendor_bills` VALUES ('PURCHASEORDERVENDORBILLS-001','PURCHASEORDERVENDORBILLS01','VENDOR-001',42000,'2021-11-08','2021-11-21',30000,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:48:48','65501c6d-fad9-4401-9ff6-18a7b1626cea','2022-03-05 13:16:41'),('PURCHASEORDERVENDORBILLS-002','PURCHASEORDERVENDORBILLS02','VENDOR-003',50000,'2021-11-08','2021-11-21',50000,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:48:48','65501c6d-fad9-4401-9ff6-18a7b1626cea','2022-03-05 13:16:41');
/*!40000 ALTER TABLE `purchase_order_vendor_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_order_vendor_payments`
--

DROP TABLE IF EXISTS `purchase_order_vendor_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_order_vendor_payments` (
  `id` char(36) NOT NULL,
  `or_no` varchar(255) NOT NULL,
  `purchase_order_vendor_bill_id` char(36) NOT NULL,
  `total_amount_paid` float NOT NULL,
  `payment_term_id` char(36) NOT NULL,
  `date_of_payment` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hospital_cash_payment_id` char(36) DEFAULT NULL,
  `hospital_check_payment_id` char(36) DEFAULT NULL,
  `payment_method_id` char(36) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `or_no` (`or_no`),
  KEY `purchase_order_vendor_bill_id` (`purchase_order_vendor_bill_id`),
  KEY `payment_term_id` (`payment_term_id`),
  KEY `hospital_cash_payment_id` (`hospital_cash_payment_id`),
  KEY `hospital_check_payment_id` (`hospital_check_payment_id`),
  KEY `payment_method_id` (`payment_method_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `purchase_order_vendor_payments_ibfk_1` FOREIGN KEY (`purchase_order_vendor_bill_id`) REFERENCES `purchase_order_vendor_bills` (`id`),
  CONSTRAINT `purchase_order_vendor_payments_ibfk_2` FOREIGN KEY (`payment_term_id`) REFERENCES `payment_terms` (`id`),
  CONSTRAINT `purchase_order_vendor_payments_ibfk_3` FOREIGN KEY (`hospital_cash_payment_id`) REFERENCES `hospital_cash_payments` (`id`),
  CONSTRAINT `purchase_order_vendor_payments_ibfk_4` FOREIGN KEY (`hospital_check_payment_id`) REFERENCES `hospital_check_payments` (`id`),
  CONSTRAINT `purchase_order_vendor_payments_ibfk_5` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`),
  CONSTRAINT `purchase_order_vendor_payments_ibfk_6` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `purchase_order_vendor_payments_ibfk_7` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_order_vendor_payments`
--

LOCK TABLES `purchase_order_vendor_payments` WRITE;
/*!40000 ALTER TABLE `purchase_order_vendor_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_order_vendor_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_orders`
--

DROP TABLE IF EXISTS `purchase_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_orders` (
  `id` char(36) NOT NULL,
  `purchase_order_number` varchar(255) NOT NULL,
  `vendor_bidding_item_id` char(36) DEFAULT NULL,
  `order_date` date NOT NULL,
  `expected_delivery_date` date NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `shipping_method` varchar(255) NOT NULL,
  `notes` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `purchase_order_number` (`purchase_order_number`),
  KEY `vendor_bidding_item_id` (`vendor_bidding_item_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`vendor_bidding_item_id`) REFERENCES `vendor_bidding_items` (`id`),
  CONSTRAINT `purchase_orders_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `purchase_orders_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_orders`
--

LOCK TABLES `purchase_orders` WRITE;
/*!40000 ALTER TABLE `purchase_orders` DISABLE KEYS */;
INSERT INTO `purchase_orders` VALUES ('PURCHASEORDER-001','PURCHASEORDER-001','VENDORBIDDING-001','2021-11-20','2021-11-30','cash','air','notes','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:47:40',NULL,NULL),('PURCHASEORDER-002','PURCHASEORDER02','VENDORBIDDING-002','2021-11-26','2021-11-30','cash','j&t','notes','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-26 17:40:32',NULL,NULL),('PURCHASEORDER-003','PURCHASEORDER03','VENDORBIDDING-003','2021-11-21','2021-12-31','cash','j&t','notes','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-26 17:40:32',NULL,NULL);
/*!40000 ALTER TABLE `purchase_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_requisition_details`
--

DROP TABLE IF EXISTS `purchase_requisition_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_requisition_details` (
  `id` char(36) NOT NULL,
  `purchase_requisition_id` char(36) NOT NULL,
  `new_product_category` varchar(255) NOT NULL,
  `new_product_name` varchar(255) NOT NULL,
  `product_id` char(36) NOT NULL,
  `quantity` int NOT NULL,
  `description` text,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `purchase_requisition_id` (`purchase_requisition_id`),
  KEY `product_id` (`product_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `ix_purchase_requisition_details_description` (`description`(768))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_requisition_details`
--

LOCK TABLES `purchase_requisition_details` WRITE;
/*!40000 ALTER TABLE `purchase_requisition_details` DISABLE KEYS */;
INSERT INTO `purchase_requisition_details` VALUES ('PURCHASEREQUISITIONSDETAILS-001','PURCHASEREQUISITIONS-001','Medical Supplies','Facemask','PRODUCT-001',100,'decription','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:43:40',NULL,NULL),('PURCHASEREQUISITIONSDETAILS-002','PURCHASEREQUISITIONS-002','IT Supplies','HP Laptops','PRODUCT-002',50,'description','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-26 17:35:25',NULL,NULL);
/*!40000 ALTER TABLE `purchase_requisition_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_requisitions`
--

DROP TABLE IF EXISTS `purchase_requisitions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_requisitions` (
  `id` char(36) NOT NULL,
  `purchase_requisition_number` varchar(255) NOT NULL,
  `purpose` text NOT NULL,
  `date_requested` date NOT NULL,
  `department_id` char(36) NOT NULL,
  `approved_by` char(36) NOT NULL,
  `reason` text,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `purchase_requisition_number` (`purchase_requisition_number`),
  KEY `department_id` (`department_id`),
  KEY `approved_by` (`approved_by`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_requisitions`
--

LOCK TABLES `purchase_requisitions` WRITE;
/*!40000 ALTER TABLE `purchase_requisitions` DISABLE KEYS */;
INSERT INTO `purchase_requisitions` VALUES ('PURCHASEREQUISITIONS-001','PURCHASEREQUISITIONS01','purpose','2021-11-20','DEPT-001','65501c6d-fad9-4401-9ff6-18a7b1626cea','reason','Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:42:44',NULL,NULL),('PURCHASEREQUISITIONS-002','PURCHASEREQUISITIONS02','purpose','2021-11-20','DEPT-001','65501c6d-fad9-4401-9ff6-18a7b1626cea','for monitoring hospital records','Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:42:44',NULL,NULL);
/*!40000 ALTER TABLE `purchase_requisitions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `request_quotations`
--

DROP TABLE IF EXISTS `request_quotations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `request_quotations` (
  `id` char(36) NOT NULL,
  `request_quotation_number` varchar(255) NOT NULL,
  `vendor_id` char(36) NOT NULL,
  `purchase_requisition_id` char(36) NOT NULL,
  `message` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `request_quotation_number` (`request_quotation_number`),
  KEY `vendor_id` (`vendor_id`),
  KEY `purchase_requisition_id` (`purchase_requisition_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `request_quotations`
--

LOCK TABLES `request_quotations` WRITE;
/*!40000 ALTER TABLE `request_quotations` DISABLE KEYS */;
INSERT INTO `request_quotations` VALUES ('REQUESTQUOTATION-001','REQUESTQUOTATION01','VENDOR-001','PURCHASEREQUISITIONS-001','message','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:44:17',NULL,NULL),('REQUESTQUOTATION-002','REQUESTQUOTATION02','VENDOR-001','PURCHASEREQUISITIONS-002','message','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-26 17:36:34',NULL,NULL);
/*!40000 ALTER TABLE `request_quotations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_admissions`
--

DROP TABLE IF EXISTS `room_admissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_admissions` (
  `id` char(36) NOT NULL,
  `inpatient_id` char(36) NOT NULL,
  `room_id` char(36) NOT NULL,
  `admission_date` date NOT NULL,
  `discharge_date` date DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Admitted',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `inpatient_id` (`inpatient_id`),
  KEY `room_id` (`room_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_admissions`
--

LOCK TABLES `room_admissions` WRITE;
/*!40000 ALTER TABLE `room_admissions` DISABLE KEYS */;
INSERT INTO `room_admissions` VALUES ('ROOMADMISSION-001','INPATIENT-001','ROOM-001','2021-11-01','2021-11-08','Admitted','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:01:39',NULL,NULL),('ROOMADMISSION-002','INPATIENT-002','ROOM-002','2021-11-14','2021-11-17','Admitted','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:34:01',NULL,NULL),('ROOMADMISSION-003','INPATIENT-003','ROOM-003','2021-12-01','2021-12-06','Admitted','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:34:01',NULL,NULL),('ROOMADMISSION-004','INPATIENT-004','ROOM-004','2021-12-10','2021-12-21','Admitted','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:34:01',NULL,NULL);
/*!40000 ALTER TABLE `room_admissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_bills`
--

DROP TABLE IF EXISTS `room_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_bills` (
  `id` char(36) NOT NULL,
  `room_bill_no` varchar(255) NOT NULL,
  `room_admission_id` char(36) NOT NULL,
  `inpatient_bill_id` char(36) NOT NULL,
  `no_of_days` int NOT NULL,
  `total_amount` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `room_bill_no` (`room_bill_no`),
  KEY `room_admission_id` (`room_admission_id`),
  KEY `inpatient_bill_id` (`inpatient_bill_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_bills`
--

LOCK TABLES `room_bills` WRITE;
/*!40000 ALTER TABLE `room_bills` DISABLE KEYS */;
INSERT INTO `room_bills` VALUES ('ROOMBILL-001','ROOMBILL01','ROOMADMISSION-001','INPATIENTBILL-001',10,25000,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:02:22','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:03:55'),('ROOMBILL-002','ROOMBILL02','ROOMADMISSION-002','INPATIENTBILL-002',15,37500,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:26:14','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:14:51'),('ROOMBILL-003','ROOMBILL03','ROOMADMISSION-003','INPATIENTBILL-003',5,50000,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:26:14','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:14:51'),('ROOMBILL-004','ROOMBILL04','ROOMADMISSION-004','INPATIENTBILL-004',10,30000,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:26:14','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:14:51');
/*!40000 ALTER TABLE `room_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_types`
--

DROP TABLE IF EXISTS `room_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_types` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `fee` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_types`
--

LOCK TABLES `room_types` WRITE;
/*!40000 ALTER TABLE `room_types` DISABLE KEYS */;
INSERT INTO `room_types` VALUES ('4bae79c7-00ca-4e90-918a-3febd2ee71d8','Semi Private Room','The semi private room in a hospital is a room type that usually accommodates at least two (2) patients at any given time. It may have dividers for each bed for privacy.',1500,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-16 13:58:11',NULL,NULL),('50a1fb41-83c0-4164-8eda-1b33e5aed61e','Deluxe Room','Aesthetically designed for a single patient, this exclusive room has essential amenities like a closet, attached bathroom, nurse call system, personal locker, and television with multiple channels. The deluxe room comes with a comfortable sofa couch, chair and writing desk, and patient meals as per the dietician\'s approval.',2500,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-18 23:04:35',NULL,NULL),('7071496a-0d11-409c-9401-277e3cb371d7','Ward','A ward is a room type where multiple patients share a common area while recovering.',300,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-16 13:57:43',NULL,NULL),('8035750d-2d28-4ff2-9512-a444b577638d','NICU','These facilities are best for babies with congenital disorders.',4500,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-16 14:02:19',NULL,NULL),('835b7958-c5a2-4179-b1a7-6b52abbf758f','Suite Room','A suite in hospital defines luxury. In some cases, the amenities are similar to a hotel room. It is the most expensive hospital room with lots of features and benefits. ',10000,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-16 14:00:15',NULL,NULL),('8905fc66-224a-4fc7-9bdd-21db2cf6f5f2','Private Room','A hospital private room is a single occupancy room where only one patient is allowed to use it at any given time.',3000,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-16 13:58:34',NULL,NULL),('ac47fd2a-e7e1-457f-ab85-340e8fac9222','ICU','A special type of room may be needed by patients who require extra care, attention and device or equipment.',3500,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-16 14:00:42',NULL,NULL),('df261819-610a-4f21-b75e-9213136f18e8','PICU','The pediatric intensive care unit is a special room wherein babies and children can recover.',5000,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-16 14:01:12',NULL,NULL);
/*!40000 ALTER TABLE `room_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` char(36) NOT NULL,
  `room_number` varchar(255) NOT NULL,
  `room_type_id` char(36) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `room_type_id` (`room_type_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES ('ROOM-001','ROOM01','50a1fb41-83c0-4164-8eda-1b33e5aed61e','Deluxe','Second Floor','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 20:53:43',NULL,NULL),('ROOM-002','ROOM02','50a1fb41-83c0-4164-8eda-1b33e5aed61e','Description','Rooftop','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:33:08',NULL,NULL),('ROOM-003','ROOM03','835b7958-c5a2-4179-b1a7-6b52abbf758f','description','location','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:33:08',NULL,NULL),('ROOM-004','ROOM04','8905fc66-224a-4fc7-9bdd-21db2cf6f5f2','description','location','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:33:08',NULL,NULL);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales` (
  `id` char(36) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `gross_margin` float NOT NULL,
  `total_amount` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_departments`
--

DROP TABLE IF EXISTS `sub_departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_departments` (
  `id` char(36) NOT NULL,
  `main_department_id` char(36) DEFAULT NULL,
  `sub_department_name` char(36) DEFAULT NULL,
  `department_desc` text,
  `department_place` char(36) DEFAULT NULL,
  `department_manager` char(36) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `updated_by` (`updated_by`),
  KEY `created_by` (`created_by`),
  KEY `main_department_id` (`main_department_id`),
  KEY `department_manager` (`department_manager`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_departments`
--

LOCK TABLES `sub_departments` WRITE;
/*!40000 ALTER TABLE `sub_departments` DISABLE KEYS */;
/*!40000 ALTER TABLE `sub_departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `surgeries`
--

DROP TABLE IF EXISTS `surgeries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `surgeries` (
  `id` char(36) NOT NULL,
  `surgery_no` varchar(255) NOT NULL,
  `inpatient_id` char(36) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `surgery_type_id` char(36) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `surgery_no` (`surgery_no`),
  KEY `inpatient_id` (`inpatient_id`),
  KEY `surgery_type_id` (`surgery_type_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `surgeries`
--

LOCK TABLES `surgeries` WRITE;
/*!40000 ALTER TABLE `surgeries` DISABLE KEYS */;
INSERT INTO `surgeries` VALUES ('SURGERY-001','SURGERY01','INPATIENT-001','02:28:51','05:31:50','29457f83-aa29-4f5c-b5f4-b8487c78ebc6','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-18 23:35:13',NULL,NULL),('SURGERY-002','SURGERY02','INPATIENT-002','01:28:51','02:31:50','29457f83-aa29-4f5c-b5f4-b8487c78ebc6','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:36:51',NULL,NULL),('SURGERY-003','SURGERY03','INPATIENT-003','01:00:00','03:00:00','02a7e840-7c8c-4438-8d73-7ad0230b82cf','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:36:51',NULL,NULL),('SURGERY-004','SURGERY04','INPATIENT-004','01:00:00','03:00:00','874d9cfa-0db8-43b6-be30-b1762350a999','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:36:51',NULL,NULL);
/*!40000 ALTER TABLE `surgeries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `surgery_bills`
--

DROP TABLE IF EXISTS `surgery_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `surgery_bills` (
  `id` char(36) NOT NULL,
  `surgery_bill_no` varchar(255) NOT NULL,
  `surgery_id` char(36) NOT NULL,
  `inpatient_bill_id` char(36) NOT NULL,
  `total_amount` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `surgery_bill_no` (`surgery_bill_no`),
  KEY `surgery_id` (`surgery_id`),
  KEY `inpatient_bill_id` (`inpatient_bill_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `surgery_bills`
--

LOCK TABLES `surgery_bills` WRITE;
/*!40000 ALTER TABLE `surgery_bills` DISABLE KEYS */;
INSERT INTO `surgery_bills` VALUES ('SURGERYBILL-001','SURGERYBILL01','SURGERY-001','INPATIENTBILL-001',46500,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-18 23:37:04','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:05:37'),('SURGERYBILL-002','SURGERYBILL02','SURGERY-002','INPATIENTBILL-002',46500,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 21:01:06','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:16:16'),('SURGERYBILL-003','SURGERYBILL03','SURGERY-003','INPATIENTBILL-003',80000,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 21:01:06','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:16:16'),('SURGERYBILL-004','SURGERYBILL04','SURGERY-004','INPATIENTBILL-004',8400,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 21:01:06','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:16:16');
/*!40000 ALTER TABLE `surgery_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `surgery_in_charges`
--

DROP TABLE IF EXISTS `surgery_in_charges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `surgery_in_charges` (
  `id` char(36) NOT NULL,
  `surgery_id` char(36) NOT NULL,
  `employee_id` char(36) NOT NULL,
  `professional_fee` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `surgery_id` (`surgery_id`),
  KEY `employee_id` (`employee_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `surgery_in_charges`
--

LOCK TABLES `surgery_in_charges` WRITE;
/*!40000 ALTER TABLE `surgery_in_charges` DISABLE KEYS */;
INSERT INTO `surgery_in_charges` VALUES ('SURGERYINCHARGE-001','SURGERY-001','EMP-003',1500,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 12:09:26',NULL,NULL),('SURGERYINCHARGE-002','SURGERY-002','EMP-003',2000,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 12:09:26',NULL,NULL),('SURGERYINCHARGE-003','SURGERY-003','EMP-004',5000,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 12:09:26',NULL,NULL),('SURGERYINCHARGE-004','SURGERY-004','EMP-004',5000,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 12:09:26',NULL,NULL);
/*!40000 ALTER TABLE `surgery_in_charges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `surgery_types`
--

DROP TABLE IF EXISTS `surgery_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `surgery_types` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `fee` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `surgery_types`
--

LOCK TABLES `surgery_types` WRITE;
/*!40000 ALTER TABLE `surgery_types` DISABLE KEYS */;
INSERT INTO `surgery_types` VALUES ('02a7e840-7c8c-4438-8d73-7ad0230b82cf','Cesarean section','Cesarean section is the surgical delivery of a baby by an incision through the mother\'s abdomen and uterus.',80000,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-16 13:00:02',NULL,NULL),('29457f83-aa29-4f5c-b5f4-b8487c78ebc6','Breast Biopsy','A biopsy is a diagnostic test involving the removal of tissue or cells for examination under a microscope.',45000,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-18 23:00:56',NULL,NULL),('29d9c032-b0cd-4295-924a-cebf3c0d4462','Cataract surgery','Cataract surgery involves the removal of the cloudy lens, which is replaced with a clear artificial lens implant.',18500,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-16 12:59:07',NULL,NULL),('874d9cfa-0db8-43b6-be30-b1762350a999','Hysterectomy','A hysterectomy is the surgical removal of a woman\'s uterus.',8400,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-16 13:03:34',NULL,NULL),('a2653148-3080-4eb6-b837-8bf234fb7a0e','Appendectomy','An appendectomy is the surgical removal of the appendix, a small tube that branches off the large intestine, to treat acute appendicitis.',20000,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-16 12:58:20',NULL,NULL);
/*!40000 ALTER TABLE `surgery_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatment_bills`
--

DROP TABLE IF EXISTS `treatment_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatment_bills` (
  `id` char(36) NOT NULL,
  `treatment_bill_no` varchar(255) NOT NULL,
  `treatment_id` char(36) NOT NULL,
  `inpatient_bill_id` char(36) NOT NULL,
  `total_amount` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `treatment_bill_no` (`treatment_bill_no`),
  KEY `treatment_id` (`treatment_id`),
  KEY `inpatient_bill_id` (`inpatient_bill_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment_bills`
--

LOCK TABLES `treatment_bills` WRITE;
/*!40000 ALTER TABLE `treatment_bills` DISABLE KEYS */;
INSERT INTO `treatment_bills` VALUES ('TREATMENTBILL-001','TREATMENTBILL01','TREATMENT-001','INPATIENTBILL-001',2500,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 20:59:35','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:05:21'),('TREATMENTBILL-002','TREATMENTBILL02','TREATMENT-002','INPATIENTBILL-002',17000,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 21:00:03','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:15:53'),('TREATMENTBILL-003','TREATMENTBILL03','TREATMENT-005','INPATIENTBILL-003',10800,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 21:00:03','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:15:53'),('TREATMENTBILL-004','TREATMENTBILL04','TREATMENT-006','INPATIENTBILL-004',3000,'Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 21:00:03','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 13:15:53');
/*!40000 ALTER TABLE `treatment_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatment_in_charges`
--

DROP TABLE IF EXISTS `treatment_in_charges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatment_in_charges` (
  `id` char(36) NOT NULL,
  `treatment_id` char(36) NOT NULL,
  `employee_id` char(36) NOT NULL,
  `professional_fee` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `treatment_id` (`treatment_id`),
  KEY `employee_id` (`employee_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment_in_charges`
--

LOCK TABLES `treatment_in_charges` WRITE;
/*!40000 ALTER TABLE `treatment_in_charges` DISABLE KEYS */;
INSERT INTO `treatment_in_charges` VALUES ('TREATMENTINCHARGE-001','TREATMENT-001','EMP-003',1500,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 12:10:18',NULL,NULL),('TREATMENTINCHARGE-002','TREATMENT-002','EMP-003',2000,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 12:10:18',NULL,NULL),('TREATMENTINCHARGE-003','TREATMENT-003','EMP-003',500,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 12:10:18',NULL,NULL),('TREATMENTINCHARGE-004','TREATMENT-004','EMP-004',1000,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 12:10:18',NULL,NULL),('TREATMENTINCHARGE-005','TREATMENT-005','EMP-004',5000,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 12:10:18',NULL,NULL),('TREATMENTINCHARGE-006','TREATMENT-006','EMP-004',1000,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 12:10:18',NULL,NULL);
/*!40000 ALTER TABLE `treatment_in_charges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatment_types`
--

DROP TABLE IF EXISTS `treatment_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatment_types` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `fee` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment_types`
--

LOCK TABLES `treatment_types` WRITE;
/*!40000 ALTER TABLE `treatment_types` DISABLE KEYS */;
INSERT INTO `treatment_types` VALUES ('16288faa-9d46-415f-b4e3-b9f537782de9','Blood Tranfusion','Blood transfusion is the process of transferring blood products into one\'s circulation intravenously',3000,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-16 12:51:29',NULL,NULL),('a81989e5-faad-4b3d-b28a-768704945b31','Bone Marrow Biopsy','A bone marrow biopsy involves removing a small sample of the bone marrow inside your bones for testing',10880,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-16 12:53:14',NULL,NULL),('d36f9cdf-8f84-42b9-b82f-f963d10f9398','Radiation Therapy','A blood test usually involves taking a blood sample from a blood vessel in your arm',1000,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-18 23:02:30','65501c6d-fad9-4401-9ff6-18a7b1626cea','2022-08-31 01:22:43'),('da108b46-f978-4116-a383-536100c8a54b','Chemotherapy','a drug treatment that uses powerful chemicals to kill fast-growing cells in your body. ',15000,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-18 22:59:25',NULL,NULL),('e1d0ede0-be21-4d18-b8b5-a1060f2434dc','Gastrectomy','A gastrectomy is a medical procedure where all or part of the stomach is surgically removed.',63000,'Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-16 12:54:42',NULL,NULL);
/*!40000 ALTER TABLE `treatment_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatments`
--

DROP TABLE IF EXISTS `treatments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatments` (
  `id` char(36) NOT NULL,
  `treatment_no` varchar(255) NOT NULL,
  `inpatient_id` char(36) DEFAULT NULL,
  `outpatient_id` char(36) DEFAULT NULL,
  `treatment_type_id` char(36) NOT NULL,
  `description` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `treatment_no` (`treatment_no`),
  KEY `inpatient_id` (`inpatient_id`),
  KEY `outpatient_id` (`outpatient_id`),
  KEY `treatment_type_id` (`treatment_type_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatments`
--

LOCK TABLES `treatments` WRITE;
/*!40000 ALTER TABLE `treatments` DISABLE KEYS */;
INSERT INTO `treatments` VALUES ('TREATMENT-001','TREATMENT01','INPATIENT-001',NULL,'d36f9cdf-8f84-42b9-b82f-f963d10f9398','Treatment','Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-19 20:58:58',NULL,NULL),('TREATMENT-002','TREATMENT02','INPATIENT-002',NULL,'da108b46-f978-4116-a383-536100c8a54b','Description','Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:35:29',NULL,NULL),('TREATMENT-003','TREATMENT03',NULL,'OUTPATIENT-001','d36f9cdf-8f84-42b9-b82f-f963d10f9398','Description','Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:35:29','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-08 02:45:06'),('TREATMENT-004','TREATMENT04',NULL,'OUTPATIENT-002','e1d0ede0-be21-4d18-b8b5-a1060f2434dc','Description','Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:35:29','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-08 02:45:06'),('TREATMENT-005','TREATMENT05','INPATIENT-005',NULL,'a81989e5-faad-4b3d-b28a-768704945b31','Description','Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:35:29','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-08 02:45:06'),('TREATMENT-006','TREATMENT06','INPATIENT-006',NULL,'16288faa-9d46-415f-b4e3-b9f537782de9','Description','Pending','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:35:29','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-12-08 02:45:06');
/*!40000 ALTER TABLE `treatments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_types`
--

DROP TABLE IF EXISTS `user_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_types` (
  `id` char(36) NOT NULL,
  `user_type` varchar(15) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `updated_by` (`updated_by`),
  KEY `created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_types`
--

LOCK TABLES `user_types` WRITE;
/*!40000 ALTER TABLE `user_types` DISABLE KEYS */;
INSERT INTO `user_types` VALUES ('USERTYPE-001','Accountant','Active',NULL,'2021-11-18 22:19:38',NULL,NULL);
/*!40000 ALTER TABLE `user_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_type_id` char(36) DEFAULT NULL,
  `employee_id` char(36) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_users_email` (`email`),
  KEY `ix_users_id` (`id`),
  KEY `user_type_id` (`user_type_id`),
  KEY `employee_id` (`employee_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('65501c6d-fad9-4401-9ff6-18a7b1626cea','accountant@email.com','$2b$12$IDNn2QNLC654dhEBo8XZWOutKe9rPHvYbtEocJHgWPrGWpsRFlAGe','USERTYPE-001','EMP-001','Active',NULL,'2021-11-18 22:21:02',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_bidding_items`
--

DROP TABLE IF EXISTS `vendor_bidding_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_bidding_items` (
  `id` char(36) NOT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `product_category` varchar(255) DEFAULT NULL,
  `product_bidding_price` varchar(255) DEFAULT NULL,
  `total_cost` varchar(255) DEFAULT NULL,
  `description` text,
  `status` varchar(255) DEFAULT NULL,
  `vendor_proposal_id` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vendor_proposal_id` (`vendor_proposal_id`),
  KEY `ix_vendor_bidding_items_product_category` (`product_category`),
  KEY `ix_vendor_bidding_items_status` (`status`),
  KEY `ix_vendor_bidding_items_quantity` (`quantity`),
  KEY `ix_vendor_bidding_items_product_name` (`product_name`),
  KEY `ix_vendor_bidding_items_product_bidding_price` (`product_bidding_price`),
  KEY `ix_vendor_bidding_items_total_cost` (`total_cost`),
  KEY `ix_vendor_bidding_items_description` (`description`(768))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_bidding_items`
--

LOCK TABLES `vendor_bidding_items` WRITE;
/*!40000 ALTER TABLE `vendor_bidding_items` DISABLE KEYS */;
INSERT INTO `vendor_bidding_items` VALUES ('VENDORBIDDING-001','VENDORBIDDING01',100,'Medical Supplies','200','1000','description','Active','VENDORPROPOSAL-001'),('VENDORBIDDING-002','VENDORBIDDING02',1,'IT supplies','30000','30000','description','Active','VENDORPROPOSAL-002'),('VENDORBIDDING-003','VENDORBIDDING03',10,'HP Laptop','50000','50000','description','Active','VENDORPROPOSAL-002');
/*!40000 ALTER TABLE `vendor_bidding_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_proposals`
--

DROP TABLE IF EXISTS `vendor_proposals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_proposals` (
  `id` char(36) NOT NULL,
  `subtotal` varchar(255) DEFAULT NULL,
  `discount` float DEFAULT NULL,
  `tax` float DEFAULT NULL,
  `total_amount` varchar(255) DEFAULT NULL,
  `message` text,
  `status` varchar(255) DEFAULT NULL,
  `request_quotation_id` char(36) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `request_quotation_id` (`request_quotation_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `ix_vendor_proposals_total_amount` (`total_amount`),
  KEY `ix_vendor_proposals_message` (`message`(768)),
  KEY `ix_vendor_proposals_subtotal` (`subtotal`),
  KEY `ix_vendor_proposals_status` (`status`),
  KEY `ix_vendor_proposals_discount` (`discount`),
  KEY `ix_vendor_proposals_tax` (`tax`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_proposals`
--

LOCK TABLES `vendor_proposals` WRITE;
/*!40000 ALTER TABLE `vendor_proposals` DISABLE KEYS */;
INSERT INTO `vendor_proposals` VALUES ('VENDORPROPOSAL-001','1000',0,0,'1000','message','APPROVED','REQUESTQUOTATION-001','VENDOR-001',NULL,'2021-11-20 11:46:07',NULL),('VENDORPROPOSAL-002','30000',0,0,'30000','message','Approved','REQUESTQUOTATION-002','VENDOR-001',NULL,'2021-11-26 17:38:02',NULL),('VENDORPROPOSAL-003','50000',0,0,'50000','message','Approved','REQUESTQUOTATION-002','VENDOR-002',NULL,'2021-11-26 17:38:02',NULL);
/*!40000 ALTER TABLE `vendor_proposals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendors`
--

DROP TABLE IF EXISTS `vendors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendors` (
  `id` char(36) NOT NULL,
  `vendor_name` varchar(255) NOT NULL,
  `region` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `street` varchar(255) NOT NULL,
  `industry` varchar(255) NOT NULL,
  `contact_person` varchar(255) NOT NULL,
  `contact_number` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `blacklist_reason` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vendor_name` (`vendor_name`),
  UNIQUE KEY `industry` (`industry`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
INSERT INTO `vendors` VALUES ('VENDOR-001','South Star Drug','Region','City','Street','Industry','Maria','09123456789','email','password','secret','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:39:59',NULL,NULL),('VENDOR-002','Hewlett-Packard','Region','City','Street','Industryy','Maria','09123456789','email','password','secret','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:39:59',NULL,NULL),('VENDOR-003','International Paper','Region','City','Street','Industryyy','Maria','09123456789','email','password','secret','Active','65501c6d-fad9-4401-9ff6-18a7b1626cea','2021-11-20 11:39:59',NULL,NULL);
/*!40000 ALTER TABLE `vendors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `withdrawals`
--

DROP TABLE IF EXISTS `withdrawals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `withdrawals` (
  `id` char(36) NOT NULL,
  `bank_account_id` char(36) NOT NULL,
  `withdrawal_no` varchar(255) NOT NULL,
  `amount` float NOT NULL,
  `description` text NOT NULL,
  `date_of_withdrawal` date NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_by` char(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `withdrawal_no` (`withdrawal_no`),
  KEY `bank_account_id` (`bank_account_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `withdrawals_ibfk_1` FOREIGN KEY (`bank_account_id`) REFERENCES `bank_accounts` (`id`),
  CONSTRAINT `withdrawals_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `withdrawals_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `withdrawals`
--

LOCK TABLES `withdrawals` WRITE;
/*!40000 ALTER TABLE `withdrawals` DISABLE KEYS */;
/*!40000 ALTER TABLE `withdrawals` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-09-05 21:38:05
