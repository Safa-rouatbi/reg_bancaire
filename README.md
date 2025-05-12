Service de Règlement Interbancaire en Temps Réel
Description
Ce projet implémente un système de règlement interbancaire en temps réel, composé de quatre microservices backend, chacun responsable d'un aspect spécifique du système bancaire :

Safa (REST + GraphQL) :

Microservice Comptes (REST) : Gestion des comptes bancaires (CRUD).

Microservice Historique (GraphQL) : Consultation de l’historique des transactions.

Tasnim (Kafka + gRPC) :

Microservice Transactions (gRPC) : Création et validation des transactions.

Microservice Notifications (Kafka) : Publication de notifications en temps réel.

Composants du Projet
1. Microservice Comptes (REST)
Fonctionnalités
Créer, consulter, mettre à jour et supprimer des comptes bancaires.

Fournir des endpoints REST pour interagir avec les comptes.

Schéma de données
La table accounts contient les informations suivantes :

sql
Copier
Modifier
CREATE TABLE accounts (
  account_id INT AUTO_INCREMENT PRIMARY KEY,
  owner_name VARCHAR(255) NOT NULL,
  balance DECIMAL(15, 2) NOT NULL,
  bank_id INT NOT NULL
);
Endpoints REST
GET /accounts : Récupérer la liste de tous les comptes.

GET /accounts/{id} : Récupérer un compte par son ID.

POST /accounts : Créer un nouveau compte bancaire.

PATCH /accounts/{id} : Mettre à jour un compte existant.

DELETE /accounts/{id} : Supprimer un compte bancaire.

