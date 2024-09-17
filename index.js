const express = require("express")
const fs = require("fs")

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
    const MaxAge = req.query.max_age;
    const MinAge = req.query.min_age;
    if(name){
        let queryUsersName = users.filter(elem=>{
            return elem.name.toLocaleLowerCase() === name.toLocaleLowerCase()
        })
        if(queryUsersName.length >= 1){
            res.send(queryUsersName)
        }else{
            res.send(users)
        }
    }
    else if(MaxAge){
        let queryUsersAge = users.filter(elem=>{
            return elem.age <= +MaxAge
        })
        if(queryUsersAge.length >= 1){
            res.send(queryUsersAge)
        }else{
            res.send(users)
        }
    }
    else if(MinAge){
        let queryUsersAge = users.filter(elem=>{
            return elem.age >= +MinAge
        })
        if(queryUsersAge.length >= 1){
            res.send(queryUsersAge)
        }else{
            res.send(users)
        }
    }else{
        res.send(users)
    }
})

app.get("/users/:id", (req,res)=>{
    let user = users.find(elem=> elem.id === req.params.id)
    if(user){
        res.send(user)
    }
    else{
        res.send("user not found")
    }
})

app.listen(3003, ()=>{
    console.log("server is running!!!")
})