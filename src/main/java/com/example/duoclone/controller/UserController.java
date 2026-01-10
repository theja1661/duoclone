package com.example.duoclone.controller;


import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.duoclone.model.Course;
import com.example.duoclone.repository.CourseRepository;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final CourseRepository courseRepository;

    public UserController(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @GetMapping("/dashboard")
    public List<Course> userDashboard() {
        return courseRepository.findAll();
    }
}
