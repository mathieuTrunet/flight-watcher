Installation :
necessite : docker, node

-> creer un compte opensky -> https://opensky-network.org/login?view=registration
-> ajouter un fichier .env a la racine du projet avec le contenu du fichier .env.schema
-> dans les variables OPENSKY_ACCOUNT_USERNAME et OPENSKY_ACCOUNT_PASSWORD, ajoutez respectivement votre identifiant et mot de passe opensky
-> dans le dossier frontend, installez les dependences avec un manageur de paquet 
  -> ideallement Bun : https://bun.sh/ avec `bun i`
  -> sinon node avec npm ou pnpm `npm i` `pnpm  i`
-> dans un shell, utilisez la commande `docker-compose up --build` ou `docker compose up --build` (depend de votre version/os)
-> quand le build est termine, le front sera accesible en local sur le port 3000, l'endpoint du worker sur le port 5000/worker


Je comnpleterai la suite de la doc plus tard car la je n'ai vraiment pas le temps :)
