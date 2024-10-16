# Dossier Open - Gestionnaire de Points pour les Étudiants du Campus Eductive

Cette application aide les étudiants du campus Eductive à mieux gérer leurs dossiers Open en facilitant le suivi des actions et des points associés. Elle permet de générer un PDF synthétisant les actions effectuées, les points accumulés, ainsi que les justificatifs associés.

Créée par **Chuky Fredj**. 👋

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Scripts Disponibles](#scripts-disponibles)
- [Contribuer](#contribuer)
- [Licence](#licence)
- [Remerciements](#remerciements)

## Fonctionnalités

- **Gestion des Actions** : Ajouter, modifier et supprimer des actions associées à différents axes.
- **Calcul Automatique des Points** : Les points sont calculés automatiquement en fonction des actions saisies.
- **Stockage Local** : Les données sont sauvegardées localement dans le navigateur (localStorage et IndexedDB) pour une persistance des données.
- **Gestion des Justificatifs** : Téléchargement et rognage des images des justificatifs associés à chaque action.
- **Génération de PDF** : Générer un PDF récapitulatif des actions et des points accumulés.
- **Affichage des Logos des Écoles** : Affichage dynamique des logos en fonction de l'école sélectionnée.
- **Réinitialisation des Données** : Bouton pour réinitialiser l'application et effacer toutes les données stockées.
- **Limitation de la Taille des Fichiers** : Les images téléchargées sont limitées à 2 Mo pour une performance optimale.

## Prérequis

- **Node.js** (version 14 ou supérieure recommandée)
- **npm** ou **yarn**

## Installation

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/votre-utilisateur/votre-repo.git
   cd votre-repo
   ```

2. **Installer les dépendances**

   Avec npm :

   ```bash
   npm install
   ```

   Ou avec yarn :

   ```bash
   yarn install
   ```

## Utilisation

Pour lancer l'application en mode développement :

Avec npm :

```bash
npm run dev
```

Ou avec yarn :

```bash
yarn dev
```

Ouvrez votre navigateur et accédez à `http://localhost:3000` (ou le port indiqué dans le terminal).

## Scripts Disponibles

- **`npm run dev`** : Démarre l'application en mode développement.
- **`npm run build`** : Compile l'application pour la production.
- **`npm run serve`** : Sert l'application compilée.

## Contribuer

Les contributions sont les bienvenues ! Si vous souhaitez améliorer cette application, veuillez suivre les étapes suivantes :

1. **Fork** le projet.
2. **Créer une branche** pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`).
3. **Committer** vos modifications (`git commit -m 'Ajout de ma fonctionnalité'`).
4. **Pusher** vers la branche (`git push origin feature/ma-fonctionnalite`).
5. **Ouvrir une Pull Request**.

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Remerciements

- Merci à tous les étudiants Eductive campus pour leur soutien et leurs retours.
- Un grand merci aux mainteneurs des bibliothèques open-source utilisées dans ce projet.
