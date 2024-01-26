drop database if exists gestionaleMagazzino;
create database gestionaleMagazzino;

use gestionaleMagazzino;

CREATE TABLE `ruolo` (
  `nome` varchar(64) NOT NULL,
  PRIMARY KEY (`nome`)
);

CREATE TABLE `categoria` (
  `nome` varchar(64) NOT NULL,
  PRIMARY KEY (`nome`)
);

CREATE TABLE `utente` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(64) DEFAULT NULL,
  `cognome` varchar(64) DEFAULT NULL,
  `riferimentoFoto` varchar(64) DEFAULT 'default',
  `dataNascita` Date DEFAULT NULL,
  `email` varchar(128) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `ruolo` varchar(64) DEFAULT NULL,
  FOREIGN KEY (ruolo) REFERENCES ruolo(nome) on UPDATE CASCADE,
  PRIMARY KEY (`id`)
);

CREATE TABLE `noleggio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(64) DEFAULT NULL,
  `riferimentoFoto` varchar(64) DEFAULT 'default',
  `dataInizio` Date DEFAULT NULL,
  `dataFine` Date DEFAULT NULL,
  `autore` int DEFAULT NULL,
  FOREIGN KEY (autore) REFERENCES utente(id) on UPDATE CASCADE,
  PRIMARY KEY (`id`)
);

CREATE TABLE `materiale` (
  `codice` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(64) DEFAULT NULL,
  `riferimentoFoto` varchar(64) DEFAULT 'default',
  `quantita` int DEFAULT 0,
  `isConsumabile` tinyint DEFAULT 0,
  `isDisponibile` tinyint DEFAULT 1,
  `categoria` varchar(64) DEFAULT "generico",
  FOREIGN KEY (categoria) REFERENCES categoria(nome) on UPDATE CASCADE,
  PRIMARY KEY (`codice`)
);

CREATE TABLE `materialeNoleggio` (
  `idNoleggio` int DEFAULT 0,
  `idMateriale` int DEFAULT 0,
  `quantita` int DEFAULT 1,
  FOREIGN KEY (idNoleggio) REFERENCES noleggio(id) on UPDATE CASCADE,
  FOREIGN KEY (idMateriale) REFERENCES materiale(codice) on UPDATE CASCADE,
  PRIMARY KEY (`idNoleggio`,`idMateriale`)
);

CREATE TABLE `archivio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(64) DEFAULT NULL,
  `idNoleggio` int DEFAULT NULL,
  `idMateriale` int DEFAULT NULL,
  `idUtente` varchar(64) DEFAULT NULL,
  `dataInizio` Date DEFAULT NULL,
  `dataFine` Date DEFAULT NULL,
  `quantita` int DEFAULT 0,
  `chiusuraForzata` tinyint DEFAULT 0,
  PRIMARY KEY (`id`)
)ENGINE=archive;