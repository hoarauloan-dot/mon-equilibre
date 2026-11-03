# Mon Équilibre — V1 (1.0.0)

Application personnelle PWA, 100 % statique, conçue pour fonctionner sur GitHub Pages. Pas de compte, de publicité, de serveur de données ni de bibliothèque externe. L'interface est en français. Les entrées sont vides au premier lancement.

## Installation sur GitHub Pages

1. Connectez-vous à GitHub depuis votre PC Windows. Créez un **nouveau dépôt public** nommé par exemple `mon-equilibre` (indépendant des autres applications). Le dépôt public contiendra **uniquement le code**, jamais les sauvegardes JSON.
2. Dans ce dépôt, choisissez **Add file → Upload files**. Décompressez le ZIP et **envoyez tous les fichiers contenus dans le dossier `mon-equilibre-v1` directement à la racine du dépôt**, et non le dossier parent. Vérifiez la présence de `index.html` à la racine, puis cliquez sur **Commit changes**.
3. Allez dans **Settings → Pages → Build and deployment → Source: Deploy from a branch**. Sélectionnez `main` et `/ (root)` puis **Save**.
4. La publication est accessible, après déploiement, à `https://VOTRE-PSEUDO.github.io/mon-equilibre/` (remplacez `VOTRE-PSEUDO` et adaptez si vous avez nommé le dépôt autrement).
5. Ouvrez l'adresse sur le téléphone connecté à Internet **une première fois** et patientez jusqu'au chargement complet, pour permettre la mise en cache hors ligne.

## Ajouter sur l'écran d'accueil

- **iPhone** : ouvrez l'adresse dans **Safari**, touchez **Partager**, puis **Sur l'écran d'accueil → Ajouter**. Ouvrez ensuite la nouvelle icône. L'emplacement précis de l'option peut varier selon la version d'iOS.
- **Android** : ouvrez l'adresse dans **Chrome**, puis menu ⋮ → **Installer l'application** ou **Ajouter à l'écran d'accueil**, selon le navigateur/appareil.
- Pas de Mac, App Store, Play Store ni PC allumé requis après publication.

## Mise à jour sans désinstaller

1. Modifiez les fichiers nécessaires sur GitHub et faites **Commit changes**.
2. **Changez impérativement `const VERSION='v1'` dans `sw.js` vers `v2`, puis `v3`**, etc. lors de chaque nouvelle publication. C'est ce qui crée un nouveau cache et déclenche un nouveau service worker.
3. Après la fin de publication GitHub Pages, ouvrez l'application installée sur le téléphone, touchez la roue dentée **Paramètres → Rechercher les mises à jour**.
4. Si une nouvelle version est prête, touchez **Charger la nouvelle version**. Fermez les formulaires avant l'activation. Si le navigateur ne recharge pas immédiatement, fermez puis rouvrez l'application.
5. **Ne supprimez pas l'application pour mettre à jour**. Gardez le même dépôt, URL, `manifest.id`, `start_url`, `scope` et nom IndexedDB. Une nouvelle version graphique ne nécessite pas de changer la version de la base IndexedDB.
6. Pour personnaliser l'icône installée, remplacez les trois images et mettez à jour la version du cache. Certaines plateformes conservent l'ancienne icône un certain temps.

**Important :** le bouton identifie une version *installée et en attente* (waiting). Si rien n'est prêt, il signale qu'aucune nouvelle version prête n'a été détectée, et non une preuve absolue que GitHub Pages n'a pas été modifié. En cas d'incertitude, vérifiez le déploiement GitHub Pages et réessayez.

## Fonctionnalités V1

