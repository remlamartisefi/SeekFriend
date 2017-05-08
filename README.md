# SeekFriend
Projet appli mobile UE info SeekFriend

## Description 

## View www/templates
- addFriendModal
  - Description : Confirm the new friendship
- addLocation
  - Description : Modal where you can choose to ad your location or a previous location
- enableGeoloc
  - Description : Modal that ask you to enable your GPS
- login
  - Description : Login Form
- logout
  - Description : Confirm to logout
- map
  - Description : Map view container
- menu
  - Description : Menu View where is userlist view or profil view, search bar and ionic refresher
- popoverMenu
  - Description : Popover where options are displayed like a button to settings
- previousLocation
  - Description : Form to add a previous location to your database
- register
  - Description : Register a new user Form
- removeFriendModal
  - Description : Confirm the end of the friendship
- removeInfoModal
  - Description : Confirm the removal of this location to your history
- set-server-url
  - Description : Popover use to change the server url
- settings
  - Description : Settings view where you can change your password
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
- Map View Methods using Cordova Geolocalisation and google map API
- Refresh Location every 5 second
- Userlist and Profil View methods with search methods
- showLocation to show a marker
- toggle and filter methods for the userlist and profillist sidebar view
- refreshMenuData refresh all the data in the sidebar every 10 seconds
- addLocation or previousLocation
- settings view
- delete info
- delete and add friend
