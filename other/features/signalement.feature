Fonctionnalité: Signaler une annonce / commentaire
    
Scénario: Le client veut signaler une annonce
    Étant donné que le client est sur une annonce
    Alors il clique sur "Bouton représentant un drapeau"
    Et il peut ajouter une raison du signalement
    Et puis cliquer sur le bouton pour envoyer
    Et l'annonce a été signalée et sera traitée

Scénario: Le client veut signaler un commentaire
    Étant donné que le client est sur une annonce
    Et qu'il descend vers la section des commentaires
    Alors il clique sur le bouton du commentaire "Bouton représentant un drapeau" en passant avec la souris au-dessus de celui-ci
    Et il ajoute une raison du signalement
    Et il clique sur le bouton "Report"
    Et le commentaire a été signalé et sera traité

Scénario: Un modérateur traite les signalements
    Étant donné que l'utilisateur est modérateur
    Alors il peut aller sur une page spécifique afin de traiter les signalements
    Etant donné que celui-ci est sur la page de signalement
    Alors il voit les commentaires et les annonces signalées
    Et les raisons de ces signalements
    Et il peut supprimer ou rétablir les commentaires / annonces
    Et ces éléments auront été traités.