import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export async function POST(request) {

    const body = await request.json()
    const client = await clientPromise;
    const db = client.db("taskManager")
    const collection = db.collection("users")

    const user = await collection.findOne({ number: body.number })
    if (!user) {
        return NextResponse.json({ success: "false", error: "true", message: "user not found!" },{status:401})
    }

    const isMatched = await bcrypt.compare(body.password, user.password)
    if (!isMatched) {
        return NextResponse.json({ success: "false", error: "true", message: "invalid credentials" },{status:401})
    }

    const token = jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    )

    const response = NextResponse.json({ success: "true", error: "false", message: "logged in" })

    response.cookies.set({
        name: "auth_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    })

    return response
}