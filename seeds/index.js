const mongoose = require('mongoose');
const { $where } = require('../models/campgrounds');
const Campground = require('../models/campgrounds');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology : true
})

const db = mongoose.connection;
db.on('error' , console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("database connected");
})

const sample = (array => array[Math.floor(Math.random() * array.length)]);

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0; i< 25 ; i++ ) {
        const price = Math.floor(Math.random() *20 +10)
        const camp = new Campground({
            author: '63cfd4d1931e342e1273619a',
            location: `${cities[i].city} , ${cities[i].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://media-cdn.tripadvisor.com/media/photo-c/1280x250/0c/5d/17/bd/muktinath-temple.jpg',
            price: price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})