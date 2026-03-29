import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export async function POST(request) {

    const body = await request.json()
    const client = await clientPromise;
    const db = client.db("taskManager")
    const collection = db.collection("users")

    // Find if the number already exists
    const find = await collection.findOne({number:body.number})
    if(find){
        return NextResponse.json({success:"false", error:"true", message:"User already exists"},{status:400})
    }

    const hashedPassword = await bcrypt.hash(body.password,10)
    // console.log(body)
    const result = await collection.insertOne({
        name: body.name,
        number: body.number,
        password: hashedPassword
   })

   const token = jwt.sign(
    {id:result.insertedId.toString()},
    process.env.JWT_SECRET,
    {expiresIn:"7d"}
   )
   const response = NextResponse.json({ success: "true", error: "false", message: "user created" })
   response.cookies.set({
        name: "auth_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    })
    console.log(result)

    return response
}