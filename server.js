const express = require('express')
const app = express()
const session = require('express-session')
const nocache = require('nocache')

app.use(express.static('public'))
app.set('view engine','hbs')

const username ="stewin"
const password = "123"

app.use(express.urlencoded({ extended: true}))
app.use(express.json())


app.use(session({
    secret: "ruby",
    resave: false,
    saveUninitialized: true
}))

app.use(nocache())


app.get('/',(req,res)=>{
    if(req.session.user){
        res.render("home",{welcome:`${username}`})
    }else{
         if(req.session.passwordwrong){
            res.render("login",{msg:"Invalid credentials"})
            req.session.passwordwrong=false
         }else{
         res.render("login")
         }
    }
    
})

app.post('/verify',(req,res)=>{
    console.log(req.body)
    if(req.body.username === username && req.body.password === password){
        req.session.user = req.body.username
        res.redirect('/home')
    }else{
        req.session.passwordwrong=true
        res.redirect('/')
    }
    
})

app.get('/home',(req,res)=>{
    if(req.session.user){
        res.render('home',{welcome:`${username}`})
    }else{
        if(req.session.passwordwrong){
            req.session.passwordwrong=false
            res.render("login",{msg:"Invalid credentials"})
            
        }else{
            res.render('login')
        }
        
    }
})



app.get('/logout',(req,res)=>{
    req.session.destroy()
    res.render('login')
})

app.get("*", (req, res) => {
    res.status(404).send("<h1>404 Error</h1>")
  })

app.listen(3000,()=>{
    console.log(`server running`)
})



