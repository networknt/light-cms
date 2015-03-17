com-networknt-light-c-menu

Steps for integrating into light framework:

1. add menu.js to scripts/controllers/menu.js
2. add menuDirectives.js to scripts/directives/menuDirectives.js
3. include menu.css in the styles folder.
4. within index.html add the following:
    a) <script src="scripts/controllers/menu.js"></script>
    b) <script src="scripts/directives/menuDirectives.js"></script>
    c) <link rel="stylesheet" href="styles/menu.css">
5. where the menu should be added, insert the following (edit host as desired):
    a) <menu host="example"></menu>
