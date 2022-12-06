Fonctionnalité: S'identifier au site

Scénario: Le client possède un compte
    Étant donné que le client possède un compte
    Et qu'il est sur la page d'accueil
    Alors il clique sur "Sign Up / Login"
    Étant donné que le client est sur la page Login
    Alors il indique ses identifiants
    Et clique sur Login
    Et est redirigé vers la page des annonces
    Et est connecté

Scénario: Le client ne possède pas de compte
    Étant donné que le client ne possède pas de compte
    Et qu'il est sur la page d'accueil
    Alors il clique sur "Sign Up / Login"
    Étant donné que le client est sur la page Login
    Et qu'il n'a pas de compte
    Alors il clique sur "Sign-Up Here"
    Étant donné qu'il est sur la page de création de compte
    Alors il indique ses identifiants
    Et il clique sur "Create account"
    Et est redirigé vers la page des annonces
    Et est connecté