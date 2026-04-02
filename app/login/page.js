"use client"
import React from 'react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'


const login = () => {
    const [form, setform] = useState({number:"", password:""})
    const router = useRouter()

    const handleChange = (e) => {
    setform({...form, [e.target.name]: e.target.value}) 
  }

  const submit = async() => {
    if(form.number==="" || form.password === ""){
      alert("Please fill all fields")
      return
    }
   const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
// myHeaders.append("Cookie", "auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YjM5MTg1YjI1MGE4YmFlMWFmYzY5OSIsImlhdCI6MTc3MzM3NjAzMiwiZXhwIjoxNzczOTgwODMyfQ.q_0icG3XhtW8GLeo1SpYsdoOGc-mLUkiO069YGGxSA8");

const raw = JSON.stringify({
  "number": form.number,
  "password": form.password
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

const res = await fetch("/api/auth/login", requestOptions)
const data = await res.json()
  // .then((response) => response.text())
  // .then((result) => console.log(result))
  // .catch((error) => console.error(error));

  // const result = await res.json()
  if(!res.ok){
    alert(data.message)
    return
  }
  router.push("/dashboard")

  setform({number:"", password:""})
  }
  
  return (<>
  <div className='bg-gray-100 min-h-screen flex justify-center items-center'>
    <div className='bg-white h-[70vh] w-[90vw] md:w-[50vw] shadow-lg flex flex-col justify-center items-center gap-5'>
        <input type="number" onChange={handleChange} value={form.number} name='number' id='number' className='bg-gray-100 px-4 py-1 rounded-lg w-[80%] sm:w-2/3 md:w-1/2 h-10 outline' placeholder='Enter your number' />
        <input type="text" onChange={handleChange} value={form.password} name='password' id='password' className='bg-gray-100 px-4 py-1 rounded-lg w-[80%] sm:w-2/3 md:w-1/2 h-10 outline' placeholder='Enter your password' />
        <button onClick={submit} className="px-8 py-2 bg-green-400 rounded-full cursor-pointer font-semibold">Login</button>
        <Link href={"/signup"}><div className='text-blue-400 cursor-pointer my-5'>New User? Signup</div></Link>
    </div>
  </div>
  </>
  )
}

export default login
