import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request){

    const token = request.cookies.get("auth_token")?.value
    if(!token){
        return NextResponse.json({user:null})
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const client = await clientPromise
    const db = client.db("taskManager")
    const collection = db.collection("users")

    const user = await collection.findOne({_id:new ObjectId(decoded.id)}, {projection:{password:0}})
    return NextResponse.json({user})

}