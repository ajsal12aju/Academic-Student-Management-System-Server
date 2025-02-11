const Course = require("../schemas/courseSchema");

const createCourse = async (req, res) => {
  const {
    course_code,
    course_id,
    course_name,
    branch,
    course_duration,
    course_fee,
  } = req.body;

  try {
    if (
      !course_id ||
      !course_code ||
      !course_name ||
      !branch ||
      !course_duration ||
      !course_fee
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newCourse = new Course({
      course_id,
      course_code,
      course_name,
      branch,
      course_duration,
      course_fee,
    });

    await newCourse.save();
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create Course",
      error: error.message,
    });
  }
};

const getAllcourses = async (req, res) => {
  try {
    const branch = req.branchObjID;

    if (!branch) {
      return res.status(400).json({
        success: false,
        message: "Branch is required to fetch courses",
      });
    }

    // Find courses belonging to the specified branch
    const courses = await Course.find({ branch });

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    // Find course by ID
    const course = await Course.findById(req.params.id).populate("branch");

    // If no course is found, return a 404 response
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Return the course data with a success response
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    // Handle errors (like invalid ObjectId or server errors)
    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: error.message,
    });
  }
};

const editCourse = async (req, res) => {
  const { course_name, state, district, place, course_head } = req.body;

  try {
    const Course = await course.findById(req.params.id);
    if (!Course) {
      return res
        .status(404)
        .json({ success: false, message: "course not found" });
    }

    if (course_name) course.course_name = course_name;
    if (district) course.district = district;
    if (place) course.place = place;
    if (course_head) course.course_head = course_head;

    await course.save();
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};

module.exports = { getAllcourses, getCourseById, createCourse, editCourse };
