const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors');

app.use(express.json())
app.use(cors());

//include and intitialize the rollbar libvrary with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '138f72313df943a5a34d04ae1eb29994',
  captureUncaught: true,
  captureUnhandledRejections: true,
})
rollbar.log('hello world')



const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
    rollbar.info('someone loaded your html');
})

app.get('/api/students', (req, res) => {
    rollbar.info('someone got the list of students to load')
    res.status(200).send(students)
})

//added above rollbar.info
// try {
//     nonExistentFunction();
// }catch (error) {
//     console.error(error);
//     rollbar.info(error)
// }

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })


   try {
       if (index === -1 && name !== '') {
        rollbar.log("student added successfully",{author:'Josh', type: 'manual entry'});
           students.push(name)
           res.status(200).send(students)
       } else if (name === ''){
        //added after
        rollbar.error('no name provided')
           res.status(400).send('You must enter a name.')
       } else {
        rollbar.error('student exists');
           res.status(400).send('That student already exists.')
       }
   } catch (err) {
       console.log(err)
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    rollbar.info("student was deleted!");
    res.status(200).send(students)
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
