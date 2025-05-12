# Service de Règlement Interbancaire en Temps Réel

Ce projet implémente un système de règlement interbancaire avec quatre microservices backend :  
1. **Microservice Comptes (REST)**  
2. **Microservice Historique (GraphQL)**  
3. **Microservice Transactions (gRPC)**  
4. **Microservice Notifications (Kafka)**

## Architecture

L'architecture repose sur des microservices indépendants qui communiquent entre eux à travers différents protocoles. Chaque microservice est responsable d'une fonctionnalité spécifique dans le système.

### Microservices :

   - **Microservice Comptes (REST)** : Gestion des comptes bancaires (CRUD).
   - **Microservice Historique (GraphQL)** : Consultation de l’historique des transactions.

   - **Microservice Transactions (gRPC)** : Création et validation des transactions.
   - **Microservice Notifications (Kafka)** : Publication des notifications des transactions.

---

## 1. Conception des Microservices

### 1.1 **Microservice Comptes (REST)**

- **Fonctionnalités** :  
    - Créer un compte bancaire  
    - Consulter un compte bancaire  
    - Mettre à jour un compte bancaire  
    - Supprimer un compte bancaire  

- **Schéma de données** :
    ```sql
    Table accounts
    | account_id | owner_name | balance | bank_id |
    |------------|------------|---------|---------|
    ```

- **Endpoints REST** :
    - `GET /accounts` : Récupérer la liste des comptes
    - `POST /accounts` : Créer un nouveau compte
    - `PATCH /accounts/{id}` : Mettre à jour un compte existant
    - `DELETE /accounts/{id}` : Supprimer un compte

---

### 1.2 **Microservice Historique (GraphQL)**

- **Fonctionnalités** :  
    - Rechercher l’historique des transactions par compte, par date, etc.

- **Schéma de données** :
    ```sql
    Table transaction_history
    | transaction_id | account_id | amount | type   | timestamp |
    |----------------|------------|--------|--------|-----------|
    ```

- **Requêtes GraphQL** :
    - `query { transactions(accountId) }` : Récupérer l'historique des transactions pour un compte donné
    - `mutation { addTransaction(account_id, type, amount) }` : Ajouter une transaction dans l'historique

---

### 1.3 **Microservice Transactions (gRPC)**

- **Fonctionnalités** :  
    - Créer une transaction (débit/crédit entre comptes)
    - Valider une transaction (vérification de solde)
    - Consulter une transaction existante

- **Schéma de données** :
    ```sql
    Table transactions
    | transaction_id | sender_account_id | receiver_account_id | amount | status | timestamp |
    |----------------|-------------------|---------------------|--------|--------|-----------|
    ```

- **Services gRPC** :
    - `CreateTransaction` : Créer une transaction entre deux comptes
    - `GetTransaction` : Récupérer les détails d'une transaction spécifique

- **Fichier Proto gRPC** :
    - `transactions.proto` : Définition des services gRPC pour gérer les transactions

---

### 1.4 **Microservice Notifications (Kafka)**

- **Fonctionnalités** :  
    - Publier des notifications pour chaque transaction (confirmation, échec)

- **Schéma de données des messages Kafka** :
    ```json
    {
        "transaction_id": "tx123",
        "status": "Success",
        "message": "Transaction completed successfully",
        "timestamp": "2025-05-11T10:00:00Z"
    }
    ```

- **Producteur Kafka** :
    - Le service envoie des messages Kafka sur le `transaction-notifications` topic pour chaque transaction.

---

## 2. Interaction entre les Microservices

1. **Comptes (REST)** :  
   Le microservice Comptes fournit une API REST pour gérer les comptes bancaires. Lorsqu'un utilisateur effectue une transaction, les informations du compte sont récupérées via l'API REST.

2. **Transactions (gRPC)** :  
   Le microservice Transactions crée et valide des transactions via des appels gRPC. Il vérifie la validité des comptes et du solde avant de procéder. Une fois la transaction validée, elle est envoyée au microservice Notifications via Kafka.

3. **Historique (GraphQL)** :  
   Le microservice Historique permet de consulter l'historique des transactions via GraphQL, en utilisant l'ID du compte et d'autres critères comme la date ou le type de transaction.

4. **Notifications (Kafka)** :  
   Dès qu'une transaction est traitée, une notification est publiée sur Kafka avec les détails de la transaction. Les autres microservices peuvent s'abonner à ce topic pour recevoir les notifications.

---

## 3. Documentation des Microservices

### 3.1 **Microservice Transactions (gRPC)**

- **Fichier** : `docs/transactions-gRPC.md`
- **Contenu** :
    - Schéma des transactions
    - Fichier Proto gRPC
    - Exemples de requêtes et réponses
    - Instructions de déploiement

### 3.2 **Microservice Notifications (Kafka)**

- **Fichier** : `docs/notifications-kafka.md`
- **Contenu** :
    - Structure des messages Kafka
    - Configuration du topic `transaction-notifications`
    - Exemples de messages
    - Instructions pour Kafka

### 3.3 **Microservice Comptes (REST)**

- **Fichier** : `docs/accounts-rest.md`
- **Contenu** :
    - Schéma des comptes
    - Endpoints REST disponibles
    - Exemples de requêtes et réponses
    - Instructions de déploiement

### 3.4 **Microservice Historique (GraphQL)**

- **Fichier** : `docs/history-graphql.md`
- **Contenu** :
    - Schéma des transactions dans l'historique
    - Requêtes et mutations GraphQL disponibles
    - Exemples de requêtes et réponses
    - Instructions de déploiement

---

## 4. Technologies Utilisées

- **Node.js** : Pour la gestion des microservices.
- **MongoDB** : Base de données pour stocker les comptes et l'historique des transactions.
- **gRPC** : Pour la communication entre microservices Transaction et Validation.
- **Kafka** : Pour la publication des notifications de transaction.
- **GraphQL** : Pour la gestion des requêtes d'historique des transactions.
- **Postman** : Pour tester les API REST.

---

## 5. Instructions de Déploiement

### 5.1 **Dépendances**

- Assurez-vous d'avoir installé les dépendances suivantes :
    - `npm install` pour les microservices Node.js
    - `docker-compose` pour Kafka et MongoDB si utilisé en conteneur.

### 5.2 **Démarrage des Microservices**

1. **Lancer MongoDB** (si utilisé via Docker) :
    ```bash
    docker-compose up -d
    ```

2. **Lancer les microservices** :
    - **Comptes (REST)** :
      ```bash
      node accounts-service.js
      ```
    - **Historique (GraphQL)** :
      ```bash
      node history-service.js
      ```
    - **Transactions (gRPC)** :
      ```bash
      node transactions-service.js
      ```
    - **Notifications (Kafka)** :
      ```bash
      node notifications-service.js
      ```

---

## 6. Conclusion

Ce projet simule un système de règlement interbancaire en temps réel, utilisant des microservices pour gérer les comptes, l'historique des transactions, les transactions elles-mêmes, ainsi que les notifications des événements de transaction via Kafka. Il est conçu pour être scalable et extensible pour répondre aux besoins d'un système de paiement moderne.

