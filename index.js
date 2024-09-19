import express from "express"
import fs from "fs"

const app = express()

let users = []

fs.promises.readFile("./users.json","utf-8")
    .then(data=>{
        users = JSON.parse(data)
    })

app.get("/", (req,res)=>{
    res.send("home page")
})

app.get("/users", (req,res)=>{
    const name = req.query.name;
    const sort = req.query.sort;
    if(name){
        let queryUsersName = users.filter(elem=>{
            return elem.name.toLocaleLowerCase() === name.toLocaleLowerCase()
        })
        if(queryUsersName.length >= 1){
            res.status(200).json(queryUsersName)
        }else{
            res.status(200).json(users)
        }
    }else if(sort){
        console.log(sort)
        if(sort === "max"){
            let newArr = users.sort((a,b)=>b.age - a.age)
            res.status(200).json(newArr)
        }else if(sort === "min"){
            let newArr = users.sort((a,b)=>a.age - b.age)
            res.status(200).json(newArr)
        }else{
            res.status(404).send("wrong input")
        }
    }
    else{   
        res.status(200).json(users)
    }
})

app.get("/users/:id", (req,res)=>{
    let user = users.find(elem=> elem.id === req.params.id)
    if(user){
        res.status(200).json(user)
    }
    else{
        res.status(404).send("user not found")
    }
})

app.listen(3003, ()=>{
    console.log("server is running!!!")
})