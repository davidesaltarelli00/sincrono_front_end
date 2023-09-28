CREATE DATABASE  IF NOT EXISTS `sincrono` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `sincrono`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: sincrono
-- ------------------------------------------------------
-- Server version	5.7.43-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `anagrafica`
--

DROP TABLE IF EXISTS `anagrafica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anagrafica` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `cognome` varchar(45) NOT NULL,
  `codice_fiscale` varchar(45) NOT NULL,
  `id_utente` int(11) DEFAULT NULL,
  `id_tipo_azienda` int(11) NOT NULL,
  `comune_di_nascita` varchar(45) DEFAULT NULL,
  `data_di_nascita` date DEFAULT NULL,
  `residenza` varchar(45) DEFAULT NULL,
  `domicilio` varchar(45) DEFAULT NULL,
  `cellulare_privato` varchar(15) DEFAULT NULL,
  `cellulare_aziendale` varchar(15) DEFAULT NULL,
  `mail_privata` varchar(45) DEFAULT NULL,
  `mail_aziendale` varchar(45) NOT NULL,
  `mail_pec` varchar(45) DEFAULT NULL,
  `altri_titoli` varchar(45) DEFAULT NULL,
  `titoli_di_studio` varchar(255) DEFAULT NULL,
  `coniugato` bit(1) DEFAULT NULL,
  `figli_a_carico` bit(1) DEFAULT NULL,
  `attivo` bit(1) DEFAULT b'1',
  `attesa_lavori` bit(1) DEFAULT NULL,
  `categoria_protetta` bit(1) DEFAULT NULL,
  `cittadinaza` varchar(255) DEFAULT NULL,
  `provincia_di_nascita` varchar(255) DEFAULT NULL,
  `stato_di_nascita` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `cf_UNIQUE` (`codice_fiscale`),
  UNIQUE KEY `id_utente_UNIQUE` (`id_utente`),
  KEY `anagrafica_utenti_fk_idx` (`id_utente`),
  KEY `anagrafica_utente_fk` (`id_utente`),
  KEY `anagrafica_tipo_azienda_fk` (`id_tipo_azienda`),
  CONSTRAINT `anagrafica_tipo_azienda_fk` FOREIGN KEY (`id_tipo_azienda`) REFERENCES `tipo_azienda` (`id`),
  CONSTRAINT `anagrafica_utente_fk` FOREIGN KEY (`id_utente`) REFERENCES `utenti` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anagrafica`
--

LOCK TABLES `anagrafica` WRITE;
/*!40000 ALTER TABLE `anagrafica` DISABLE KEYS */;
INSERT INTO `anagrafica` VALUES (28,'utente','admin','123456789ABC',30,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'utente.admin@sincrono.net',NULL,NULL,NULL,NULL,NULL,_binary '',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `anagrafica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batch_job_execution`
--

DROP TABLE IF EXISTS `batch_job_execution`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batch_job_execution` (
  `JOB_EXECUTION_ID` bigint(20) NOT NULL,
  `VERSION` bigint(20) DEFAULT NULL,
  `JOB_INSTANCE_ID` bigint(20) NOT NULL,
  `CREATE_TIME` datetime(6) NOT NULL,
  `START_TIME` datetime(6) DEFAULT NULL,
  `END_TIME` datetime(6) DEFAULT NULL,
  `STATUS` varchar(10) DEFAULT NULL,
  `EXIT_CODE` varchar(2500) DEFAULT NULL,
  `EXIT_MESSAGE` varchar(2500) DEFAULT NULL,
  `LAST_UPDATED` datetime(6) DEFAULT NULL,
  `JOB_CONFIGURATION_LOCATION` varchar(2500) DEFAULT NULL,
  PRIMARY KEY (`JOB_EXECUTION_ID`),
  KEY `JOB_INST_EXEC_FK` (`JOB_INSTANCE_ID`),
  CONSTRAINT `JOB_INST_EXEC_FK` FOREIGN KEY (`JOB_INSTANCE_ID`) REFERENCES `batch_job_instance` (`JOB_INSTANCE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch_job_execution`
--

LOCK TABLES `batch_job_execution` WRITE;
/*!40000 ALTER TABLE `batch_job_execution` DISABLE KEYS */;
/*!40000 ALTER TABLE `batch_job_execution` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batch_job_execution_context`
--

DROP TABLE IF EXISTS `batch_job_execution_context`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batch_job_execution_context` (
  `JOB_EXECUTION_ID` bigint(20) NOT NULL,
  `SHORT_CONTEXT` varchar(2500) NOT NULL,
  `SERIALIZED_CONTEXT` text,
  PRIMARY KEY (`JOB_EXECUTION_ID`),
  CONSTRAINT `JOB_EXEC_CTX_FK` FOREIGN KEY (`JOB_EXECUTION_ID`) REFERENCES `batch_job_execution` (`JOB_EXECUTION_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch_job_execution_context`
--

LOCK TABLES `batch_job_execution_context` WRITE;
/*!40000 ALTER TABLE `batch_job_execution_context` DISABLE KEYS */;
/*!40000 ALTER TABLE `batch_job_execution_context` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batch_job_execution_params`
--

DROP TABLE IF EXISTS `batch_job_execution_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batch_job_execution_params` (
  `JOB_EXECUTION_ID` bigint(20) NOT NULL,
  `TYPE_CD` varchar(6) NOT NULL,
  `KEY_NAME` varchar(100) NOT NULL,
  `STRING_VAL` varchar(250) DEFAULT NULL,
  `DATE_VAL` datetime(6) DEFAULT NULL,
  `LONG_VAL` bigint(20) DEFAULT NULL,
  `DOUBLE_VAL` double DEFAULT NULL,
  `IDENTIFYING` char(1) NOT NULL,
  KEY `JOB_EXEC_PARAMS_FK` (`JOB_EXECUTION_ID`),
  CONSTRAINT `JOB_EXEC_PARAMS_FK` FOREIGN KEY (`JOB_EXECUTION_ID`) REFERENCES `batch_job_execution` (`JOB_EXECUTION_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch_job_execution_params`
--

LOCK TABLES `batch_job_execution_params` WRITE;
/*!40000 ALTER TABLE `batch_job_execution_params` DISABLE KEYS */;
/*!40000 ALTER TABLE `batch_job_execution_params` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batch_job_execution_seq`
--

DROP TABLE IF EXISTS `batch_job_execution_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batch_job_execution_seq` (
  `ID` bigint(20) NOT NULL,
  `UNIQUE_KEY` char(1) NOT NULL,
  UNIQUE KEY `UNIQUE_KEY_UN` (`UNIQUE_KEY`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch_job_execution_seq`
--

LOCK TABLES `batch_job_execution_seq` WRITE;
/*!40000 ALTER TABLE `batch_job_execution_seq` DISABLE KEYS */;
/*!40000 ALTER TABLE `batch_job_execution_seq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batch_job_instance`
--

DROP TABLE IF EXISTS `batch_job_instance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batch_job_instance` (
  `JOB_INSTANCE_ID` bigint(20) NOT NULL,
  `VERSION` bigint(20) DEFAULT NULL,
  `JOB_NAME` varchar(100) NOT NULL,
  `JOB_KEY` varchar(32) NOT NULL,
  PRIMARY KEY (`JOB_INSTANCE_ID`),
  UNIQUE KEY `JOB_INST_UN` (`JOB_NAME`,`JOB_KEY`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch_job_instance`
--

LOCK TABLES `batch_job_instance` WRITE;
/*!40000 ALTER TABLE `batch_job_instance` DISABLE KEYS */;
/*!40000 ALTER TABLE `batch_job_instance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batch_job_seq`
--

DROP TABLE IF EXISTS `batch_job_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batch_job_seq` (
  `ID` bigint(20) NOT NULL,
  `UNIQUE_KEY` char(1) NOT NULL,
  UNIQUE KEY `UNIQUE_KEY_UN` (`UNIQUE_KEY`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch_job_seq`
--

LOCK TABLES `batch_job_seq` WRITE;
/*!40000 ALTER TABLE `batch_job_seq` DISABLE KEYS */;
/*!40000 ALTER TABLE `batch_job_seq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batch_step_execution`
--

DROP TABLE IF EXISTS `batch_step_execution`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batch_step_execution` (
  `STEP_EXECUTION_ID` bigint(20) NOT NULL,
  `VERSION` bigint(20) NOT NULL,
  `STEP_NAME` varchar(100) NOT NULL,
  `JOB_EXECUTION_ID` bigint(20) NOT NULL,
  `START_TIME` datetime(6) NOT NULL,
  `END_TIME` datetime(6) DEFAULT NULL,
  `STATUS` varchar(10) DEFAULT NULL,
  `COMMIT_COUNT` bigint(20) DEFAULT NULL,
  `READ_COUNT` bigint(20) DEFAULT NULL,
  `FILTER_COUNT` bigint(20) DEFAULT NULL,
  `WRITE_COUNT` bigint(20) DEFAULT NULL,
  `READ_SKIP_COUNT` bigint(20) DEFAULT NULL,
  `WRITE_SKIP_COUNT` bigint(20) DEFAULT NULL,
  `PROCESS_SKIP_COUNT` bigint(20) DEFAULT NULL,
  `ROLLBACK_COUNT` bigint(20) DEFAULT NULL,
  `EXIT_CODE` varchar(2500) DEFAULT NULL,
  `EXIT_MESSAGE` varchar(2500) DEFAULT NULL,
  `LAST_UPDATED` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`STEP_EXECUTION_ID`),
  KEY `JOB_EXEC_STEP_FK` (`JOB_EXECUTION_ID`),
  CONSTRAINT `JOB_EXEC_STEP_FK` FOREIGN KEY (`JOB_EXECUTION_ID`) REFERENCES `batch_job_execution` (`JOB_EXECUTION_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch_step_execution`
--

LOCK TABLES `batch_step_execution` WRITE;
/*!40000 ALTER TABLE `batch_step_execution` DISABLE KEYS */;
/*!40000 ALTER TABLE `batch_step_execution` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batch_step_execution_context`
--

DROP TABLE IF EXISTS `batch_step_execution_context`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batch_step_execution_context` (
  `STEP_EXECUTION_ID` bigint(20) NOT NULL,
  `SHORT_CONTEXT` varchar(2500) NOT NULL,
  `SERIALIZED_CONTEXT` text,
  PRIMARY KEY (`STEP_EXECUTION_ID`),
  CONSTRAINT `STEP_EXEC_CTX_FK` FOREIGN KEY (`STEP_EXECUTION_ID`) REFERENCES `batch_step_execution` (`STEP_EXECUTION_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch_step_execution_context`
--

LOCK TABLES `batch_step_execution_context` WRITE;
/*!40000 ALTER TABLE `batch_step_execution_context` DISABLE KEYS */;
/*!40000 ALTER TABLE `batch_step_execution_context` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batch_step_execution_seq`
--

DROP TABLE IF EXISTS `batch_step_execution_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batch_step_execution_seq` (
  `ID` bigint(20) NOT NULL,
  `UNIQUE_KEY` char(1) NOT NULL,
  UNIQUE KEY `UNIQUE_KEY_UN` (`UNIQUE_KEY`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch_step_execution_seq`
--

LOCK TABLES `batch_step_execution_seq` WRITE;
/*!40000 ALTER TABLE `batch_step_execution_seq` DISABLE KEYS */;
/*!40000 ALTER TABLE `batch_step_execution_seq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commessa`
--

DROP TABLE IF EXISTS `commessa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commessa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `azienda_cliente` varchar(200) NOT NULL,
  `cliente_finale` varchar(200) DEFAULT NULL,
  `titolo_posizione` varchar(200) DEFAULT NULL,
  `distacco` tinyint(1) DEFAULT NULL,
  `distacco_azienda` varchar(45) DEFAULT NULL,
  `distacco_data` date DEFAULT NULL,
  `data_inizio` date NOT NULL,
  `data_fine` date DEFAULT NULL,
  `tariffa_giornaliera` varchar(200) DEFAULT NULL,
  `azienda_di_fatturazione_interna` varchar(45) DEFAULT NULL,
  `attivo` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commessa`
--

LOCK TABLES `commessa` WRITE;
/*!40000 ALTER TABLE `commessa` DISABLE KEYS */;
INSERT INTO `commessa` VALUES (0,'#','#','#',NULL,NULL,NULL,'2000-01-01','2150-01-01','#','#',_binary '\0');
/*!40000 ALTER TABLE `commessa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contratti_scatti_livello`
--

DROP TABLE IF EXISTS `contratti_scatti_livello`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contratti_scatti_livello` (
  `id` int(11) NOT NULL,
  `id_contratto` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contratti_scatti_livello`
--

LOCK TABLES `contratti_scatti_livello` WRITE;
/*!40000 ALTER TABLE `contratti_scatti_livello` DISABLE KEYS */;
/*!40000 ALTER TABLE `contratti_scatti_livello` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contratto`
--

DROP TABLE IF EXISTS `contratto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contratto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_tipo_contratto` int(11) NOT NULL,
  `id_tipo_livello` int(11) NOT NULL,
  `id_tipo_azienda` int(11) NOT NULL,
  `id_tipo_ccnl` int(11) NOT NULL,
  `id_tipo_canale_reclutamento` int(11) NOT NULL,
  `id_tipo_causa_fine_rapporto` int(11) DEFAULT NULL,
  `attivo` bit(1) NOT NULL DEFAULT b'1',
  `qualifica` varchar(200) DEFAULT NULL,
  `sede_assunzione` varchar(200) DEFAULT NULL,
  `data_assunzione` date NOT NULL,
  `data_inizio_prova` date DEFAULT NULL,
  `data_fine_prova` date DEFAULT NULL,
  `data_fine_rapporto` date DEFAULT NULL,
  `mesi_durata` int(11) DEFAULT NULL,
  `livello_attuale` varchar(30) DEFAULT NULL,
  `livello_finale` varchar(30) DEFAULT NULL,
  `part_time` bit(1) DEFAULT NULL,
  `percentuale_part_time` decimal(10,2) DEFAULT NULL,
  `retribuzione_mensile_lorda` decimal(10,2) DEFAULT NULL,
  `superminimo_mensile` decimal(10,2) DEFAULT NULL,
  `ral_annua` decimal(10,2) DEFAULT NULL,
  `superminimo_ral` decimal(10,2) DEFAULT NULL,
  `diaria_mensile` decimal(10,2) DEFAULT NULL,
  `diaria_giornaliera` decimal(10,2) DEFAULT NULL,
  `ticket` bit(1) DEFAULT NULL,
  `valore_ticket` decimal(10,2) DEFAULT NULL,
  `categoria_protetta` bit(1) DEFAULT NULL,
  `tutor` varchar(50) DEFAULT NULL,
  `pfi` bit(1) DEFAULT NULL,
  `corso_sicurezza` bit(1) DEFAULT NULL,
  `data_corso_sicurezza` date DEFAULT NULL,
  `pc` bit(1) DEFAULT NULL,
  `visita_medica` bit(1) DEFAULT NULL,
  `data_visita_medica` date DEFAULT NULL,
  `scatti_anzianita` decimal(10,2) DEFAULT NULL,
  `tariffa_partita_iva` decimal(10,2) DEFAULT NULL,
  `assicurazione_obbligatoria` bit(1) DEFAULT NULL,
  `retribuzione_netta_giornaliera` decimal(10,2) DEFAULT NULL,
  `retribuzione_netta_mensile` decimal(10,2) DEFAULT NULL,
  `diaria_annua` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `contratto_tipo_contratto_fk_idx` (`id_tipo_contratto`),
  KEY `contratto_tipo_azienda_fk` (`id_tipo_azienda`),
  KEY `contratto_tipo_ccnl_fk_idx` (`id_tipo_ccnl`),
  KEY `contratto_tipo_ccnl_fk` (`id_tipo_ccnl`),
  KEY `contratto_tipo_livello_fk` (`id_tipo_livello`),
  KEY `contratto_tipo_canale_reclutamento` (`id_tipo_canale_reclutamento`),
  KEY `contratto_tipo_causa_fine_rapporto_fk` (`id_tipo_causa_fine_rapporto`),
  CONSTRAINT `contratto_tipo_azienda_fk` FOREIGN KEY (`id_tipo_azienda`) REFERENCES `tipo_azienda` (`id`),
  CONSTRAINT `contratto_tipo_canale_reclutamento` FOREIGN KEY (`id_tipo_canale_reclutamento`) REFERENCES `tipo_canale_reclutamento` (`id`),
  CONSTRAINT `contratto_tipo_causa_fine_rapporto_fk` FOREIGN KEY (`id_tipo_causa_fine_rapporto`) REFERENCES `tipo_causa_fine_rapporto` (`id`),
  CONSTRAINT `contratto_tipo_ccnl_fk` FOREIGN KEY (`id_tipo_ccnl`) REFERENCES `tipo_ccnl` (`id`),
  CONSTRAINT `contratto_tipo_contratto_fk` FOREIGN KEY (`id_tipo_contratto`) REFERENCES `tipo_contratto` (`id`),
  CONSTRAINT `contratto_tipo_livello_fk` FOREIGN KEY (`id_tipo_livello`) REFERENCES `tipo_livelli_contrattuali` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contratto`
--

LOCK TABLES `contratto` WRITE;
/*!40000 ALTER TABLE `contratto` DISABLE KEYS */;
INSERT INTO `contratto` VALUES (0,0,0,0,0,0,0,_binary '','#','#','2000-01-01','2000-01-01','2000-01-01','2150-01-01',0,'0','0',_binary '\0',0.00,0.00,0.00,0.00,0.00,0.00,0.00,_binary '\0',0.00,_binary '\0','#',_binary '\0',_binary '\0','2000-01-01',_binary '\0',_binary '\0','2000-01-01',0.00,0.00,_binary '\0',0.00,0.00,0.00);
/*!40000 ALTER TABLE `contratto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funzioni`
--

DROP TABLE IF EXISTS `funzioni`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funzioni` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_padre` int(11) DEFAULT NULL,
  `menu_item` int(11) DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `percorso` varchar(255) DEFAULT NULL,
  `ordinamento` int(11) DEFAULT NULL,
  `immagine` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_funzioni_funzioni` (`id_padre`),
  CONSTRAINT `fk_funzioni_funzioni` FOREIGN KEY (`id_padre`) REFERENCES `funzioni` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funzioni`
--

LOCK TABLES `funzioni` WRITE;
/*!40000 ALTER TABLE `funzioni` DISABLE KEYS */;
INSERT INTO `funzioni` VALUES (1,NULL,1,'Amministrazione',NULL,1,NULL),(2,1,1,'Anagrafica','/lista-anagrafica',2,NULL),(3,1,1,'Dashboard','/dashboard',3,NULL),(4,1,1,'Organico','/organico',4,NULL),(5,1,1,'Utente','/utente',5,NULL),(6,1,1,'Tipologiche','',6,NULL),(7,NULL,3,'Personale',NULL,7,NULL),(8,7,3,'Anagrafica SL','/lista-anagrafica',8,NULL),(9,7,3,'Documenti','/utente',9,NULL);
/*!40000 ALTER TABLE `funzioni` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operazioni`
--

DROP TABLE IF EXISTS `operazioni`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `operazioni` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_funzione` int(11) NOT NULL,
  `percorso` varchar(255) DEFAULT NULL,
  `metodo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_operazioni_funzioni` (`id_funzione`),
  CONSTRAINT `fk_operazioni_funzioni` FOREIGN KEY (`id_funzione`) REFERENCES `funzioni` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operazioni`
--

LOCK TABLES `operazioni` WRITE;
/*!40000 ALTER TABLE `operazioni` DISABLE KEYS */;
INSERT INTO `operazioni` VALUES (1,2,'list','GET'),(2,2,'filter','POST'),(3,2,'inserisci','POST'),(4,2,'dettaglio','GET'),(5,2,'modifica','PUT'),(6,2,'delete','PUT'),(7,2,'retain','PUT'),(8,2,'dettaglio-token','GET'),(9,3,'dashboard','POST'),(10,3,'list-commesse','GET'),(11,3,'list-contratti','GET'),(12,3,'list-filter','POST'),(13,3,'list-all-commesse','GET'),(14,2,'storico-commesse','GET'),(15,2,'storico-contratti','GET'),(16,4,'organico','POST'),(17,2,'commessa','PUT'),(18,2,'storicizza-commessa','PUT'),(19,2,'retain-commessa','PUT'),(20,5,'utente','GET'),(21,6,'tipo-azienda-map','GET'),(22,6,'tipo-contratto-map','GET'),(23,6,'tipo-ccnl-map','GET'),(24,6,'tipo-livelli-contrattuali-map','GET'),(25,6,'tipo-canale-reclutamento-map','GET'),(26,6,'tipo-causa-fine-rapporto-map','GET'),(27,2,'funzioni-ruolo-tree','GET'),(28,2,'ruoli-map','GET'),(29,2,'operazioni','GET'),(30,8,'dettaglio','GET'),(31,8,'dettaglio-token','GET'),(32,9,'utente','GET'),(33,2,'anagrafica-list-contratti','GET'),(34,2,'anagrafica-Delete-ScattoContratti','DELETE');
/*!40000 ALTER TABLE `operazioni` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `privilegi`
--

DROP TABLE IF EXISTS `privilegi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `privilegi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_ruolo` int(11) NOT NULL,
  `id_funzione` int(11) NOT NULL,
  `data_aggiornamento` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `utente_aggiornamento` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_privilegi_ruolo_funzione` (`id_ruolo`,`id_funzione`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_privilegi_ruoli` (`id_ruolo`),
  KEY `fk_privilegi_funzioni` (`id_funzione`),
  CONSTRAINT `fk_privilegi_funzioni` FOREIGN KEY (`id_funzione`) REFERENCES `funzioni` (`id`),
  CONSTRAINT `fk_privilegi_ruoli` FOREIGN KEY (`id_ruolo`) REFERENCES `ruoli` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `privilegi`
--

LOCK TABLES `privilegi` WRITE;
/*!40000 ALTER TABLE `privilegi` DISABLE KEYS */;
INSERT INTO `privilegi` VALUES (1,1,1,'2023-09-12 08:41:42','ADMIN'),(2,1,2,'2023-09-12 08:41:42','ADMIN'),(3,1,3,'2023-09-12 08:41:42','ADMIN'),(4,1,4,'2023-09-12 08:41:42','ADMIN'),(5,1,5,'2023-09-12 08:41:42','ADMIN'),(6,1,6,'2023-09-12 08:41:42','ADMIN'),(7,2,6,'2023-09-12 08:53:15','ADMIN'),(8,2,7,'2023-09-12 08:53:15','ADMIN'),(9,2,8,'2023-09-12 08:53:15','ADMIN'),(10,2,9,'2023-09-12 08:53:15','ADMIN'),(11,1,9,'2023-09-28 07:41:58','ADMIN');
/*!40000 ALTER TABLE `privilegi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profili`
--

DROP TABLE IF EXISTS `profili`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profili` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_ruolo` int(11) NOT NULL,
  `id_utente` int(11) NOT NULL,
  `data_inizio` date DEFAULT NULL,
  `data_fine` date DEFAULT NULL,
  `data_aggiornamento` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `utente_aggiornamento` varchar(45) DEFAULT 'ADMIN',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_profili_ruolo_utente` (`id_ruolo`,`id_utente`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_profili_ruoli` (`id_ruolo`),
  KEY `fk_profili_utenti` (`id_utente`),
  CONSTRAINT `fk_profili_ruoli` FOREIGN KEY (`id_ruolo`) REFERENCES `ruoli` (`id`),
  CONSTRAINT `fk_profili_utenti` FOREIGN KEY (`id_utente`) REFERENCES `utenti` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profili`
--

LOCK TABLES `profili` WRITE;
/*!40000 ALTER TABLE `profili` DISABLE KEYS */;
INSERT INTO `profili` VALUES (16,1,30,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `profili` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rapportini`
--

DROP TABLE IF EXISTS `rapportini`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rapportini` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_anagrafica` int(11) NOT NULL,
  `data` date NOT NULL,
  `ore_permessi` decimal(5,2) NOT NULL,
  `ore_ferie` decimal(5,2) NOT NULL,
  `ore_lavorate` decimal(5,2) NOT NULL,
  `ore_straordinari` decimal(5,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_anagrafica_data` (`id_anagrafica`,`data`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_rapportini_anagrafica` (`id_anagrafica`),
  CONSTRAINT `fk_rapportini_anagrafica` FOREIGN KEY (`id_anagrafica`) REFERENCES `anagrafica` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rapportini`
--

LOCK TABLES `rapportini` WRITE;
/*!40000 ALTER TABLE `rapportini` DISABLE KEYS */;
/*!40000 ALTER TABLE `rapportini` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ruoli`
--

DROP TABLE IF EXISTS `ruoli`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ruoli` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_padre` int(11) DEFAULT NULL,
  `nome` varchar(45) DEFAULT NULL,
  `descrizione` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_ruoli_ruoli` (`id_padre`),
  CONSTRAINT `fk_ruoli_ruoli` FOREIGN KEY (`id_padre`) REFERENCES `ruoli` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ruoli`
--

LOCK TABLES `ruoli` WRITE;
/*!40000 ALTER TABLE `ruoli` DISABLE KEYS */;
INSERT INTO `ruoli` VALUES (1,NULL,'ADMIN','ADMIN'),(2,NULL,'DIPENDENTE','DIPENDENTE');
/*!40000 ALTER TABLE `ruoli` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storico_commesse`
--

DROP TABLE IF EXISTS `storico_commesse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `storico_commesse` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_anagrafica` int(11) NOT NULL,
  `id_commessa` int(11) NOT NULL,
  `data_aggiornamento` varchar(255) DEFAULT NULL,
  `utente_aggiornamento` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `anagrafica_fk_idx` (`id_anagrafica`),
  KEY `storico_commesse_commesse_fk_idx` (`id_commessa`),
  CONSTRAINT `storico_commesse_anagrafica_fk` FOREIGN KEY (`id_anagrafica`) REFERENCES `anagrafica` (`id`),
  CONSTRAINT `storico_commesse_commesse_fk` FOREIGN KEY (`id_commessa`) REFERENCES `commessa` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storico_commesse`
--

LOCK TABLES `storico_commesse` WRITE;
/*!40000 ALTER TABLE `storico_commesse` DISABLE KEYS */;
INSERT INTO `storico_commesse` VALUES (44,28,0,NULL,NULL);
/*!40000 ALTER TABLE `storico_commesse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storico_contratti`
--

DROP TABLE IF EXISTS `storico_contratti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `storico_contratti` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_anagrafica` int(11) NOT NULL,
  `id_contratto` int(11) NOT NULL,
  `data_aggiornamento` varchar(255) DEFAULT NULL,
  `utente_aggiornamento` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `storico_contratti_anagrafica_fk_idx` (`id_anagrafica`),
  KEY `storico_contratti_contratto_idx` (`id_contratto`),
  CONSTRAINT `storico_contratti_anagrafica_fk` FOREIGN KEY (`id_anagrafica`) REFERENCES `anagrafica` (`id`),
  CONSTRAINT `storico_contratti_contratto` FOREIGN KEY (`id_contratto`) REFERENCES `contratto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storico_contratti`
--

LOCK TABLES `storico_contratti` WRITE;
/*!40000 ALTER TABLE `storico_contratti` DISABLE KEYS */;
INSERT INTO `storico_contratti` VALUES (41,28,0,NULL,'ADMIN');
/*!40000 ALTER TABLE `storico_contratti` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_azienda`
--

DROP TABLE IF EXISTS `tipo_azienda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_azienda` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descrizione` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_azienda`
--

LOCK TABLES `tipo_azienda` WRITE;
/*!40000 ALTER TABLE `tipo_azienda` DISABLE KEYS */;
INSERT INTO `tipo_azienda` VALUES (0,'#'),(1,'Formazione'),(2,'Consulenza'),(3,'ZeroLock'),(4,'Reymon'),(5,'Delta');
/*!40000 ALTER TABLE `tipo_azienda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_canale_reclutamento`
--

DROP TABLE IF EXISTS `tipo_canale_reclutamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_canale_reclutamento` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descrizione` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_canale_reclutamento`
--

LOCK TABLES `tipo_canale_reclutamento` WRITE;
/*!40000 ALTER TABLE `tipo_canale_reclutamento` DISABLE KEYS */;
INSERT INTO `tipo_canale_reclutamento` VALUES (0,'#'),(1,'Recruiting'),(2,'Formazione'),(3,'Altro');
/*!40000 ALTER TABLE `tipo_canale_reclutamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_causa_fine_rapporto`
--

DROP TABLE IF EXISTS `tipo_causa_fine_rapporto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_causa_fine_rapporto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descrizione` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_causa_fine_rapporto`
--

LOCK TABLES `tipo_causa_fine_rapporto` WRITE;
/*!40000 ALTER TABLE `tipo_causa_fine_rapporto` DISABLE KEYS */;
INSERT INTO `tipo_causa_fine_rapporto` VALUES (0,'#'),(1,'Licenziamento'),(2,'Pensionamento'),(3,'Dimissioni'),(4,'Morte');
/*!40000 ALTER TABLE `tipo_causa_fine_rapporto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_ccnl`
--

DROP TABLE IF EXISTS `tipo_ccnl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_ccnl` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descrizione` varchar(80) NOT NULL,
  `numero_mensilita` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_ccnl`
--

LOCK TABLES `tipo_ccnl` WRITE;
/*!40000 ALTER TABLE `tipo_ccnl` DISABLE KEYS */;
INSERT INTO `tipo_ccnl` VALUES (0,'#',0),(1,'METALMECCANICO PMI CONFAPI',13),(2,'CISAL ANPIT',13),(3,'TERZIARIO COMMERCIO',14);
/*!40000 ALTER TABLE `tipo_ccnl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_contratto`
--

DROP TABLE IF EXISTS `tipo_contratto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_contratto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descrizione` varchar(80) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_contratto`
--

LOCK TABLES `tipo_contratto` WRITE;
/*!40000 ALTER TABLE `tipo_contratto` DISABLE KEYS */;
INSERT INTO `tipo_contratto` VALUES (0,'#'),(1,'Stage'),(2,'P.Iva'),(3,'Determinato'),(4,'Indeterminato'),(5,'Apprendistato');
/*!40000 ALTER TABLE `tipo_contratto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_livelli_contrattuali`
--

DROP TABLE IF EXISTS `tipo_livelli_contrattuali`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_livelli_contrattuali` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ccnl` varchar(45) NOT NULL,
  `livello` varchar(45) NOT NULL,
  `minimi_ret_23` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_livelli_contrattuali`
--

LOCK TABLES `tipo_livelli_contrattuali` WRITE;
/*!40000 ALTER TABLE `tipo_livelli_contrattuali` DISABLE KEYS */;
INSERT INTO `tipo_livelli_contrattuali` VALUES (0,'#','0',0.00),(1,'CISAL ANPIT','Dirigente',5299.44),(2,'CISAL ANPIT','Quadro',2591.40),(3,'CISAL ANPIT','A1',2253.78),(4,'CISAL ANPIT','A2',2025.19),(5,'CISAL ANPIT','B1',1807.14),(6,'CISAL ANPIT','B2',1635.67),(7,'CISAL ANPIT','C1',1468.96),(8,'CISAL ANPIT','C2',1354.96),(9,'CISAL ANPIT','D1',1243.93),(10,'CISAL ANPIT','D2',1134.05),(11,'TERZIARIO COMMERCIO','Quadri',2491.16),(12,'TERZIARIO COMMERCIO','1',2295.00),(13,'TERZIARIO COMMERCIO','2',2053.02),(14,'TERZIARIO COMMERCIO','3',1827.80),(15,'TERZIARIO COMMERCIO','4',1648.75),(16,'TERZIARIO COMMERCIO','5',1538.11),(17,'TERZIARIO COMMERCIO','6',1432.29),(18,'TERZIARIO COMMERCIO','7',1299.06),(19,'METALMECCANICO PMI CONFAPI','1',2654.38),(20,'METALMECCANICO PMI CONFAPI','2',2386.81),(21,'METALMECCANICO PMI CONFAPI','3',2194.81),(22,'METALMECCANICO PMI CONFAPI','4',2045.80),(23,'METALMECCANICO PMI CONFAPI','5',1908.07),(24,'METALMECCANICO PMI CONFAPI','6',1781.25),(25,'METALMECCANICO PMI CONFAPI','7',1707.23),(26,'METALMECCANICO PMI CONFAPI','8',1538.71),(27,'METALMECCANICO PMI CONFAPI','9',1393.25);
/*!40000 ALTER TABLE `tipo_livelli_contrattuali` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utenti`
--

DROP TABLE IF EXISTS `utenti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utenti` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `token_password` varchar(255) DEFAULT NULL,
  `attivo` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `token_password_UNIQUE` (`token_password`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utenti`
--

LOCK TABLES `utenti` WRITE;
/*!40000 ALTER TABLE `utenti` DISABLE KEYS */;
INSERT INTO `utenti` VALUES (30,'utente.admin@sincrono.net','$2a$10$OoPERG9fETdR0LRHwpGsT.vjCnq7C469za1MAhqBL4SZhTXTsXujy','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1dGVudGUuYWRtaW5Ac2luY3Jvbm8ubmV0IiwiaWF0IjoxNjk1ODg4NzI4LCJleHAiOjE2OTYwMDg3Mjh9.XEM9q_q7il9sfr_VfWC1KeaAPdNvkDVmH_G20NXuaoY',_binary '');
/*!40000 ALTER TABLE `utenti` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utenti_seq`
--

DROP TABLE IF EXISTS `utenti_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utenti_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utenti_seq`
--

LOCK TABLES `utenti_seq` WRITE;
/*!40000 ALTER TABLE `utenti_seq` DISABLE KEYS */;
/*!40000 ALTER TABLE `utenti_seq` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-28 10:17:52
