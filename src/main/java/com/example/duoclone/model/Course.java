
package com.example.duoclone.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "courses")
public class Course {

    @Id
    private String id;

    private String name;            // Java, Python, Spring Boot
    private String objective;       // What learner will achieve
    private String description;     // Course overview

    private List<String> questions; // Simple learning/check questions

    // --- Constructors ---
    public Course() {
    }

    public Course(String name, String objective, String description, List<String> questions) {
        this.name = name;
        this.objective = objective;
        this.description = description;
        this.questions = questions;
    }

    // --- Getters & Setters ---
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getObjective() {
        return objective;
    }

    public void setObjective(String objective) {
        this.objective = objective;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getQuestions() {
        return questions;
    }

    public void setQuestions(List<String> questions) {
        this.questions = questions;
    }
}
