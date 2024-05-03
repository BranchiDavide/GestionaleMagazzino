-- Drop del database se esiste e creazione del nuovo database
DROP DATABASE IF EXISTS gestionaleMagazzino;
CREATE DATABASE gestionaleMagazzino;
USE gestionaleMagazzino;

-- Creazione della tabella ruolo
CREATE TABLE `ruolo` (
  `nome` varchar(64) NOT NULL,
  PRIMARY KEY (`nome`)
);

-- Creazione della tabella delle sessioni
CREATE TABLE `sessions` (
  `id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  FOREIGN KEY (categoria) REFERENCES categoria(nome) ON UPDATE CASCADE ON DELETE SET NULL,
  PRIMARY KEY (`codice`)
);

-- Creazione della tabella materialeNoleggio
CREATE TABLE `materialeNoleggio` (
  `idNoleggio` int DEFAULT 0,
  `idMateriale` int DEFAULT 0,
  `quantita` int DEFAULT 1,
  FOREIGN KEY (idNoleggio) REFERENCES noleggio(id) ON DELETE CASCADE,
  FOREIGN KEY (idMateriale) REFERENCES materiale(codice) ON UPDATE CASCADE ON DELETE CASCADE,
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

-- Popolare la tabella utente con dati di esempio
INSERT INTO utente (nome, cognome, riferimentoFoto, dataNascita, email, password, ruolo)
VALUES 
('Mario', 'Rossi', '/datastore/default.jpg', '1990-05-15', 'mario@email.com', '$2b$10$KxDnkD1nru/H6geeJaYp6uPH.lg5RfLlYtS5jf5zQxMtBsUysXUci', 'utente'), /* pass: password123 */
('Giulia', 'Bianchi', '/datastore/default.jpg', '1985-10-20', 'giulia@email.com', '$2b$10$DboaTlg8.XlfJ0OVWG.Haug.XQoLdgxmFo/6S57sfFQ9AzpryThBa', 'gestore'), /* pass: securepwd */
('Luigi', 'Verdi', '/datastore/default.jpg', '1988-07-25', 'luigi@email.com', '$2b$10$nHCMQwpnOdIG/4EnZMudpuDqKXrvbJvorK22rdMG8E2kYe.Mk4he.', 'amministratore'), /* pass: test123 */
('Giovanna', 'Neri', '/datastore/default.jpg', '1995-03-12', 'giovanna@email.com', '$2b$10$Rw8zv5OGCCk7tuQNAJ4g4.jJx2CMyHWTdC0Ct.H2QcefAIrfnCTyO', 'utente'); /* pass: password456 */

-- Inserimento dei dati fittizi nella tabella `categoria`
INSERT INTO categoria (nome) VALUES
('Telecamere'),
('Illuminazione'),
('Accessori'),
('Trucco'),
('Attrezzatura Audio');

-- Inserimento dei dati fittizi nella tabella `materiale`
INSERT INTO materiale (nome, riferimentoFoto, quantita, isConsumabile, isDisponibile, categoria) VALUES
('Panasonic Lumix GH5', '/datastore/default.jpg', 6, 0, 1, 'Telecamere'),
('Nikon Z6', '/datastore/default.jpg', 5, 0, 1, 'Telecamere'),
('Luce LED Godox SL-60W', '/datastore/default.jpg', 8, 0, 1, 'Illuminazione'),
('Softbox Neewer 700W', '/datastore/default.jpg', 7, 0, 1, 'Illuminazione'),
('Fake Money Stacks', '/datastore/default.jpg', 30, 1, 1, 'Accessori'),
('Weapon Props Set', '/datastore/default.jpg', 20, 1, 1, 'Accessori'),
('Palette Trucco Makeup Revolution', '/datastore/default.jpg', 10, 1, 1, 'Trucco'),
('Registratore Audio Tascam DR-40X', '/datastore/default.jpg', 8, 0, 1, 'Attrezzatura Audio'),
('Microfono a Condensatore Rode NT1', '/datastore/default.jpg', 6, 0, 1, 'Attrezzatura Audio'),
('Sistema Microfono Senza Fili Sennheiser EW 100 G4', '/datastore/default.jpg', 4, 0, 1, 'Attrezzatura Audio'),
('Steadicam Glidecam HD-2000', '/datastore/default.jpg', 3, 0, 1, 'Accessori'),
('Kit Sangue Finto Mehron', '/datastore/default.jpg', 15, 1, 1, 'Trucco'),
('Manfrotto MT055XPRO3 Treppiede', '/datastore/default.jpg', 5, 0, 1, 'Accessori'),
('Green Screen Background', '/datastore/default.jpg', 12, 0, 1, 'Accessori');

-- Inserimento dei dati fittizi nella tabella `noleggio`
INSERT INTO noleggio (nome, riferimentoFoto, dataInizio, dataFine, idUtente, chiusuraForzata) VALUES
('Progetto Film 10', '/datastore/default.jpg', '2024-05-01', '2024-05-15', 1, 0),
('Progetto Film 11', '/datastore/default.jpg', '2024-05-05', '2024-05-20', 2, 0),
('Progetto Film 12', '/datastore/default.jpg', '2024-05-10', '2024-05-25', 3, 0),
('Progetto Film 13', '/datastore/default.jpg', '2024-05-15', '2024-05-30', 4, 0),
('Progetto Film 14', '/datastore/default.jpg', '2024-05-20', '2024-06-05', 1, 0),
('Progetto Film 15', '/datastore/default.jpg', '2024-05-25', '2024-06-10', 2, 0),
('Progetto Film 16', '/datastore/default.jpg', '2024-05-30', '2024-06-15', 3, 0),
('Progetto Film 17', '/datastore/default.jpg', '2024-06-01', '2024-06-16', 4, 0),
('Progetto Film 18', '/datastore/default.jpg', '2024-06-05', '2024-06-20', 1, 0),
('Progetto Film 19', '/datastore/default.jpg', '2024-06-10', '2024-06-25', 2, 0);

-- Inserimento dei dati fittizi nella tabella `materialeNoleggio`
INSERT INTO materialeNoleggio (idNoleggio, idMateriale, quantita) VALUES
(1, 1, 2),
(1, 2, 1),
(1, 4, 5),
(2, 3, 1),
(2, 5, 3),
(2, 6, 2),
(3, 5, 3),
(4, 7, 2),
(5, 9, 1),
(6, 11, 2),
(7, 13, 4),
(8, 14, 3),
(9, 2, 1),
(10, 4, 2);
