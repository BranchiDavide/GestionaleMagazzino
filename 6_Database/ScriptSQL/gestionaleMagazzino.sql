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

-- Popolare la tabella categoria con dati di esempio
INSERT INTO categoria (nome) VALUES ('Elettronica'), ('Abbigliamento'), ('Casa'), ('Giocattoli');

-- Popolare la tabella utente con dati di esempio
INSERT INTO utente (nome, cognome, dataNascita, email, password, ruolo)
VALUES 
('Mario', 'Rossi', '1990-05-15', 'mario@email.com', '$2b$10$KxDnkD1nru/H6geeJaYp6uPH.lg5RfLlYtS5jf5zQxMtBsUysXUci', 'utente'), /* pass: password123 */
('Giulia', 'Bianchi', '1985-10-20', 'giulia@email.com', '$2b$10$DboaTlg8.XlfJ0OVWG.Haug.XQoLdgxmFo/6S57sfFQ9AzpryThBa', 'gestore'), /* pass: securepwd */
('Luigi', 'Verdi', '1988-07-25', 'luigi@email.com', '$2b$10$nHCMQwpnOdIG/4EnZMudpuDqKXrvbJvorK22rdMG8E2kYe.Mk4he.', 'amministratore'), /* pass: test123 */
('Giovanna', 'Neri', '1995-03-12', 'giovanna@email.com', '$2b$10$Rw8zv5OGCCk7tuQNAJ4g4.jJx2CMyHWTdC0Ct.H2QcefAIrfnCTyO', 'utente'); /* pass: password456 */

-- Popolare la tabella noleggio con dati di esempio
INSERT INTO noleggio (nome, dataInizio, dataFine, autore)
VALUES 
('Noleggio di prova', '2024-02-01', '2024-02-10', 1),
('Altro noleggio', '2024-01-15', '2024-02-20', 2),
('Terzo noleggio', '2024-03-05', '2024-03-15', 3);

-- Popolare la tabella materiale con dati di esempio
INSERT INTO materiale (nome, quantita, isConsumabile, isDisponibile, categoria)
VALUES 
('Computer', 10, 0, 1, 'Elettronica'),
('Divano', 5, 0, 1, 'Casa'),
('T-shirt', 20, 1, 1, 'Abbigliamento'),
('Lego', 30, 1, 1, 'Giocattoli');

-- Popolare la tabella materialeNoleggio con dati di esempio
INSERT INTO materialeNoleggio (idNoleggio, idMateriale, quantita)
VALUES 
(1, 1, 2),
(1, 2, 1),
(2, 3, 3),
(3, 4, 5);
