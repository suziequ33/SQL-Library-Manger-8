# SQL-Library-Manger-8
 Using SQL database to implement a dynamic website using JavaScript, Node.js, Epress, Pug SQLite and SQL ORM Sequelize.

 //I followed the example project for the outline for this project-file example. 
 Using Sequelize ORM with Express notes walked through the first parts of the project
 I had trouble with the html example files and converting them to pug files.
 Until I looked closer at the project-files and needed to extend out from the layout. 
 I did not read way at the bottom of the Getting Started page about the library.db file being the database. 
Oh I kept getting errors with the pug file. / They are very case-sensitive. I like to add a line at the end. They do not like it. 
I also deleted the first book The Hunger Games. So I added a few of my favorite books. 
used Code Beautify/CSS Portal to convert HTML to Pug.
*Peer-review by Travis Alstrand. Needed to fix: when updating the book, if the title or author are missing throw error. When I changed that update didnt redirect to home page. So fixed that. 
Travie also said when non-existent book ID is routed my global error handler to render a friendly 'Page Not Found' page. 
He said it was due to the usage of res.sendStatus(404). He said to create a new Error, Giving it a status and message and passing it using next(). So I did this.  