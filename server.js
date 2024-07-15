const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");

const app = express();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`connected to MongoDB ${mongoose.connection.name}`);
});

const Car = require('./models/car.js');

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); 
app.use(morgan("dev")); 
app.use(express.static(path.join(__dirname, "public")));

// Маршрут для главной страницы
app.get('/', async (req, res) => {
    res.render('index.ejs');
});

// Маршрут для страницы с формой добавления новой машины
app.get('/cars/new', (req, res) => {
    res.render('cars/new.ejs');
});

// Маршрут для получения списка всех машин
app.get("/cars", async (req, res) => {
    const allCars = await Car.find();
    res.render("cars/index.ejs", { cars: allCars });
});

// Маршрут для создания новой машины
app.post("/cars", async (req, res) => {
    if (req.body.isSportCar === "on") {
        req.body.isSportCar = true;
    } else {
        req.body.isSportCar = false;
    }
    await Car.create(req.body);
    res.redirect("/cars");
});

// Маршрут для получения информации о конкретной машине по ID
app.get("/cars/:carId", async (req, res) => {
    const foundCar = await Car.findById(req.params.carId);
    res.render('cars/show.ejs', { car: foundCar });
});

// Маршрут для редактирования машины
app.get("/cars/:carId/edit", async (req, res) => {
    const foundCar = await Car.findById(req.params.carId);
    res.render('cars/edit.ejs', { car: foundCar });
});

// Маршрут для обновления информации о машине
app.put("/cars/:carId", async (req, res) => {
    if (req.body.isSportCar === "on") {
        req.body.isSportCar = true;
    } else {
        req.body.isSportCar = false;
    }
    await Car.findByIdAndUpdate(req.params.carId, req.body);
    res.redirect(`/cars/${req.params.carId}`);
});

// Маршрут для удаления машины
app.delete("/cars/:carId", async (req, res) => {
    await Car.findByIdAndDelete(req.params.carId);
    res.redirect('/cars');
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
