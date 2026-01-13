
package com.example.duoclone.controller;

import com.example.duoclone.model.CourseTopic;
import com.example.duoclone.model.UserTopicProgress;
import com.example.duoclone.repository.CourseTopicRepository;
import com.example.duoclone.repository.UserTopicProgressRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/learning")
public class LearningController {

    private final CourseTopicRepository topicRepository;
    private final UserTopicProgressRepository progressRepository;

    public LearningController(CourseTopicRepository topicRepository,
                              UserTopicProgressRepository progressRepository) {
        this.topicRepository = topicRepository;
        this.progressRepository = progressRepository;
    }

    /**
     * GET /learning/{courseId}?userId=U123
     * Returns: { "result": [ CourseTopic (with completedTopic set) ... ] }
     */
    @GetMapping("/{courseId}")
    public Map<String, Object> getCourseTopics(@PathVariable String courseId,
                                               @RequestParam(required = false) String userId) {
        List<CourseTopic> topics = topicRepository.findByCourseIdOrderByOrderAsc(courseId);

        // Build a lookup of topicId -> completed (for this user/course)
        Map<String, Boolean> completedMap = Collections.emptyMap();
        if (userId != null && !userId.isBlank()) {
            completedMap = progressRepository.findByUserIdAndCourseId(userId, courseId).stream()
                    .collect(Collectors.toMap(UserTopicProgress::getTopicId, UserTopicProgress::isCompleted));
        }

        // Set transient completedTopic on each topic
               for (CourseTopic t : topics) {
            boolean completed = completedMap.getOrDefault(t.getId(), false);
            t.setCompletedTopic(completed);
        }

        // Return exactly: { "result": [ ... ] }
        return Map.of("result", topics);
    }
}