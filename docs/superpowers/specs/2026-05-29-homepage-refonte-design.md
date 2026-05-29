# Refonte Homepage — luminaconsulting.fr

**Date** : 2026-05-29
**Objectif** : Pivoter le site d'un positionnement généraliste (startups, mariages, associations) vers un positionnement exclusif : fondateurs de marques e-commerce en croissance (20K-80K€/mois, Shopify).

---

## Principes directeurs

### Cible
Fondateur de marque e-commerce (mode, lifestyle, beauté, streetwear) qui fait 20K-80K€/mois sur Shopify. Son site ne reflète pas la qualité de sa marque.

### Promesse
Un site e-commerce sur mesure, rapide, fiable, qui convertit — et un accompagnement qui ne s'arrête pas après la mise en ligne.

### Ton
- Vouvoyer (professionnel, premium)
- Confiant sans être arrogant, direct sans être froid, empathique sans être mielleux
- Phrases courtes, paragraphes de 2-3 lignes max
- Chaque titre parle au CLIENT, pas à Lumina

### Mots interdits
artisan, âme, rêve, pixel, chaleur, magie, passion, écosystème, digital, bespoke, holistique, synergie, disruption, et tout terme technique (Nuxt, Vue, CI/CD, DevOps, Prismic, API, SSR, headless, pipeline, staging, CKA, Kubernetes, Lighthouse, Sentry)

### Mots encouragés
marque, croissance, conversion, ventes, résultats, sur mesure, fiable, rapide, serein, confiance, accompagnement, partenaire, autonomie, tranquillité

### Zéro jargon technique
Le visiteur est un entrepreneur, pas un développeur. Tout est traduit en résultat concret. Aucune technologie, certification technique, ou score nommé.

### Pas de prix affichés
L'objectif est de donner envie de prendre contact. Les CTA poussent vers `/contact`.

---

## Approche technique

**Approche A** — Réutiliser les slices existantes au maximum. On modifie le contenu Prismic des slices Hero, Expertise, Methodologie. On crée 3 nouvelles slices Prismic (Problemes, PourquoiLumina, CtaFinal). On conserve Realisations et Temoignages intacts pour réactivation future.

### Conservation des slices
- **Realisations** : retirée du SliceZone dans `customtypes/page/index.json`, mais composant + modèle restent dans le repo. Réactivation = remettre l'entrée dans le custom type.
- **Temoignages** : masquée côté éditeur Prismic (retirée du contenu de la page). Composant + modèle restent intacts.

---

## Rythme visuel de la page

| # | Section | Layout | Fond |
|---|---|---|---|
| 1 | Hero | Centré, plein écran, orbes blur | Radial gradient + dot pattern |
| 2 | Problèmes | Liste verticale pleine largeur | Blanc neutre (`background`) |
| 3 | Ce que nous livrons | Grille 2×2, cards glassmorphées | Gradient symétrique `background → lumina-50` |
| 4 | Méthodologie | 4 colonnes, numéros ghost géants | Gradient symétrique `background → lumina-50` |
| 5 | Pourquoi Lumina | 2 colonnes asymétriques, heading sticky | Blanc neutre (`background`) |
| 6 | Témoignages | Masqué | — |
| 7 | CTA Final | Centré, minimal | Gradient symétrique `background → lumina-50` |

Alternance fonds : blanc → gradient → gradient → blanc → gradient. Les deux sections sur gradient (Expertise/Méthodologie) ont des layouts très différents (cards 2×2 vs colonnes timeline).

---

## Section 1 — Hero

**Slice** : `rich_text` (existante, aucun changement de modèle)

### Contenu Prismic

| Champ | Contenu |
|---|---|
| Badge | `Sites e-commerce sur mesure` |
| Title First Line (h1) | `Votre marque mérite` |
| Title Second Line (h2) | `un site à sa hauteur` |
| Text | `Vous avez construit une marque forte. Mais votre site ne le montre pas. Nous créons des sites e-commerce sur mesure, rapides et fiables — avec un accompagnement qui dure.` |
| CTA 1 (Solid) | `Discutons de votre projet` → `/contact` |
| CTA 2 (Outlined) | `Découvrir notre approche` → `#methodologie` |

### Changement composant
Aucun.

---

## Section 2 — Problèmes

**Slice** : `problemes` (NOUVELLE)

### Modèle Prismic

| Champ | Type | Notes |
|---|---|---|
| `label` | Text | Eyebrow |
| `heading` | StructuredText | `single: heading2` |
| `items` | Group (repeat) | 3 blocs |
| → `icon` | Select | Options : `eye_off`, `clock`, `shield_off` |
| → `title` | Text | Titre du problème |
| → `description` | StructuredText | `multi: paragraph` |

