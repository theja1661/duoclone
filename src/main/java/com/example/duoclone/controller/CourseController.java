package com.example.duoclone.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.example.duoclone.model.Course;
import com.example.duoclone.model.UserProgress;
import com.example.duoclone.repository.CourseRepository;
import com.example.duoclone.repository.UserProgressRepository;

@RestController
@RequestMapping("/api/course")
public class CourseController {

    private final CourseRepository courseRepository;
    private final UserProgressRepository progressRepository;

    public CourseController(CourseRepository courseRepository,
                            UserProgressRepository progressRepository) {
        this.courseRepository = courseRepository;
        this.progressRepository = progressRepository;
    }

    // ✅ Get course details
    @GetMapping("/{id}")
    public Course getCourse(@PathVariable String id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    
   @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }


    // ✅ Submit & mark course as completed
    @PostMapping("/{id}/submit")
    public String submitCourse(@PathVariable String id,
                               @RequestBody Map<String, String> request) {

        String userId = request.get("userId");

        UserProgress progress = new UserProgress();
        progress.setUserId(userId);
        progress.setCourseId(id);
        progress.setCompleted(true);

        progressRepository.save(progress);

        return "Course marked as completed";
    }
}
