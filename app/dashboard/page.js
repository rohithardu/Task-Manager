"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import { Bounce } from 'react-toastify';


const dashboard = () => {
  const router = useRouter()
  const [form, setform] = useState({ input: "", category: "", tags: "", deadline: "" })
  const [user, setuser] = useState(null)
  const [taskArray, settaskArray] = useState([])
  const [editingId, seteditingId] = useState(null)
  const [pending, setpending] = useState(true)
  const [create, setcreate] = useState(false)
  const [allTaskArray, setallTaskArray] = useState([])
  const [search, setsearch] = useState("")
  const [c, setc] = useState("")



  useEffect(() => {
    const check = async () => {
      const res = await fetch("api/tasks", {
        credentials: "include"
      })
      if (!res.ok) {
        router.push("/login")
      }
      const data = await res.json()
      // console.log(data)
      settaskArray(data.task)
      setallTaskArray(data.task)
      setuser(data.user)
    }
    check()

  }, [router])


  const logout = async () => {
    const c = confirm("Are you sure you want to logout?")
    if (!c) return
    await fetch("api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  const parseTags = (tags) => {
    return tags.split(",").map(i => i.trim()).filter(i => i.length > 0)
  }

  const parseCategory = (category) => {
    return category.split(",").map(i => i.trim()).filter(i => i.length > 0)
  }


  const add = async () => {
    let updatedTaskArray
    if (editingId) {
      const tagsArray = form.tags ? parseTags(form.tags) : []
      const categoryArray = form.category ? parseCategory(form.category) : []
      // console.log(categoryArray)
      const res = await fetch("api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          task: form.input,
          category: categoryArray,
          tags: tagsArray,
          deadline: form.deadline
        })
      })
      if (!res.ok) {
        return
      }
      updatedTaskArray = taskArray.map(item =>
        item._id === editingId ? { ...item, task: form.input, category: categoryArray, tags: tagsArray, deadline: form.deadline } : item
      )
      settaskArray(updatedTaskArray)
      setallTaskArray(updatedTaskArray)
      seteditingId(null)
      setform({ input: "", category: "", tags: "", deadline: "" })
      setcreate(false)
      toast('Task Edited', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    else {
      const split = form.input.split("").slice(1).join("")
      const newInput = form.input.charAt(0).toUpperCase() + split
      const tagsArray = form.tags ? parseTags(form.tags) : []
      const categoryArray = form.category ? parseCategory(form.category) : []
      // console.log(categoryArray)
      const res = await fetch("api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: newInput, category: categoryArray, tags: tagsArray, deadline: form.deadline })
      })
      const data = await res.json()
      // console.log(data)
      updatedTaskArray = [...taskArray, data.task]
      // console.log(updatedTaskArray)
      // settaskArray((prev) => [...prev, data.task])

      settaskArray(updatedTaskArray)
      setallTaskArray(updatedTaskArray)
      seteditingId(null)
      setform({ input: "", category: "", tags: "", deadline: "" })
      setcreate(false)
      toast('Task Added', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }
  // console.log(taskArray)

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      add()
    }
  }

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value })
  }


  const deleteTask = async (id) => {
    const c = confirm("Do you want to delete the task?")
    if (!c) return
    const res = await fetch("api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
    settaskArray(taskArray.filter((item) => item._id !== id))
    setallTaskArray(taskArray.filter((item) => item._id !== id))
    toast('Task Deleted', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  const editTask = async (id) => {
    const item = taskArray.find((item) => item._id === id)
    // console.log(item)
    // settaskArray(taskArray.filter(item => item._id !== id))
    seteditingId(id)
    setform({ input: item.task, category: item.category ? item.category.join(",") : "", tags: item.tags ? item.tags.join(",") : "", deadline: item.deadline })
    setcreate(true)
  }

  const toggleCompleted = async (id) => {
    const task = taskArray.find(item => item._id === id)
    const comp = !task.completed
    const updated = taskArray.map(item =>
      item._id === id ? { ...item, completed: comp } : item
    ).sort((a, b) => a.completed - b.completed)
    settaskArray(updated)
    setallTaskArray(updated)
    const res = await fetch("api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: comp })
    })
    if(comp === true){
      toast(`Task completed`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    }else if(comp === false){
      toast(`Task incomplete`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    }
    
  }

  const starTask = async (id) => {
    const item = taskArray.find(item => item._id === id)
    if (!item) return
    const newImp = !item.important
    const updated = taskArray.map(item =>
      item._id === id ? { ...item, important: newImp } : item
    ).sort((a, b) => b.important - a.important)
    const res = await fetch("api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, important: newImp })
    })
    if (res.ok) {
      settaskArray(updated)
      setallTaskArray(updated)
      if(newImp === true){
      toast(`Task marked as important`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    }else if(newImp === false){
      toast(`Task marked as normal`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    }
    }
  }

  const pendingAllTags = taskArray.map(item => {
    return item.completed ? "" : item.tags
  })
  // console.log(pendingAllTags)
  const completedAllTags = taskArray.map(item => {
    return item.completed ? item.tags : ""
  })

  const pendingAllTagsArray = pendingAllTags.filter(item => item && item.length > 0)?.reduce((prev, curr) => prev.concat(curr), []).sort()
  // console.log(pendingAllTagsArray)
  const completedAllTagsArray = completedAllTags.filter(item => item && item.length > 0)?.reduce((prev, curr) => prev.concat(curr), []).sort()
  // console.log(completedAllTagsArray)
  const pendingShowTags = pendingAllTagsArray.reduce((arr, crr, i) => {
    if (i === 0 || crr !== pendingAllTagsArray[i - 1]) {
      arr.push({ crr, count: 1 })
    } else {
      arr[arr.length - 1].count++
    }
    return arr
  }, []).map(i => `${i.crr} ${i.count}`)

  const completedShowTags = completedAllTagsArray.reduce((arr, crr, i) => {
    if (i === 0 || crr !== completedAllTagsArray[i - 1]) {
      arr.push({ crr, count: 1 })
    } else {
      arr[arr.length - 1].count++
    }
    return arr
  }, []).map(i => `${i.crr} ${i.count}`)

  const allCategory = taskArray.map(item => {
    return item.category
  })
  // console.log(allCategory)

  const all = allCategory.reduce((prev, curr) => prev.concat(curr), []).sort().filter(item => item && item.length > 0)
  // console.log(all)

  const allCategoryArray = all.reduce((arr, crr, i) => {
    if (i === 0 || crr !== all[i - 1]) {
      arr.push({ crr, count: 1 })
    } else {
      arr[arr.length - 1].count++
    }
    return arr
  }, []).map(i => `${i.crr} ${i.count}`)
  // console.log(allCategoryArray)

  const find = (e) => {
    const text = e.target.value
    // console.log(text)
    setsearch(text)
    if (text === "") {
      settaskArray(allTaskArray)
      return
    } else {
      const searchedTaskArray = allTaskArray.filter((item) => {
        return item.task.toLowerCase().includes(text.toLowerCase())
      })
      settaskArray(searchedTaskArray)
    }
  }

  const allTaskClick = () => {
    setcreate(false);
    setsearch("")
    settaskArray(allTaskArray)
  }

  const searchByTag = (tag) => {
    const filtered = allTaskArray.filter(item => item.tags && item.tags.includes(tag))
    settaskArray(filtered)
    setsearch(`#${tag}`)
  }
  const searchByCategory = (category) => {
    const filtered = allTaskArray.filter(item => item.category && item.category.includes(category))
    settaskArray(filtered)
    setsearch(category)
  }




  return (<>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />
    <div className='flex items-center justify-between px-5 xl:px-20 max-w-full py-4 bg-green-400'>
      <h1>Welcome <span className='font-bold'>{user && user.name}</span></h1>
      <button onClick={logout} className="px-4 py-1 bg-slate-400 rounded-full cursor-pointer font-semibold">Logout</button>
    </div>
    <div className='flex max-w-full gap-2 bg-gray-100 min-h-[93vh]'>
      <div className="left w-[25%] md:w-[20%] flex flex-col gap-4 border-r-2 border-white py-4">
        <button onClick={() => setcreate(true)} className="px-1 sm:px-4 xl:px-7 py-2 bg-green-400 lg:w-2/3 2xl:w-1/2 mx-auto rounded-full cursor-pointer font-semibold text-sm sm:text-md">Create Task</button>
        <div className='w-full  text-lg border-t-2 border-gray-500'>
          <h2 onClick={() => allTaskClick()} className='font-semibold text-center hover:cursor-pointer hover:bg-white py-2 text-sm sm:text-md'>All tasks</h2>

          <div onClick={() => setcreate(false)} className='w-full text-sm sm:text-md md:text-lg border-y border-gray-500'>
            <h3 className='p-2'>Categories</h3>
            <div>
              {allCategoryArray && allCategoryArray.map((item, index) => {
                const category = item.split(" ")[0]
                // console.log(category)
                return <div key={index} onClick={(e) => {
                  e.stopPropagation()
                  searchByCategory(category)
                }} className='py-1 border-t border-gray-300  px-4 cursor-pointer hover:cursor-pointer hover:bg-white capitalize'>{item}</div>
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="right py-8 w-[75%] md:w-[80%]">
        <div className={`flex flex-col gap-5 items-center ${create ? "" : "hidden"}`}>
          <label htmlFor="category">Category</label>
          <input type="text" onChange={handleChange} onKeyDown={handleKeyDown} value={form.category} name='category' id='category' className='bg-white w-3/4 sm:w-1/2 md:w-1/3 px-4 py-1 rounded-lg h-10 outline' placeholder='Category (Work,Personal etc.)' />
          <label htmlFor="input">Input</label>
          <input type="text" onChange={handleChange} onKeyDown={handleKeyDown} value={form.input} name='input' id='input' className='bg-white w-3/4 sm:w-1/2 md:w-1/3 px-4 py-1 rounded-lg h-10 outline' placeholder='Create your task' />
          <label htmlFor="tags">Tags</label>
          <input type="text" onChange={handleChange} onKeyDown={handleKeyDown} value={form.tags} name='tags' id='tags' className='bg-white w-3/4 sm:w-1/2 md:w-1/3 px-4 py-1 rounded-lg h-10 outline' placeholder='Tags (optional)' />
          <label htmlFor="deadline">Deadline</label>
          <input type="date" onChange={handleChange} onKeyDown={handleKeyDown} value={form.deadline} name='deadline' id='deadline' className='bg-white w-3/4 sm:w-1/2 md:w-1/3 px-4 py-1 rounded-lg h-10 outline' placeholder='Deadline (optional)' />
          <button onClick={add} className="px-8 py-2 bg-green-400 rounded-full cursor-pointer font-semibold">Create</button>
        </div>
        <div className={`mx-auto flex flex-col gap-4 justify-start ${create ? "hidden" : ""}`}>
          <div className='flex items-center justify-between px-4'>
            <div className='flex gap-4 items-center'>
              <span onClick={() => setpending(true)} className={`${pending ? "bg-gray-400" : "bg-white"} text-sm sm:text-md px-3 py-2 rounded-full cursor-pointer`}>Pending</span>
              <span onClick={() => setpending(false)} className={`${pending ? "bg-white" : "bg-gray-400"} px-3 py-2 rounded-full cursor-pointer`}>Completed</span>
            </div>
            <div className='relative hidden sm:block'>
              <input type="text" placeholder='Search' name='search' id='search' value={search} onChange={find} className='bg-white px-3 py-1 rounded-full w-40 sm:w-58 outline' />
              <img src="search.svg" alt="search" width={15} height={15} className='absolute right-3 top-2' />
            </div>
          </div>
          <div className='relative sm:hidden justify-self-end'>
              <input type="text" placeholder='Search' name='search' id='search2' value={search} onChange={find} className='bg-white px-3 py-1 rounded-full w-40 sm:w-58 outline' />
              <img src="search.svg" alt="search" width={15} height={15} className='absolute left-34 top-2' />
            </div>
          <div className="tags flex flex-wrap gap-2 items-center">
            <div className={`pendingTags ${pending ? "" : "hidden"} flex flex-wrap gap-1`}>
              {pendingShowTags && pendingShowTags.map((item, index) => {
                const tag = item.split(" ")[0]
                // console.log(tag)
                return <span key={index} onClick={() => searchByTag(tag)} className='bg-white cursor-pointer rounded-full px-3 py-1 mx-1 whitespace-nowrap'>#{item}</span>
              })}
            </div>
            <div className={`completedTags ${pending ? "hidden" : ""} flex flex-wrap gap-1`}>
              {completedShowTags && completedShowTags.map((item, index) => {
                const tag = item.split(" ")[0]
                return <span key={index} onClick={() => searchByTag(tag)} className='bg-white cursor-pointer rounded-full px-3 py-1 mx-1 whitespace-nowrap'>#{item}</span>
              })}
            </div>            
          </div>
          <div>
            <div className={`${pending ? "" : "hidden"} flex flex-col gap-4 justify-center`}>
              {(taskArray.filter(item => !item.completed)).length === 0 && <div className='text-xl text-gray-600'>No pending tasks to show</div>}
              {taskArray && taskArray.map((item) => {
                return <div key={item._id} className={`flex items-center justify-between gap-1 sm:gap-3 text-lg rounded-lg px-3 bg-white ${item.completed ? "hidden" : ""}`}>
                  <div className='flex flex-col justify-center'>
                    <div className='flex items-center gap-2'>
                    <input type="checkbox" checked={item.completed} onChange={() => toggleCompleted(item._id)} />
                    <span className='break-all text-sm sm:text-md'>{item && item.task}</span>
                    </div>
                    <div className='text-xs sm:text-sm sm:hidden'>{item && item.deadline}</div>
                  </div>
                  <div className='flex gap-3 items-center'>
                    <span className='text-xs sm:text-sm hidden sm:block'>{item && item.deadline}</span>
                    <img src={`${item.important ? "filledstar.svg" : "emptystar.svg"}`} onClick={() => starTask(item._id)} alt="img" width={20} height={20} className='cursor-pointer' />
                    <img src="delete.svg" onClick={() => deleteTask(item._id)} alt="img" width={20} height={20} className='cursor-pointer' />
                    <img src="edit.svg" onClick={() => editTask(item._id)} alt="img" width={20} height={20} className='cursor-pointer' />
                  </div>
                </div>
              })}</div>
            <div className={`${pending ? "hidden" : ""} flex flex-col gap-4 justify-center`}>
              {(taskArray.filter(item => item.completed)).length === 0 && <div className='text-xl text-gray-600'>No completed tasks to show</div>}{taskArray && taskArray.map((item) => {
                return <div key={item._id} className={`flex items-center justify-between gap-3 text-lg rounded-lg px-3 bg-white ${item.completed ? "" : "hidden"}`}>
                   <div className='flex flex-col justify-center'>
                    <div className='flex items-center gap-2'>
                    <input type="checkbox" checked={item.completed} onChange={() => toggleCompleted(item._id)} />
                    <span className='break-all text-sm sm:text-md'>{item && item.task}</span>
                    </div>
                    <div className='text-xs sm:text-sm sm:hidden'>{item && item.deadline}</div>
                  </div>
                  <div className='flex gap-3 items-center'>
                    <span className='text-xs sm:text-sm hidden sm:block'>{item && item.deadline}</span>
                    <img src={`${item.important ? "filledstar.svg" : "emptystar.svg"}`} onClick={() => starTask(item._id)} alt="img" width={20} height={20} className='cursor-pointer' />
                    <img src="delete.svg" onClick={() => deleteTask(item._id)} alt="img" width={20} height={20} className='cursor-pointer' />
                    <img src="edit.svg" onClick={() => editTask(item._id)} alt="img" width={20} height={20} className='cursor-pointer' />
                  </div>
                </div>
              })}</div>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default dashboard
