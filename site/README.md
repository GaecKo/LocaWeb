## Guide d'installation / d'usage

****

#### Installer et lancer le projet

1) Afin de lancer le projet, placez vous d'abord dans `site/` (endroit où se trouve ce fichier), afin d'être dans le dossier où se trouve `index.js` etc. 
2) Lancez-y un terminal, et faites cette commande: `npm i`. Cela installeras tous les packages requis au projet. 
3) Une fois terminé, vous pouvez lancer le site avec `node .` ou `node index.js`, en vous assurant bien d'être toujours dans le dossier `site/`
4) Accéder à l'adresse indiquée dans la terminal et vous serez alors sur le site. 

##### Utilisation / Connexion
PS: Nous avons muni la databse de quelques users / annonces afin que vous ayez une utilisation optimale du site. Afin de voir les annonces de manière normale, vous pouvez utiliser le compte: Username: `GaecKo`, Password: `Coco1212!`. Si vous souhaitez être un modérateur afin de voir les reports, connectez vous sous: `modo`, password: `aaaaaaaa`. Si vous souhaitez avoir un compte banni, utilisé `BadUser`, password: `aaaaaaaa`. En tant que modo, vous pourrez aller voir les reports. Vous pourrez aussi remarquer que les commentaires / ads signalés + de 3 fois sont floutées. 


#### Lancer les tests
⚠️ En lançant les tests, le contenu de la db sera complêtement perdu. Attention à donc éffectuer une copie avantsi nécessaire. 

Afin de lancer les tests, placez vous à nouveau dans `site/` et faites cette commande: `npm test -- --coverage`. Vous verrez ensuite les tests se faire. 

Vous pouvez aussi accéder à `site/coverage/lcov-report/index.html` pour avoir plus de détails. Ces résultats sont déjà à jour avec la dernière version du projet et donc représentatif de l'était actuel. 

PS: Nous n'avons pas atteind 100% de coverage simplement car certains `.catch(err => {...})` sont très difficile à atteindre. En effet sequelize s'occupe déjà de gérer beaucoup de cas, nous avons donc eu du mal à accéder à ces lignes de code. 