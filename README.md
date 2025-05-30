projet-reglement-interbancaire.md
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

## 3. Cas d’usage principaux (User Stories)

Cette section décrit les principales interactions entre les utilisateurs et le système. Chaque cas d’usage illustre un scénario réaliste que ce système permet de gérer.

### 3.1 **Création de compte bancaire**

**Acteur** : Client ou administrateur de la banque  
**Pré-condition** : L'utilisateur possède les informations nécessaires (nom, banque, solde initial)  
**Scénario** :
- Le client envoie une requête POST via l’API REST.
- Le microservice Comptes enregistre le compte en base de données.
- Une confirmation est retournée avec l’identifiant du compte.

---

### 3.2 **Initiation et validation d'une transaction**

**Acteur** : Client initiant un transfert d'argent  
**Pré-condition** : Le compte émetteur existe et dispose d’un solde suffisant  
**Scénario** :
- L’utilisateur envoie une requête de transaction.
- Le microservice Transactions (gRPC) vérifie les soldes et crée une transaction.
- Si valide, les soldes sont mis à jour et la transaction est enregistrée.
- Un message est publié sur Kafka pour notifier du résultat.

---

### 3.3 **Consultation de l’historique des transactions**

**Acteur** : Client ou administrateur  
**Pré-condition** : Le compte cible existe  
**Scénario** :
- L’utilisateur effectue une requête GraphQL en fournissant un identifiant de compte.
- Le microservice Historique retourne les transactions.

---

### 3.4 **Réception de notification en temps réel**

**Acteur** : Système tiers (abonné Kafka) ou utilisateur final  
**Pré-condition** : Une transaction a été initiée ou complétée  
**Scénario** :
- Le microservice Notifications publie un message sur le topic Kafka `transaction-notifications`.
- Un système abonné (ex : une interface web ou une appli mobile) reçoit les mises à jour instantanément.
- L’utilisateur est informé du succès ou de l’échec de sa transaction.

---

## 4. Technologies Utilisées

- **Node.js** : Pour la gestion des microservices.
- **MongoDB** : Base de données pour stocker les comptes et l'historique des transactions.
- **gRPC** : Pour la communication entre microservices Transaction et Validation.
- **Kafka** : Pour la publication des notifications de transaction.
- **GraphQL** : Pour la gestion des requêtes d'historique des transactions.
- **Postman** : Pour tester les API REST.

---

## 6. Conclusion

Ce projet simule un système de règlement interbancaire en temps réel, utilisant des microservices pour gérer les comptes, l'historique des transactions, les transactions elles-mêmes, ainsi que les notifications des événements de transaction via Kafka. Il est conçu pour être scalable et extensible pour répondre aux besoins d'un système de paiement moderne.
EOF
