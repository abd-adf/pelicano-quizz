// Builds the static site into dist/ for Netlify:
//   dist/index.html     → NL (default), copied as-is
//   dist/fr/index.html  → FR, same page with a French <head> so link previews (OG) are in French
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync } from "node:fs";

const src = readFileSync("index.html", "utf8");

const FR_TITLE = "Le test de réalité · Pelicano × Fondation Reine Paola";
const FR_OG_DESC = "Pensez-vous réellement connaître les conditions de vie de la jeunesse en Belgique ? Faites le test de réalité en 2 minutes.";
const FR_IMG_ALT = "Deux enfants souriants contre un arbre";

const frReplacements = [
  ['<html lang="nl">', '<html lang="fr">'],
  ['<title>De realiteitscheck · Pelicano × Stichting Koningin Paola</title>', `<title>${FR_TITLE}</title>`],
  ['<meta name="description" content="Doe de realiteitscheck over kinderarmoede in België. 5 vragen, 2 minuten.">',
   '<meta name="description" content="Faites le test de réalité sur la pauvreté infantile en Belgique. 5 questions, 2 minutes.">'],
  ['<link rel="canonical" href="https://quiz.pelicano.be/">', '<link rel="canonical" href="https://quiz.pelicano.be/fr/">'],
  ['<meta property="og:url" content="https://quiz.pelicano.be/">', '<meta property="og:url" content="https://quiz.pelicano.be/fr/">'],
  ['<meta property="og:locale" content="nl_BE">', '<meta property="og:locale" content="fr_BE">'],
  ['<meta property="og:locale:alternate" content="fr_BE">', '<meta property="og:locale:alternate" content="nl_BE">'],
  ['<meta property="og:title" content="De realiteitscheck · Pelicano × Stichting Koningin Paola">', `<meta property="og:title" content="${FR_TITLE}">`],
  ['<meta name="twitter:title" content="De realiteitscheck · Pelicano × Stichting Koningin Paola">', `<meta name="twitter:title" content="${FR_TITLE}">`],
  ['<meta property="og:description" content="Denk je dat je weet hoe het is om op te groeien in België? Doe de 2-minuten realiteitscheck.">',
   `<meta property="og:description" content="${FR_OG_DESC}">`],
  ['<meta name="twitter:description" content="Denk je dat je weet hoe het is om op te groeien in België? Doe de 2-minuten realiteitscheck.">',
   `<meta name="twitter:description" content="${FR_OG_DESC}">`],
  ['<meta property="og:image:alt" content="Twee lachende kinderen tegen een boom">', `<meta property="og:image:alt" content="${FR_IMG_ALT}">`],
  ['<meta name="twitter:image:alt" content="Twee lachende kinderen tegen een boom">', `<meta name="twitter:image:alt" content="${FR_IMG_ALT}">`],
];

let fr = src;
for (const [from, to] of frReplacements) {
  const count = fr.split(from).length - 1;
  if (count !== 1) throw new Error(`build: expected exactly 1 match, found ${count}: ${from}`);
  fr = fr.replace(from, to);
}

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/fr", { recursive: true });
writeFileSync("dist/index.html", src);
writeFileSync("dist/fr/index.html", fr);
copyFileSync("favicon.ico", "dist/favicon.ico");
console.log("build: dist/index.html (NL) + dist/fr/index.html (FR)");
