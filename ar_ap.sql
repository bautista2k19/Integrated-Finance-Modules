use homies;
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

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-09-05 21:38:05
