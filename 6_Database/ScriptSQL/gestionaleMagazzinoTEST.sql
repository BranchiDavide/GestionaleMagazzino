-- Drop del database se esiste e creazione del nuovo database
DROP DATABASE IF EXISTS gestionaleMagazzinoTEST;
CREATE DATABASE gestionaleMagazzinoTEST;
USE gestionaleMagazzinoTEST;

-- Creazione della tabella ruolo
CREATE TABLE `ruolo` (
  `nome` varchar(64) NOT NULL,
  PRIMARY KEY (`nome`)
);

-- Creazione della tabella categoria
CREATE TABLE `categoria` (
  `nome` varchar(64) NOT NULL,
  PRIMARY KEY (`nome`)
);

-- Creazione della tabella utente
CREATE TABLE `utente` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(64) DEFAULT NULL,
  `cognome` varchar(64) DEFAULT NULL,
  `riferimentoFoto` varchar(64) DEFAULT 'default',
  `dataNascita` Date DEFAULT NULL,
  `email` varchar(128) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `ruolo` varchar(64) DEFAULT NULL,
  FOREIGN KEY (ruolo) REFERENCES ruolo(nome) ON UPDATE CASCADE,
  PRIMARY KEY (`id`)
);

-- Creazione della tabella noleggio
CREATE TABLE `noleggio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(64) DEFAULT NULL,
  `riferimentoFoto` varchar(64) DEFAULT 'default',
  `dataInizio` Date DEFAULT NULL,
  `dataFine` Date DEFAULT NULL,
  `idUtente` int DEFAULT NULL,
  `chiusuraForzata` tinyint DEFAULT 0,
  FOREIGN KEY (idUtente) REFERENCES utente(id) ON UPDATE CASCADE,
  PRIMARY KEY (`id`)
);

-- Creazione della tabella materiale
CREATE TABLE `materiale` (
  `codice` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(64) DEFAULT NULL,
  `riferimentoFoto` varchar(64) DEFAULT 'default',
  `quantita` int DEFAULT 0,
  `isConsumabile` tinyint DEFAULT 0,
  `isDisponibile` tinyint DEFAULT 1,
  `categoria` varchar(64) DEFAULT "generico",
  FOREIGN KEY (categoria) REFERENCES categoria(nome) ON UPDATE CASCADE,
  PRIMARY KEY (`codice`)
);

-- Creazione della tabella materialeNoleggio
CREATE TABLE `materialeNoleggio` (
  `idNoleggio` int DEFAULT 0,
  `idMateriale` int DEFAULT 0,
  `quantita` int DEFAULT 1,
  FOREIGN KEY (idNoleggio) REFERENCES noleggio(id) ON DELETE CASCADE,
  FOREIGN KEY (idMateriale) REFERENCES materiale(codice) ON UPDATE CASCADE,
  PRIMARY KEY (`idNoleggio`,`idMateriale`)
);

-- Creazione della tabella archivio
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
) ENGINE=archive;

-- Creazione del trigger archivio_update_noleggio
DROP TRIGGER IF EXISTS archivio_update_noleggio;
DELIMITER //
CREATE TRIGGER archivio_update_noleggio
BEFORE DELETE ON noleggio FOR EACH ROW BEGIN 
   DECLARE done INT DEFAULT FALSE;
   DECLARE A INT;
   DECLARE B INT;
   DECLARE cur1 CURSOR FOR SELECT idMateriale, quantita FROM materialeNoleggio WHERE idNoleggio = old.id;
   DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
   OPEN cur1;
   read_loop: LOOP
      FETCH cur1 INTO A, B;
		IF done THEN
		   LEAVE read_loop;
		END IF;
        INSERT INTO archivio (nome, idNoleggio, idMateriale, idUtente, dataInizio, dataFine, quantita, chiusuraForzata) 
        VALUES (old.nome, old.id, A, old.idUtente, old.dataInizio, old.dataFine, B, old.chiusuraForzata);
   END LOOP;
   CLOSE cur1;
END;
//
DELIMITER ;

-- Inserimento ruoli utente
INSERT INTO ruolo (nome) VALUES ('amministratore'), ('gestore'), ('utente');