### Layout

Liste verticale pleine largeur. Chaque item est une rangée horizontale :
- Numéro ghost (`01`, `02`, `03`) à gauche, grande typo `lumina-200`
- Titre + description à droite
- Séparateur hairline (`h-px bg-lumina-100`) entre chaque item et en haut/bas
- Fond : blanc neutre (`background`), pas de gradient

Responsive : sur mobile, numéro au-dessus du contenu (colonne unique).

### Composant — icon map

```ts
const ICON_MAP: Record<string, string> = {
  eye_off: "i-lucide-eye-off",
  clock: "i-lucide-clock",
  shield_off: "i-lucide-shield-off",
};
```

### Contenu Prismic

**Label** : `Le constat`
**Heading** : `Ce qui freine votre marque aujourd'hui`

**Item 1** :
- Icon : `eye_off`
- Title : `Votre site ne reflète pas votre marque`
- Description : `Vous avez investi dans un produit et un branding forts. Mais en ligne, votre site ressemble à celui de vos concurrents. Vos visiteurs ne perçoivent pas ce qui vous rend unique — et ils partent.`

**Item 2** :
- Icon : `clock`
- Title : `Votre site ralentit votre croissance`
- Description : `Le catalogue grossit, les pages mettent du temps à charger, les lancements produit sont stressants. Chaque seconde de lenteur vous coûte des visiteurs, des ventes et des clients qui ne reviendront pas.`

**Item 3** :
- Icon : `shield_off`
- Title : `Aucun filet de sécurité technique`
- Description : `Votre prestataire a livré et a disparu. Personne ne surveille votre site. Si quelque chose casse pendant un lancement ou une campagne pub, vous êtes seul face au problème.`

---

## Section 3 — Ce que nous livrons

**Slice** : `expertise` (existante)

### Changements modèle Prismic

Aucun — le modèle supporte déjà N items via le Group repeat. On ajoute de nouvelles options au Select `icon` : `gem`, `zap`, `shield_check`, `handshake`.

### Changements composant

- Grille : `md:grid-cols-3` → `grid-cols-1 md:grid-cols-2`
- Style des items : remplacer les colonnes avec bordures verticales par des cards glassmorphées (`bg-white/70 backdrop-blur-md border border-white/60 shadow-sm rounded-2xl p-8`)
- Retirer les numéros ghost (pas pertinent pour des cards)
- Icônes : agrandir légèrement, centrées au-dessus du titre
- Fond section : gradient symétrique (inchangé)

### Composant — icon map mis à jour

```ts
const ICON_MAP: Record<string, string> = {
  pen_tool: "i-lucide-pen-tool",
  terminal: "i-lucide-terminal",
  rocket: "i-lucide-rocket",
  bar_chart: "i-lucide-bar-chart-2",
  users: "i-lucide-users",
  lightbulb: "i-lucide-lightbulb",
  target: "i-lucide-target",
  gem: "i-lucide-gem",
  zap: "i-lucide-zap",
  shield_check: "i-lucide-shield-check",
  handshake: "i-lucide-handshake",
};
```

### Contenu Prismic

**Label** : `Ce que nous livrons`
**Heading** : `Des résultats concrets, pas des promesses`
**Description** : `Chaque projet est conçu pour servir votre marque, accélérer vos ventes et vous donner l'esprit tranquille.`

**Item 1** :
- Icon : `gem`
- Title : `Un site qui incarne votre marque`
- Description : `Fini les templates génériques. Votre site est conçu sur mesure pour refléter l'identité, les codes et la qualité de votre marque. Vos visiteurs le ressentent dès la première seconde.`

**Item 2** :
- Icon : `zap`
- Title : `Une vitesse qui convertit`
- Description : `Un site rapide, c'est un site qui vend. Vos pages se chargent rapidement, vos visiteurs restent plus longtemps et passent à l'achat sans friction.`

**Item 3** :
- Icon : `shield_check`
- Title : `Une fiabilité à toute épreuve`
- Description : `Votre site est surveillé en permanence. Les mises à jour sont testées avant d'être en ligne. Lancements, Black Friday, campagnes pub — votre site tient la charge.`

**Item 4** :
- Icon : `handshake`
- Title : `Un partenaire, pas un prestataire`
- Description : `Un rapport de performance mensuel, un support réactif, des conseils proactifs. L'accompagnement ne s'arrête pas après la mise en ligne — il commence.`

---

## Section 4 — Méthodologie

