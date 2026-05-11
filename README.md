# Template d'application web

## ✨ Démarrer le projet

⚠️ **Attention** : Il faut avoir configurer au préalable l'url de la base de données dans le(s) fichier(s) .env.\*

```bash
npm install
cp .env.example .env
cp .env.example .env.local
npx auth secret
npx prisma
npx prisma migrate dev
npx prisma db seed
npm run dev
```
