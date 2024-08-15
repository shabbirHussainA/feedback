//custom function to connect with the dB
import mongoose from "mongoose";

type connectionObject = {
    isConnected?:number
}
// connected is empty by default
const connected:connectionObject = {}

async function dbConnect():Promise<void> {
    // if the db is already connected than return
    if(connected.isConnected){
        console.log("database already connected")
        return
    }
    // to connect db 
    try {
        console.log(`${process.env.MONGODB_URI}`)
        const db = await mongoose.connect(process.env.MONGODB_URI || "");
        // console.log("this is the DB"+ db)
        connected.isConnected =  db.connections[0].readyState
        console.log("DB connected succesfully")
    } catch (error:any) {
        console.log("failed to connect database"+ error.message)
        process.exit(1)
    }
}
export default dbConnect