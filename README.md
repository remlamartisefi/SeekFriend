# SeekFriend
Projet appli mobile UE info SeekFriend. 

## Description 
SeekFriend est une application de géolocalisation. Elle permet de se repérer sur une carte, de s'enregistrer, et de s'identifier. Une fois identifié, il est possible d'ajouter des amis pour voir leur position et l'historique de leur position. Il est possible d'ajouter une coordonnée automatiquement ou manuellement. Il est aussi possible de voir les utilisateurs en ligne et hors ligne. Possibilité de modifier son mot de passe.



## View www/templates
- addFriendModal
  - Description : Confirm a new friendship
- addLocation
  - Description : Modal where you can choose to add your location or a previous/futur location
- enableGeoloc
  - Description : Modal which ask you to enable your GPS
- login
  - Description : Login Form
- logout
  - Description : Confirm to logout
- map
  - Description : Map view container
- menu
  - Description : Menu View where there is the userlist view or profil view, search bar and ionic refresher
- popoverMenu
  - Description : Popover where options are displayed like a button to settings or login/logout
- previousLocation
  - Description : Form to add a previous/futur location to your database
- register
  - Description : Register a new user Form
- removeFriendModal
  - Description : Confirm the end of the friendship
- removeInfoModal
  - Description : Confirm the removal of this location to your history
- set-server-url
  - Description : Popover use to change the server url
- settings
  - Description : Settings view where you can change your password for example
- sync
  - Description : Ion spinner view
  
## Controller

### AppCtrl
- Init Storage
- Ionic Modal and Popover déclarations

### SignCtrl
- doLogin
- doLogout
- doRegister
- doChangePassword
- updateRemember

### MapCtrl
- Init Map

### SettingsCtrl
- Settings List

### MenuCtrl
- Map View Methods using Cordova Geolocalisation and google maps API
- Refresh Location every 5 seconds
- Userlist and Profil View methods with search methods
- showLocation to show a marker
- toggle and filter methods for the userlist and profillist sidebar view
- refreshMenuData refresh all the data in the sidebar every 10 seconds
- addLocation or previousLocation
- settings view
- delete info
- delete and add friend
