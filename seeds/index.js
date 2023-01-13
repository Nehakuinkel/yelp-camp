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
            location: `${cities[i].city} , ${cities[i].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://unsplash.com/collections/483251/in-the-woods',
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum similique earum beatae nihil iure rem, suscipit id at? Laudantium vel asperiores mollitia natus culpa ipsam saepe placeat sequi atque. Odit.",
            price: price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})