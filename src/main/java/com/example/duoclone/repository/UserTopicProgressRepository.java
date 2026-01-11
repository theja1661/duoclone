
package com.example.duoclone.repository;

import com.example.duoclone.model.UserTopicProgress;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserTopicProgressRepository extends MongoRepository<UserTopicProgress, String> {
    List<UserTopicProgress> findByUserIdAndCourseId(String userId, String courseId);
    Optional<UserTopicProgress> findByUserIdAndCourseIdAndTopicId(String userId, String courseId, String topicId);
}