**Slice** : `methodologie` (existante)

### Changements modèle Prismic
Aucun.

### Changements composant
Aucun — le layout 4 colonnes avec numéros ghost reste tel quel.

### Contenu Prismic

**Label** : `Notre approche`
**Heading** : `Du premier échange à la mise en ligne — et au-delà`

**Item 1** :
- Icon : `message_circle`
- Title : `Immersion`
- Description : `On plonge dans votre marque, votre marché, vos clients et vos objectifs. On identifie ce qui vous différencie et ce que votre site doit transmettre.`

**Item 2** :
- Icon : `pen_tool`
- Title : `Conception`
- Description : `Les maquettes sont créées ensemble, écran par écran. Rien n'avance sans votre validation. Vous voyez votre site prendre forme avant même la première ligne de code.`

**Item 3** :
- Icon : `gem`
- Title : `Construction`
- Description : `Votre site prend vie, optimisé pour la vitesse et la conversion. Chaque détail est testé et affiné pour offrir la meilleure expérience à vos clients.`

**Item 4** :
- Icon : `rocket`
- Title : `Lancement & suivi`
- Description : `Mise en ligne, surveillance active, rapport de performance mensuel. L'accompagnement continue pour que votre site évolue avec votre marque.`

---

## Section 5 — Pourquoi Lumina

**Slice** : `pourquoi_lumina` (NOUVELLE)

### Modèle Prismic

| Champ | Type | Notes |
|---|---|---|
| `label` | Text | Eyebrow |
| `heading` | StructuredText | `single: heading2` |
| `items` | Group (repeat) | 4 blocs |
| → `icon` | Select | Options : `user_check`, `activity`, `flask_conical`, `trending_up` |
| → `title` | Text | Titre de l'argument |
| → `description` | StructuredText | `multi: paragraph` |

### Layout

2 colonnes asymétriques (`md:grid-cols-[2fr_3fr]`) :
- **Colonne gauche** : label eyebrow + heading display (Lora italic). Sticky sur desktop (`md:sticky md:top-24`).
- **Colonne droite** : 4 arguments empilés verticalement, chacun avec icône + titre + description. Séparateur hairline entre chaque item.
- Fond : blanc neutre (`background`), pas de gradient.

Responsive : sur mobile, heading en haut (pas sticky), items en dessous.

### Composant — icon map

```ts
const ICON_MAP: Record<string, string> = {
  user_check: "i-lucide-user-check",
  activity: "i-lucide-activity",
  flask_conical: "i-lucide-flask-conical",
  trending_up: "i-lucide-trending-up",
};
```

### Contenu Prismic

**Label** : `Pourquoi Lumina`
**Heading** : `Ce qui change quand on travaille ensemble`

**Item 1** :
- Icon : `user_check`
- Title : `Vous travaillez avec celui qui construit`
- Description : `Pas d'intermédiaire, pas de chef de projet entre vous et la personne qui conçoit votre site. Chaque décision est prise ensemble, sans déperdition.`

**Item 2** :
- Icon : `activity`
- Title : `Votre site est surveillé, pas abandonné`
- Description : `Surveillance continue, alertes en temps réel, corrections proactives. Les problèmes sont détectés et réglés avant que vos clients ne s'en rendent compte.`

**Item 3** :
- Icon : `flask_conical`
- Title : `Chaque mise à jour est testée avant d'être en ligne`
- Description : `Vos modifications passent par un environnement de test séparé. Zéro risque de casser votre site en production — même pendant un lancement.`

**Item 4** :
- Icon : `trending_up`
- Title : `Votre site tient la charge le jour J`
- Description : `Lancements produit, campagnes pub, Black Friday — votre site est construit pour absorber les pics de trafic sans ralentir ni tomber.`

---

## Section 6 — Témoignages

**Slice** : `temoignages` (existante)

Masquée : retirée du contenu de la page Home dans Prismic. Le composant, le modèle et les données restent intacts pour réactivation future. Aucun changement de code nécessaire.

---

## Section 7 — CTA Final

**Slice** : `cta_final` (NOUVELLE)

### Modèle Prismic

| Champ | Type | Notes |
|---|---|---|
| `heading` | StructuredText | `single: heading2` |
| `text` | StructuredText | `multi: paragraph` |
| `cta_link` | Link | `allowText: true` |

### Layout

Centré, minimal, sobre. Fond gradient symétrique `background → lumina-50 → background`.
- Accent line animée (scaleX) au-dessus
- Titre display : Lora italic, grande typo
- Sous-texte : DM Sans, `text-lumina-deep/70`
- Bouton : `bg-lumina-deep text-white rounded-full` (même style que CTA de la slice Atelier)

