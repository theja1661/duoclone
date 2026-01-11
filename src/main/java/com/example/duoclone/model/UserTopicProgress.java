
package com.example.duoclone.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "user_topic_progress")
@CompoundIndexes({
    @CompoundIndex(name = "user_course_topic_idx", def = "{'userId': 1, 'courseId': 1, 'topicId': 1}", unique = true)
})
public class UserTopicProgress {

    @Id
    private String id;

    private String userId;
    private String courseId;
    private String topicId;   // references CourseTopic.id
    private boolean completed;

    private Instant updatedAt;

    public UserTopicProgress() {}

    public UserTopicProgress(String userId, String courseId, String topicId, boolean completed) {
        this.userId = userId;
        this.courseId = courseId;
        this.topicId = topicId;
        this.completed = completed;
        this.updatedAt = Instant.now();
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }
    public String getTopicId() { return topicId; }
    public void setTopicId(String topicId) { this.topicId = topicId; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
