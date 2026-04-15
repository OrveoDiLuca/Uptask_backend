import server from "./server"
import colors from "colors"

const port = process.env.PORT || 4000 //Creacion del puerto y si no existe pues se crea el puerto 4000.

server.listen(port, () => {
    console.log(colors.cyan.bold(`REST API funcionando el puerto ${port}`))
})