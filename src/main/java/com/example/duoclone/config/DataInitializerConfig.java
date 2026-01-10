
package com.example.duoclone.config;


import com.example.duoclone.model.Course;
import com.example.duoclone.repository.CourseRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import java.util.List;


@Configuration
public class DataInitializerConfig {

    @Bean// run only when 'dev' profile is active
    public ApplicationRunner seedCourses(CourseRepository courseRepository) {
        return args -> {
            if (courseRepository.count() == 0) {
                var courses = List.of(
                    new Course(
                        "Java Basics",
                        "Understand core Java syntax and OOP principles",
                        "Introductory Java course covering variables, control flow, OOP, and collections.",
                        List.of(
                            "What is the difference between JDK and JRE?",
                            "Explain the concept of inheritance in OOP.",
                            "How do you use an ArrayList?"
                        )
                    ),
                    new Course(
                        "Python Fundamentals",
                        "Write Python scripts and understand key language features",
                        "Covers data types, functions, modules, and basic file I/O.",
                        List.of(
                            "What are Python lists and how do they differ from tuples?",
                            "How do you create and use virtual environments?",
                            "Explain list comprehensions with an example."
                        )
                    ),
                    new Course(
                        "Spring Boot Quickstart",
                        "Build REST APIs with Spring Boot",
                        "Learn to create REST endpoints, connect to MongoDB, and handle errors.",
                        List.of(
                            "How do you annotate a REST controller in Spring Boot?",
                            "What is the role of application.properties?",
                            "How does Spring Data MongoDB map documents?"
                        )
                    )
                );

                courseRepository.saveAll(courses);
                System.out.println("✅ Seeded dummy courses into MongoDB.");
            } else {
                System.out.println("ℹ️ Courses already present, skipping seeding.");
            }
        };
    }
    
   // ✅ 2. Backfill completed=false for old documents
    @Bean
    @Profile("dev")
    public ApplicationRunner backfillCompleted(MongoTemplate mongoTemplate) {
        return args -> {
            Query query = new Query(
                Criteria.where("completed").exists(false)
            );
            Update update = new Update().set("completed", false);

            var result = mongoTemplate.updateMulti(query, update, Course.class);
            System.out.println(
                "✅ Backfilled 'completed=false' on " + result.getModifiedCount() + " course(s)."
            );
        };
    
    }
}
