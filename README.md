# Task App

![Main screen](/screen/img-inicio.jpg)


[[**PRUEBALO AHORA**](https://david-gentili-task-app.herokuapp.com/)]


## Hi :wave:, I made a task application in Javascript

Una aplicacion de tareas con la capacidad de registrar usuarios, cada usuario puede crear sus proyectos y cada proyecto puede almacenar tareas.

La idea del proyecto era implementar javascript puro, de ambos lados del servidor, tanto backend como frontend

### :large_blue_circle: Backend 
Se implemento un servidor capaz de servir las paginas estaticas requeridas al servidor, como asi tambien, las imagenes, los estilos, y los documentos .js que le darian la interaccion al sitio.

Asi tambien, se implemento una API la cual almacenaba la logica del sistema, administraba el acceso de los usuarios, posibilitaba los CRUD's de los proyectos y sus respectivas tareas.

Para persistir los datos se implemento el sistema de base de datos MongoDB.

### :large_blue_circle: Frontend
Se implementaron paginas estaticas HTML con los componentes contenedores y la informacion estatica, y se utilizo Javascrip para completar con la informacion dinamica del sitio, ademas se diseñaron efectos de carga, y se diseño un sistema de mensajes para errores, se persistio en localstorage los tokens de los usuarios.

En cuanto a las peticiones HTTP, una parte del sistema implementa la funcionalidad nativa del navegador Fetch, con la intencion de probar su utilidad, y otra parte del sistema utiliza peticiones con el paquete AXIOS mediante una CDN.

### :large_blue_circle: Images

###### Login screen
![Login screen](/screen/img-login.jpg)

###### Main-Panel screen
![Main-Panel screen](/screen/img-panel.jpg)

###### Project screen
![Project screen](/screen/img-project.jpg)



###### se utilizaron las siguiente dependecias:
[bcryptjs](https://www.npmjs.com/package/bcryptjs)

[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

[mongoose](https://www.npmjs.com/package/mongoose)
