# Just_Stream_It

Cette page HTML présente des données cinématographiques issues d'une API.

## Installation et lancement de l'API

### Installation

Étape à effectuer une seule fois :

```bash
$ git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git
$ cd OCMovies-API-EN-FR
$ python3 -m venv env (Sous Windows => python -m venv env)
$ source env/bin/activate (Sous Windows => env\Scripts\activate)
$ pip install -r requirements.txt
$ python manage.py create_db
```

### Lancement

Étape à répéter à chaque utilisation

```bash
$ python manage.py runserver
```

## Usage

Lancez le fichier JustStreamit.html avec votre navigateur.
En tête d'affiche se trouve le film le mieux noté toutes catégories confondues, ensuite un classement des septs films les mieux notés toutes catégories confondues puis, pour finir, le même classement s'opère pour les catégories Action, Comédie et Romance.