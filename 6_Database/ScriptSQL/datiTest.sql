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
  ('Sophia', 'Taylor', '/path/to/photo13.jpg', '1993-08-25', 'sophia.taylor@example.com', SHA2('passwordSophia', 256), 'gestore'),
  ('Mason', 'Clark', '/path/to/photo14.jpg', '1980-12-05', 'mason.clark@example.com', SHA2('passwordMason', 256), 'utente'),
  ('Emma', 'Allen', '/path/to/photo15.jpg', '1988-06-15', 'emma.allen@example.com', SHA2('passwordEmma', 256), 'gestore'),
  ('Olivia', 'Young', '/path/to/photo16.jpg', '1996-03-10', 'olivia.young@example.com', SHA2('passwordOlivia', 256), 'utente'),
  ('James', 'Scott', '/path/to/photo17.jpg', '1975-09-20', 'james.scott@example.com', SHA2('passwordJames', 256), 'gestore'),
  ('Emily', 'King', '/path/to/photo18.jpg', '1982-05-30', 'emily.king@example.com', SHA2('passwordEmily', 256), 'utente'),
  ('Michael', 'Wright', '/path/to/photo19.jpg', '1990-11-18', 'michael.wright@example.com', SHA2('passwordMichael', 256), 'gestore'),
  ('Charlotte', 'Evans', '/path/to/photo20.jpg', '1984-04-12', 'charlotte.evans@example.com', SHA2('passwordCharlotte', 256), 'utente'),
  ('Alexander', 'Walker', '/path/to/photo21.jpg', '1979-07-22', 'alexander.walker@example.com', SHA2('passwordAlexander', 256), 'gestore'),
  ('Amelia', 'Robinson', '/path/to/photo22.jpg', '1991-01-05', 'amelia.robinson@example.com', SHA2('passwordAmelia', 256), 'utente');
  
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
  ('Noleggio 1', '/path/to/photo1.jpg', '2024-02-08', '2024-02-15', 1, 0),
  ('Noleggio 2', '/path/to/photo2.jpg', '2024-01-20', '2024-01-30', 2, 0),
  ('Noleggio 3', '/path/to/photo3.jpg', '2024-02-02', '2024-02-10', 3, 0),
  ('Noleggio 4', '/path/to/photo4.jpg', '2024-01-15', '2024-01-25', 4, 0),
  ('Noleggio 5', '/path/to/photo5.jpg', '2024-02-12', '2024-02-20', 5, 0),
  ('Noleggio 6', '/path/to/photo6.jpg', '2024-01-25', '2024-02-05', 6, 0),
  ('Noleggio 7', '/path/to/photo7.jpg', '2024-02-05', '2024-02-15', 7, 0),
  ('Noleggio 8', '/path/to/photo8.jpg', '2024-01-10', '2024-01-20', 8, 0),
  ('Noleggio 9', '/path/to/photo9.jpg', '2024-02-18', '2024-02-28', 9, 0),
  ('Noleggio 10', '/path/to/photo10.jpg', '2024-01-08', '2024-01-18', 10, 0);


INSERT INTO materialeNoleggio (idNoleggio, idMateriale, quantita) VALUES
  (1, 1, 2),
  (1, 4, 1),
  (2, 2, 3),
  (3, 3, 5),
  (4, 1, 1),
  (4, 2, 2),
  (4, 3, 4),
  (4, 4, 2),
  (5, 5, 2),
  (5, 6, 3),
  (6, 7, 1),
  (6, 8, 1),
  (7, 9, 2),
  (7, 10, 3),
  (8, 1, 1),
  (8, 2, 1),
  (9, 3, 2),
  (9, 4, 1),
  (10, 5, 1),
  (10, 6, 2);