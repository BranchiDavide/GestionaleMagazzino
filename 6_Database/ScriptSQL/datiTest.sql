INSERT INTO categoria (nome) VALUES 
  ('Elettronica'),
  ('Abbigliamento'),
  ('Casa'),
  ('Giardino'),
  ('Sport'),
  ('Cucina'),
  ('Musica'),
  ('Libri'),
  ('Film'),
  ('Fai da te');

INSERT INTO utente (nome, cognome, riferimentoFoto, dataNascita, email, password, ruolo) VALUES
  ('Sophia', 'Taylor', '/path/to/photo13.jpg', '1993-08-25', 'sophia.taylor@example.com', 'passwordSophia', 'amministratore'),
  ('Mason', 'Clark', '/path/to/photo14.jpg', '1980-12-05', 'mason.clark@example.com', 'passwordMason', 'utente'),
  ('Emma', 'Allen', '/path/to/photo15.jpg', '1988-06-15', 'emma.allen@example.com', 'passwordEmma', 'amministratore'),
  ('Olivia', 'Young', '/path/to/photo16.jpg', '1996-03-10', 'olivia.young@example.com', 'passwordOlivia', 'utente'),
  ('James', 'Scott', '/path/to/photo17.jpg', '1975-09-20', 'james.scott@example.com', 'passwordJames', 'amministratore'),
  ('Emily', 'King', '/path/to/photo18.jpg', '1982-05-30', 'emily.king@example.com', 'passwordEmily', 'amministratore'),
  ('Michael', 'Wright', '/path/to/photo19.jpg', '1990-11-18', 'michael.wright@example.com', 'passwordMichael', 'gestore'),
  ('Charlotte', 'Evans', '/path/to/photo20.jpg', '1984-04-12', 'charlotte.evans@example.com', 'passwordCharlotte', 'utente'),
  ('Alexander', 'Walker', '/path/to/photo21.jpg', '1979-07-22', 'alexander.walker@example.com', 'passwordAlexander', 'gestore'),
  ('Amelia', 'Robinson', '/path/to/photo22.jpg', '1991-01-05', 'amelia.robinson@example.com', 'passwordAmelia', 'utente');

INSERT INTO materiale (nome, riferimentoFoto, quantita, isConsumabile, isDisponibile, categoria) VALUES
  ('Television', '/path/to/photo35.jpg', 8, 0, 1, 'Elettronica'),
  ('Jeans', '/path/to/photo36.jpg', 30, 0, 1, 'Abbigliamento'),
  ('Coffee maker', '/path/to/photo37.jpg', 5, 0, 1, 'Cucina'),
  ('Garden hose', '/path/to/photo38.jpg', 12, 0, 1, 'Giardino'),
  ('Tennis racket', '/path/to/photo39.jpg', 10, 0, 1, 'Sport'),
  ('Bookshelf', '/path/to/photo40.jpg', 3, 0, 1, 'Casa'),
  ('Acoustic guitar', '/path/to/photo41.jpg', 4, 0, 1, 'Musica'),
  ('Cookbook', '/path/to/photo42.jpg', 15, 0, 1, 'Libri'),
  ('DVD player', '/path/to/photo43.jpg', 6, 0, 1, 'Film'),
  ('Toolbox', '/path/to/photo44.jpg', 8, 0, 1, 'Fai da te');

INSERT INTO noleggio (nome, riferimentoFoto, dataInizio, dataFine, idUtente, chiusuraForzata) VALUES
  ('Noleggio 11', '/path/to/photo25.jpg', '2024-02-02', '2024-02-10', 1, 0),
  ('Noleggio 12', '/path/to/photo26.jpg', '2024-01-15', '2024-01-25', 2, 0),
  ('Noleggio 13', '/path/to/photo27.jpg', '2024-02-12', '2024-02-20', 3, 0),
  ('Noleggio 14', '/path/to/photo28.jpg', '2024-01-25', '2024-02-05', 4, 0),
  ('Noleggio 15', '/path/to/photo29.jpg', '2024-02-05', '2024-02-15', 5, 0),
  ('Noleggio 16', '/path/to/photo30.jpg', '2024-01-10', '2024-01-20', 6, 0),
  ('Noleggio 17', '/path/to/photo31.jpg', '2024-02-18', '2024-02-28', 7, 0),
  ('Noleggio 18', '/path/to/photo32.jpg', '2024-01-08', '2024-01-18', 8, 0),
  ('Noleggio 19', '/path/to/photo33.jpg', '2024-02-22', '2024-03-03', 9, 0),
  ('Noleggio 20', '/path/to/photo34.jpg', '2024-01-30', '2024-02-09', 10, 0);


INSERT INTO materialeNoleggio (idNoleggio, idMateriale, quantita) VALUES
  (9, 35, 2),
  (9, 36, 3),
  (10, 37, 1),
  (10, 38, 1),
  (11, 39, 2),
  (11, 40, 1),
  (12, 41, 1),
  (12, 42, 2),
  (13, 43, 1),
  (13, 44, 3),
  (14, 35, 1),
  (14, 36, 2),
  (15, 37, 2),
  (15, 38, 3),
  (16, 39, 1),
  (16, 40, 1),
  (17, 41, 2),
  (17, 42, 1),
  (18, 43, 1),
  (18, 44, 2);