- Tableau de bord : dernière pesée, évolution globale, objectif en cours, pesée prévue (événement de catégorie « Pesée prévue »), prochain événement, actions rapides.
- Pesées : ajout/édition/suppression, note, historique replié à 3, filtres semaine/mois/année/dates, courbe Canvas, comparaison de 2 pesées et vue calendrier.
- Objectifs : types personnel, baisse, hausse, maintien ; titre, dates, référence, cible facultative, association à événement, description, notes, statuts, archivage.
- Calendrier : navigation par mois, ajout/édition/suppression d'événements, sélection du jour, visualisation des pesées. **Déplacer une date** = modifier l'événement, choisir une autre date et enregistrer (pas de glisser-déposer en V1).
- Journal : notes datées, catégories, recherche dans titre/texte/catégorie, affichage replié.
- Paramètres : personnalisation du nom affiché et de la couleur principale, export JSON, import JSON avec vérification et confirmation, bouton de vérification des mises à jour.

## Données et sauvegardes

Les données sont conservées sur **cet appareil, dans ce profil de navigateur/PWA** avec IndexedDB (`mon-equilibre-db`), et ne sont **jamais commitées sur GitHub**. Safari et la PWA installée peuvent avoir des stockages isolés : les sauvegardes sont nécessaires pour transférer les informations.

Dans Paramètres, cliquez sur **Exporter une sauvegarde** et vérifiez que le fichier a effectivement été enregistré dans Fichiers/Téléchargements. Stockez-en une copie dans un endroit sûr. Le champ « Dernier export connu » reflète la préparation du téléchargement, pas la certitude que vous avez conservé le fichier. Pour restaurer, sélectionnez ce fichier avec **Importer une sauvegarde** : l'application vérifie la structure avant d'afficher une confirmation explicite de remplacement. Une restauration **remplace** toutes les données, elle ne fusionne pas les entrées.

Supprimer la PWA, vider le stockage du navigateur ou certains nettoyages système peut supprimer les données locales. GitHub Pages héberge le code, pas vos données. La sauvegarde JSON contient des informations personnelles : ne la publiez jamais dans un dépôt public.

## Architecture

| Fichier | Rôle |
| --- | --- |
| `index.html` | Structure, navigation, dialogue |
| `style.css` | Thème, responsive mobile, safe areas iPhone |
| `app.js` | Affichage, formulaires, filtres, calendrier, export/import, mise à jour |
| `db.js` | IndexedDB, magasins séparés, remplacement transactionnel |
| `sw.js` | Cache local préchargé, navigation hors ligne, activation contrôlée |
| `manifest.webmanifest` | Identité stable et configuration PWA |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | Icônes |

Le service worker n'efface **que les caches dont le préfixe commence par** `mon-equilibre:` et contient le scope propre à l'application. La base IndexedDB est indépendante de Loan's Music et Loan's Fit.

## Limites et précautions

- Aucun synchronisation automatique entre appareils. La sauvegarde JSON permet une migration manuelle.
- Ne pas importer directement des anciennes captures de notes : saisir et vérifier les informations séparément avant de les enregistrer.
- Le calendrier est mensuel, sans glisser-déposer. L'évolution sur l'accueil est calculée entre la première et la dernière pesée **globale** ; le filtre temporel est dans « Mes pesées ».
- La courbe affiche les poids, sans interprétation ni recommandation médicale.
- L'installation et les comportements de mise à jour dépendent partiellement de Safari/iOS et Chrome/Android et doivent être vérifiés sur les vrais téléphones.

## Tests et maintenance

`node --check app.js`, `node --check db.js`, `node --check sw.js` permettent de vérifier la syntaxe JS. Vous pouvez tester en local à l'aide d'un serveur (`python -m http.server 8000` puis `http://localhost:8000/`), mais une installation réelle nécessite HTTPS (fourni par GitHub Pages).

Pour une nouvelle version, modifiez **uniquement** les fichiers nécessaires, incrémentez `VERSION` dans `sw.js` et vérifiez toutes les ressources dans `ASSETS`. N'incrémentez pas `DB_VERSION` dans `db.js` sans migration. Ne touchez pas aux projets Loan's Music / Loan's Fit.
