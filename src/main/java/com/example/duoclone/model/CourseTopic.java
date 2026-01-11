
package com.example.duoclone.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "course_topics")
@CompoundIndexes({
    // Ensure each course has unique ordering for topics
    @CompoundIndex(name = "course_order_idx", def = "{'courseId': 1, 'order': 1}", unique = true)
})
public class CourseTopic {

    @Id
    private String id;

    private String courseId;     // references Course.id
    private int order;           // 1-based ordering (position within the course)

    private String topic;        // e.g., "Objects", "Collections", "Inheritance"
    private String description;  // explanatory text
    private String usecase;      // practical example or scenario

    // Optional: any extra fields you want to expose
    private String level;        // e.g., "beginner", "intermediate"
    private Integer estimatedMinutes;

    // ✅ Transient field (not persisted) but will be serialized in JSON responses
    @Transient
    private boolean completedTopic;

    public CourseTopic() {}

    public CourseTopic(String courseId, int order, String topic, String description, String usecase,
                       String level, Integer estimatedMinutes) {
        this.courseId = courseId;
        this.order = order;
        this.topic = topic;
        this.description = description;
        this.usecase = usecase;
        this.level = level;
        this.estimatedMinutes = estimatedMinutes;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUsecase() { return usecase; }
    public void setUsecase(String usecase) { this.usecase = usecase; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public Integer getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(Integer estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }

    public boolean isCompletedTopic() { return completedTopic; }
    public void setCompletedTopic(boolean completedTopic) { this.completedTopic = completedTopic; }
}
