const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

//add a new courser
router.post("/add", async(req, res) => {
    const {name, code, department} = req.body;

    try{
        const existing = await Course.findOne({code});
        if(existing) return res.status(400).json({message : "Course already exisits!!"});

        const course = new Course({name, code, department, studentsEnrolled: []});
        await course.save();

        res.status(201).json({message : "course added successfully!! ", course});
    }catch(error){
        res.status(500).json({message: "Server error", error: error.message});
    }
});

//fetch all courses
router.get("/all", async(req, res) => {
    try{
        const courses = await Course.find({}, "name _id");
        res.json(courses);
    }catch(err){
        res.status(500).json({message: "Server error", err: err.message});
    }
});

module.exports = router;