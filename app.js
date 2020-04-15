//jshint esversion: 6

const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")

const app = express();


app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res) {
    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.email
    const https = require("https")
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data)

    const url = "https://us4.api.mailchimp.com/3.0/lists/c768948476"

    const options = {
        method: "POST",
        auth: "jonne1:2714d9b29e6e3c00648bf26477d18996-us4"
    }

    const request = https.request(url, options, function(response) {
        
        var statCode = response.statusCode 
        
        response.on("data", function(data) {
            console.log(JSON.parse(data))
        })
        if (statCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
        
    })

    request.write(jsonData)
    request.end()

    
    
})


app.post("/failure.html", function(req, res) {
    res.redirect("/")
})



app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000.")
})


//API Key
// 2714d9b29e6e3c00648bf26477d18996-us4

//LIST id
// c768948476