const mongoose = require('mongoose');


const connectDB = async ()=>{
    //mongodb+srv://namastenode:RAEkJpuMnv9puZzt@namastenodejs.vbirg.mongodb.net/?retryWrites=true&w=majority&appName=NamasteNodeJS/DevConnect
    //connecting to database DevConnect if not available ,but shows when a collection is added with a document here users collection with user data
    await mongoose.connect("mongodb+srv://namastenode:RAEkJpuMnv9puZzt@namastenodejs.vbirg.mongodb.net/DevConnect")
}

module.exports = connectDB;


