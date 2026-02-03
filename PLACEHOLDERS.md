# Éléments à compléter – Safeness Transport

Liste des infos marquées « à remplir » ou « pas encore » sur le site.  
Recherchez `[À REMPLIR` ou `[TO FILL` dans les textes et dans ce fichier.

---

## À faire / Pas encore

| Élément | Où | Action |
|--------|-----|--------|
| **Email** | Footer, Mentions légales, CGV, DPO, Confidentialité | Remplacer `[À REMPLIR - email]` par l’adresse réelle. Mettre à jour le `href` du lien email dans le footer (actuellement `#contact-email`). |
| **Logo** | Nav + Footer (alt + image) | Remplacer l’image du logo par le fichier final. Fichier à créer : `public/logo.png` (ou .svg). |
| **Partenaires** | Section « Ils nous font confiance » | Remplacer `[À REMPLIR - Partenaire 1/2]` par les vrais noms + logos + URLs. Voir `partners.list` dans `src/locales/fr.json` et `en.json`. |
| **Tarifs** | Cartes véhicules (Flotte) | Remplacer `[À REMPLIR - tarifs]` par les prix (ex. « À partir de 100€ ») dans `fleet.vehicles.*.price` (fr + en). |
| **Avis Google** | Bouton « Voir tous les avis » | Vérifier l’URL dans `testimonials.reviewsUrl` (lien vers la fiche Google Maps / avis). |
| **Solutions / réductions entreprises** | Texte ou section dédiée | Contenu à rédiger. Clés prévues : `footer.placeholderSolutionsEntreprises` (pour rappel). À intégrer où vous voulez (ex. FAQ, bloc Entreprises). |
| **SEO** | `index.html`, meta, titres | Titre, description, mots-clés, Open Graph. Clé rappel : `footer.placeholderSEO`. |

---

## Déjà en place

- **Nom** : Safeness Transport  
- **Téléphone** : 06 05 99 82 11 (WhatsApp + lien tel)  
- **Zone** : Paris, France, Europe  
- **Flotte** : 3 véhicules + autres sur demande, sous-traitance France / Europe (Milan, Munich, Paris…)  
- **Actif depuis** : 2018  
- **Clients transportés** : 1500 (bloc À propos)  
- **Horaires** : 24h/7j  
- **Réservation** : renvoi WhatsApp  
- **Voiture la plus demandée** : Classe E (mention dans la flotte)  
- **Palette** : gris, blanc, camel clair (variables CSS `--color-camel`, `--color-camel-light`)  
- **Ton** : chaleureux, naturel, élégant (reflété dans les textes À propos / services)  

---

## Autres infos éventuellement utiles

- **Réseaux sociaux** : Liens footer actuellement en `fleetprivee`. À mettre à jour si les comptes Safeness Transport sont différents (Instagram, Facebook, LinkedIn).  
- **Adresse postale / siège** : Si vous voulez l’afficher dans le footer ou les mentions légales (actuellement « Paris, France »).  
- **SIRET / raison sociale** : À intégrer dans les mentions légales quand vous les avez.  
- **Médiation** : Si vous adhérez à un médiateur (CGV), ajouter ses coordonnées dans `cgv.disputesContent`.  

---

*Fichier généré pour rappel. Vous pouvez le supprimer ou le garder à jour.*