### Contenu Prismic

| Champ | Contenu |
|---|---|
| Heading | `Votre marque mérite un site qui lui ressemble` |
| Text | `Prenons 30 minutes pour en parler. Pas de pitch, pas de pression — juste un échange sur votre projet et vos objectifs.` |
| CTA Link | `Discutons de votre projet` → `/contact` |

---

## Footer

**Source** : Settings Prismic, champ `footer_primary_text`

### Contenu Prismic à coller

**Heading 3** : `Lumina Consulting`
**Paragraph** : `Sites e-commerce sur mesure pour marques en croissance. Conception, performance et accompagnement continu.`

### Changement composant
Aucun — le contenu vient déjà de Prismic via `PrismicRichText`.

---

## Page Contact

**Fichier** : `app/pages/contact.vue`

Textes en dur à modifier :

| Élément | Nouveau contenu |
|---|---|
| SEO title | `Contact — Lumina Consulting · Sites e-commerce sur mesure` |
| SEO description | `Réservez un appel découverte de 30 minutes pour discuter de votre site e-commerce. Gratuit et sans engagement.` |
| Headline (h1) | `Parlons de votre site e-commerce.` |
| Description | `Partagez votre vision, vos enjeux, vos ambitions. En 30 minutes, nous posons ensemble les bases de votre futur site.` |

Le reste (eyebrow, form labels, attrs, CTA, messages succès/erreur) reste inchangé.

---

## Navigation

### Settings Prismic — navigation links

| Label | Lien |
|---|---|
| Le constat | `#problemes` |
| Nos résultats | `#expertises` |
| Notre approche | `#methodologie` |
| Pourquoi Lumina | `#pourquoi-lumina` |

### Settings Prismic — navigation CTA
- Label : `Discutons`
- Lien : `/contact`

### Changement composant — `index.vue`

```ts
useActiveSections(["problemes", "expertises", "methodologie", "pourquoi-lumina"], "footer-sentinel");
```

---

## SEO — Page Home (Prismic)

| Champ | Contenu |
|---|---|
| Meta Title | `Lumina Consulting · Sites e-commerce sur mesure pour marques en croissance` |
| Meta Description | `Votre marque mérite mieux qu'un template. Lumina conçoit des sites e-commerce sur mesure, rapides et fiables, avec un accompagnement continu. Parlons de votre projet.` |

---

## Contenu à supprimer

- Toute référence à : mariages, associations, événementiel, startups (dans Prismic)
- La slice Réalisations retirée du SliceZone de la page Home (dans `customtypes/page/index.json` et dans l'éditeur Prismic)
- "Du rêve au pixel", "Artisan du numérique" (dans le contenu Prismic Settings footer)
- Toute mention de technologies ou stack technique
- Toute mention de prix ou de tarifs

---

## Fichiers impactés

### Nouveaux fichiers
- `app/slices/Problemes/index.vue` — composant
- `app/slices/Problemes/model.json` — modèle Prismic
- `app/slices/PourquoiLumina/index.vue` — composant
- `app/slices/PourquoiLumina/model.json` — modèle Prismic
- `app/slices/CtaFinal/index.vue` — composant
- `app/slices/CtaFinal/model.json` — modèle Prismic

### Fichiers modifiés
- `app/slices/index.ts` — ajouter les 3 nouvelles slices
- `app/slices/Expertise/index.vue` — grille 2×2, cards glassmorphées, icon map étendu
- `app/slices/Expertise/model.json` — nouvelles options d'icônes dans le Select
- `app/pages/index.vue` — `useActiveSections` mis à jour
- `app/pages/contact.vue` — textes SEO + contenu mis à jour
- `customtypes/page/index.json` — ajouter les 3 nouvelles slices au SliceZone

### Fichiers inchangés (conservés pour réactivation)
- `app/slices/Realisations/` — composant + modèle intacts. L'import dans `slices/index.ts` reste en place pour que le composant soit disponible si la slice est réactivée.
- `app/slices/Temoignages/` — composant + modèle intacts. Même logique : import conservé dans `slices/index.ts`.

### Contenu Prismic à mettre à jour manuellement
- Page Home : Hero (badge, titres, texte, CTAs), SEO meta
- Page Home : retirer Realisations et Temoignages du contenu, ajouter Problemes + PourquoiLumina + CtaFinal
- Expertise : nouveau label, heading, description, 4 items
- Methodologie : nouveau label, heading, 4 items
- Settings : navigation links, navigation CTA, footer_primary_text
