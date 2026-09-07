# CARPZONE v6 — compte + sauvegarde cloud

## À faire une seule fois dans Supabase
1. Ouvrir votre projet Supabase.
2. Aller dans **SQL Editor**.
3. Cliquer sur **New query**.
4. Copier tout le contenu de `SUPABASE_SETUP.sql`.
5. Cliquer sur **Run**.

## Comptes
Dans CARPZONE > Profil :
- Créer un compte
- Se connecter
- Synchroniser
- Se déconnecter
- Mot de passe oublié

## Conservation des anciennes données
Les données locales ne sont pas supprimées.
Lors de la première connexion à un compte qui n'a encore aucune sauvegarde cloud,
CARPZONE envoie automatiquement les données déjà présentes sur l'appareil dans le compte.

Si le compte possède déjà des données cloud, celles-ci sont chargées sur l'appareil.

## Sécurité
La table utilise Row Level Security (RLS).
Chaque utilisateur ne peut lire/modifier que sa propre ligne.

## Important sur les photos
Les photos actuelles sont stockées dans les données de CARPZONE sous forme compressée.
Cela fonctionne pour un nombre raisonnable de photos, mais une future version pourra
utiliser Supabase Storage pour une photothèque plus importante.
