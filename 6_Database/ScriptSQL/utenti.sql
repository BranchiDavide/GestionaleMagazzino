CREATE USER 'app-user'@'localhost'; -- SETTARE PASSWORD
GRANT SELECT,INSERT,UPDATE,DELETE ON gestionaleMagazzino.* TO 'app-user'@'localhost';