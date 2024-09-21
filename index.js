import express from "express"
import fs from "fs"
import path from "path"

const app = express()

app.use(express.json())
app.use(express.static("public"))

let users = []

fs.promises.readFile("./users.json","utf-8")
.then(data=>{
    users = JSON.parse(data)
})

app.get("/", (req,res)=>{
    res.sendFile(path.resolve("./index.html"))
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

app.post("/addUser", (req,res)=>{
    const {name,age} = req.body
    if(name && age){
        fs.promises.readFile("./users.json", "utf-8")
        .then(data=>{
            let newJson = JSON.parse(data)
            let idJson = []
            newJson.forEach(elem => idJson.push(elem.id));
            let max = Math.max(...idJson)
            newJson.push({id: String(max+1), name: name ,age : +age})
            console.log(newJson)
            fs.promises.unlink("./users.json")
            fs.promises.appendFile("./users.json", JSON.stringify(newJson))
            res.status(200).send("ok")
        })
    }
})

app.delete("/users/:id", (req,res)=>{
    let newUsers = users.filter(elem=>{
        return elem.id !== req.params.id
    })
    fs.promises.unlink("./users.json")
    fs.promises.appendFile("./users.json", JSON.stringify(newUsers))
    res.status(200).send("ok")
})

app.patch("/users/:id",(req,res)=>{
    users.forEach((elem,idx)=>{
        if(elem.id === req.params.id){
            users[idx] = {
                id: req.body.id,
                name: req.body.name,
                age: +req.body.age
            }
            fs.promises.unlink("./users.json")
            fs.promises.appendFile("./users.json", JSON.stringify(users))
        }
    })
})

app.listen(3003, ()=>{
    console.log("server is running!!!")
})