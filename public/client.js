const root = document.querySelector(".root")
const fname = document.querySelector(".name-input")
const age = document.querySelector(".age-input")
const submit = document.querySelector(".submit")

render()

let obj = {
    name : "",
    age : ""
}

fname.addEventListener("input", (e)=>{
    obj.name = e.target.value
})
age.addEventListener("input", (e)=>{
    obj.age = e.target.value
})

submit.addEventListener("click", ()=>{
    if(obj.name !== "" || obj.name !== " " && obj.age !== "" || obj.age !== " "){
        fetch("http://localhost:3003/addUser", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({...obj})
        })
        
        obj = {
            name : "",
            age : ""
        }

        fname.value = ""
        age.value = ""
        setTimeout(()=>{
            render()
        },1000)
    }
})


function render(){
    root.textContent = ""
    let users = []
    
    fetch("/users", {
        method : "GET"
    }).then(res=>res.json()).then(res=> users = res)
    
    setTimeout(()=>{
        users.map(elem=>{
            let bool = false
            let h2 = document.createElement("h2")
            let name = document.createElement("span")
            let age = document.createElement("span")
            let del = document.createElement("button")
            let update = document.createElement("button")
            name.textContent =  elem.name
            age.textContent = elem.age
            del.textContent = "DELETE"
            update.textContent = "UPDATE"
            h2.append(name,age,update,del)
            root.appendChild(h2)

            del.addEventListener("click", ()=>{
                fetch(`http://localhost:3003/users/${elem.id}`,{
                    method: "DELETE"
                })
                setTimeout(()=>{
                    render()
                },500)
            })

            update.addEventListener("click",()=>{
                bool = !bool
                if(bool){
                    let obj = {
                        id: "",
                        name : "",
                        age : ""
                    }
                    let updateWindowDiv = document.createElement("div")
                    let updateWindow = document.createElement("div")
                    updateWindowDiv.classList = "update-window-div"
                    updateWindow.classList = "update-window"
                    root.appendChild(updateWindowDiv)
                    updateWindowDiv.appendChild(updateWindow)
                    let updateWindowName = document.createElement("input")
                    let updateWindowAge = document.createElement("input")
                    let updateWindowSubmit = document.createElement("button")
                    let close = document.createElement("h1")
                    updateWindowSubmit.textContent = "UPDATE"
                    updateWindowName.placeholder = "Name"
                    updateWindowAge.placeholder = "Age"
                    close.textContent = "X"
                    updateWindow.append(close,updateWindowName,updateWindowAge,updateWindowSubmit)

                    close.addEventListener("click", ()=>{
                        bool = !bool
                        render()
                    })
                    updateWindowName.addEventListener("input", (e)=>{
                        obj.name = e.target.value
                    })
                    updateWindowAge.addEventListener("input", (e)=>{
                        obj.age = e.target.value
                    })

                    updateWindowSubmit.addEventListener("click", ()=>{
                        obj.id = elem.id
                        fetch(`http://localhost:3003/users/${elem.id}`, {
                            method : "PATCH",
                            headers : {
                                "Content-Type" : "application/json"
                            },
                            body: JSON.stringify(obj)
                        })
                        obj = {
                            id: "",
                            name : "",
                            age : ""
                        }
                        setTimeout(()=>{
                            render()
                        },500)
                    })
                }
            })
        })
    },200)
}
