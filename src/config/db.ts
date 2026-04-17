import mongoose, { mongo } from 'mongoose'
import colors from 'colors'
import { exit } from 'node:process'


export const connectDB = async() => {
    try {
        const {connection} = await mongoose.connect(process.env.DATABASE_URL)
        const url = `${connection.host}: ${connection.port}`
        console.log(colors.bgGreen(`MongoDB Connected in : ${url}`))
    } catch (error) {
        console.log(colors.bgRed('Error en conexión de la base de datos.'))
        exit(1)
    }
}