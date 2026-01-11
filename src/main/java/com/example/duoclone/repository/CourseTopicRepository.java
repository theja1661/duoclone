
package com.example.duoclone.repository;

import com.example.duoclone.model.CourseTopic;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CourseTopicRepository extends MongoRepository<CourseTopic, String> {
    List<CourseTopic> findByCourseIdOrderByOrderAsc(String courseId);
}
