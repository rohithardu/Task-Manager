import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken"

function getUserById(request) {
    try {
        const cookie = request.cookies.get("auth_token")
        // console.log("All cookies:", request.cookies.getAll())
        // console.log("auth_token cookie:", cookie)
        const token = cookie?.value
        // console.log(token)
        if (!token) return null
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        return decoded.id
    }
    catch (error) {
        console.error("Verification failed", error)
        return null
    }
}

export async function GET(request) {

    const userId = await getUserById(request)
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const client = await clientPromise
    const db = client.db("taskManager")
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } })
    const collection = db.collection("tasks")
    const task = await collection.find({ userId: new ObjectId(userId) }).sort({important:-1, completed:1}).toArray()
    // console.log(task)
    return NextResponse.json({ user, task })
}

export async function POST(request) {

    const userId = await getUserById(request)
    // console.log("UserID:", userId)
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const body = await request.json()
    // console.log(body)
    const client = await clientPromise
    const db = client.db("taskManager")
    const collection = db.collection("tasks")

    const result = await collection.insertOne({
        userId: new ObjectId(userId),
        task: body.task,
        category: body.category,
        tags: body.tags,
        completed: false,
        important:false,
        deadline: body.deadline
    })
    return NextResponse.json({ task: { _id: result.insertedId, task: body.task,category: body.category,tags: body.tags, completed:false,important:false,deadline: body.deadline } })
}

export async function DELETE(request) {
    const userId = await getUserById(request)
    // console.log("UserID:", userId)
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const { id } = await request.json()
    const client = await clientPromise
    const db = client.db("taskManager")
    const collection = db.collection("tasks")
    const result = await collection.deleteOne({
        _id: new ObjectId(id),
        userId: new ObjectId(userId)
    })
    return NextResponse.json({ message: "deleted" })
}

export async function PATCH(request) {
    const userId = await getUserById(request)
    // console.log("UserID:", userId)
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const { id, task, category, tags, completed, important, deadline } = await request.json()
// console.log(deadline, category)
    const client = await clientPromise
    const db = client.db("taskManager")
    const collection = db.collection("tasks")
    const updates = {}
    if(task !== undefined) updates.task = task
    if(completed !== undefined) updates.completed = completed
    if(important !== undefined) updates.important = important
    if(category !== undefined) updates.category = category
    if(deadline !== undefined) updates.deadline = deadline
    if(tags !== undefined) updates.tags = tags
    const result = await collection.updateOne(
        {_id: new ObjectId(id),
        userId: new ObjectId(userId)},
        {$set: updates}
    )
    const updatedTask = await collection.findOne({
        _id: new ObjectId(id),
        userId: new ObjectId(userId)
    })
    return NextResponse.json({task : updatedTask })
}