# Murith Prévoyance — site (HTML/CSS/JS statique)

Ouvrir `index.html` (français) ou `en/index.html` (English). Aucune dépendance de build.

## Déploiement GitHub Pages
- Déposer **le contenu de ce dossier à la racine** du dépôt (y compris `.nojekyll`).
- Les adresses SEO (`canonical`, `hreflang`, `sitemap.xml`, `robots.txt`, données structurées) pointent vers **https://www.murithprevoyance.ch**. Pour utiliser ce domaine : Settings → Pages → Custom domain, et ajouter un fichier `CNAME` contenant `www.murithprevoyance.ch`.
- `404.html` est servie automatiquement par GitHub Pages pour toute adresse inconnue.
- Les anciennes adresses Wix (`/obseque`, `/blog`, `/post/...`, `/en/...`) renvoient vers les nouvelles pages par des pages-relais.

## À savoir
- Images : plusieurs largeurs WebP par photo (`assets/*-480.webp`, `-800`, `-1200`…) et recadrages mobile ; le navigateur choisit selon l’écran.
- L’espace client est une **démonstration** (données fictives, aucune authentification réelle).
- Pages `noindex` : `mon-compte`, `espace-client`, `mentions-legales` (à compléter, puis retirer le `noindex`).
- Horaires repris de murith.ch : tous les jours 8h00–12h00 et 13h30–17h30.
