# Porjet 2 _ Voting

## Introduction

Le contrat "Voting" est un contrat de vote qui permet d'enregistrer des votants, de proposer des choix et de voter pour ces choix. Le contrat suit un workflow de vote avec plusieurs étapes, telles que l'enregistrement des votants, l'ouverture des inscriptions pour les propositions, la clôture des inscriptions pour les propositions, le démarrage de la session de vote, la clôture de la session de vote et le dépouillement des votes.

Le contrat contient plusieurs structures de données, notamment:

Voter: représente un votant et contient des informations telles que son statut d'enregistrement, s'il a déjà voté et l'ID de la proposition pour laquelle il a voté.
Proposal: représente une proposition de vote avec une description et un compteur de votes.
WorkflowStatus: une énumération représentant les différents états du workflow de vote.
Le contrat a également des événements pour notifier les changements d'état et les actions telles que l'enregistrement d'un votant, l'enregistrement d'une proposition et le vote.

Le contrat expose plusieurs fonctions pour effectuer différentes actions, notamment:

addVoter: utilisé pour ajouter un votant à la liste des votants enregistrés.
addProposal: utilisé pour ajouter une proposition à la liste des propositions.
setVote: utilisé par les votants pour enregistrer leur vote pour une proposition donnée.
startProposalsRegistering, endProposalsRegistering, startVotingSession, endVotingSession, tallyVotes: utilisés par le propriétaire du contrat pour passer d'un état à un autre dans le workflow de vote.
getVoter: utilisé pour obtenir les informations d'un votant.
getProposal: utilisé pour obtenir les informations d'une proposition.
getWorkflowStatus: utilisé pour obtenir l'état actuel du workflow de vote.
Le contrat contient également des fonctions auxiliaires pour obtenir des informations sur les votants et les propositions, telles que getVotersCount, getProposalsCount, getVoterProposalVote, getProposalVoteCount, etc.


## Installation

Pour installer le projet, il faut cloner le repository et installer les dépendances.

```bash
git clone
npm install
```

## Utilisation

Pour lancer les tests, il faut utiliser la commande suivante:

```bash
npm run test
```
## Tests unitaires

Les tests unitaires sont situés dans le dossier "test" et sont écrits en javascript. Ils utilisent le framework de test Mocha et l'outil de développement Truffle. Les tests vérifient différentes fonctionnalités du contrat, telles que l'ajout d'un votant, l'ajout d'une proposition, l'enregistrement d'un vote, le suivi de l'état du workflow de vote, etc. Les tests utilisent également des fonctions auxiliaires pour obtenir des informations sur les votants et les propositions afin de vérifier le bon fonctionnement du contrat.

## les d"describe" et les "it"

Les tests sont organisés en suites de tests et en tests individuels. Les suites de tests sont définies par la fonction describe et les tests individuels sont définis par la fonction it. Les suites de tests sont utilisées pour regrouper des tests individuels qui vérifient une fonctionnalité spécifique du contrat. Les tests individuels sont utilisés pour vérifier le comportement attendu d'une fonctionnalité spécifique du contrat.

## getVoter :

Description : Vérifie la fonction getVoter pour récupérer les détails d'un votant.

Étapes :

Ajouter un votant.
Appeler la fonction getVoter pour le votant ajouté.
Comportement attendu :
Le votant devrait être enregistré.
Le votant ne devrait pas avoir voté.
L'ID de la proposition votée devrait être 0.

## getOneProposal :

Description : Vérifie la fonction getOneProposal pour récupérer les détails d'une proposition.

Étapes :

Ajouter un votant.
Démarrer l'enregistrement des propositions.
Ajouter une proposition.
Appeler la fonction getOneProposal pour la proposition ajoutée.
Comportement attendu :
La description de la proposition récupérée devrait correspondre à la proposition ajoutée.
Le compteur de votes de la proposition récupérée devrait être 0.

## addVoter :

Description : Vérifie la fonction addVoter pour ajouter un nouveau votant.

Étapes :

Ajouter un votant.
Obtenir les détails du votant.
Comportement attendu :
Le votant devrait être enregistré.
L'événement VoterRegistered devrait être émis.

## addProposal :

Description : Vérifie la fonction addProposal pour ajouter une nouvelle proposition.

Étapes :

Ajouter des votants.
Démarrer l'enregistrement des propositions.
Ajouter une proposition.
Obtenir les détails de la proposition.
Comportement attendu :
La proposition devrait être enregistrée.
L'événement ProposalRegistered devrait être émis.

## setVote :

Description : Vérifie la fonction setVote pour permettre à un votant enregistré de voter.
Étapes :
Ajouter des votants.
Démarrer l'enregistrement des propositions.
Ajouter des propositions.
Mettre fin à l'enregistrement des propositions.
Démarrer la session de vote.
Effectuer un vote.
Obtenir les détails du votant.
Comportement attendu :
Le votant devrait avoir voté pour la proposition spécifiée.
L'événement Voted devrait être émis.

## WorkflowStatus :

Description : Vérifie les transitions d'état du contrat Voting.
Étapes :
Tester chaque fonction de transition d'état individuellement.
Comportement attendu :
Le contrat devrait passer d'un état à un autre correctement.



