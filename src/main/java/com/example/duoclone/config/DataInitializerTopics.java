
// package com.example.duoclone.config;


// import com.example.duoclone.model.Course;
// import com.example.duoclone.repository.CourseRepository;
// import org.springframework.boot.ApplicationRunner;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.context.annotation.Profile;
// import org.springframework.data.mongodb.core.MongoTemplate;
// import org.springframework.data.mongodb.core.query.Criteria;
// import org.springframework.data.mongodb.core.query.Query;
// import org.springframework.data.mongodb.core.query.Update;

// import java.util.List;


// @Configuration
// public class DataInitializerConfig {

//     @Bean// run only when 'dev' profile is active
//     public ApplicationRunner seedCourses(CourseRepository courseRepository) {
//         return args -> {
//             if (courseRepository.count() == 0) {
//                 var courses = List.of(
//                     new Course(
//                         "Java Basics",
//                         "Understand core Java syntax and OOP principles",
//                         "Introductory Java course covering variables, control flow, OOP, and collections.",
//                         List.of(
//                             "What is the difference between JDK and JRE?",
//                             "Explain the concept of inheritance in OOP.",
//                             "How do you use an ArrayList?"
//                         )
//                     ),
//                     new Course(
//                         "Python Fundamentals",
//                         "Write Python scripts and understand key language features",
//                         "Covers data types, functions, modules, and basic file I/O.",
//                         List.of(
//                             "What are Python lists and how do they differ from tuples?",
//                             "How do you create and use virtual environments?",
//                             "Explain list comprehensions with an example."
//                         )
//                     ),
//                     new Course(
//                         "Spring Boot Quickstart",
//                         "Build REST APIs with Spring Boot",
//                         "Learn to create REST endpoints, connect to MongoDB, and handle errors.",
//                         List.of(
//                             "How do you annotate a REST controller in Spring Boot?",
//                             "What is the role of application.properties?",
//                             "How does Spring Data MongoDB map documents?"
//                         )
//                     )
//                 );

//                 courseRepository.saveAll(courses);
//                 System.out.println("✅ Seeded dummy courses into MongoDB.");
//             } else {
//                 System.out.println("ℹ️ Courses already present, skipping seeding.");
//             }
//         };
//     }
    
//    // ✅ 2. Backfill completed=false for old documents
//     @Bean
//     @Profile("dev")
//     public ApplicationRunner backfillCompleted(MongoTemplate mongoTemplate) {
//         return args -> {
//             Query query = new Query(
//                 Criteria.where("completed").exists(false)
//             );
//             Update update = new Update().set("completed", false);

//             var result = mongoTemplate.updateMulti(query, update, Course.class);
//             System.out.println(
//                 "✅ Backfilled 'completed=false' on " + result.getModifiedCount() + " course(s)."
//             );
//         };
    
//     }
// }

// src/main/java/com/example/duoclone/config/DataInitializerTopics.java
package com.example.duoclone.config;

import com.example.duoclone.model.Course;
import com.example.duoclone.model.CourseTopic;
import com.example.duoclone.repository.CourseRepository;
import com.example.duoclone.repository.CourseTopicRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
public class DataInitializerTopics {

    @Bean
//    @Profile("dev")
    public ApplicationRunner seedTopics(CourseRepository courseRepository,
                                        CourseTopicRepository topicRepository) {
        return args -> {
            if (topicRepository.count() == 0) {
                // map course name -> id for convenience
                Map<String, String> courseIds = courseRepository.findAll().stream()
                        .collect(Collectors.toMap(Course::getName, Course::getId));

                String javaId   = courseIds.get("Java Basics");
                String pythonId = courseIds.get("Python Fundamentals");
                String springId = courseIds.get("Spring Boot Quickstart");

                var javaTopics = List.of(
                    new CourseTopic(javaId, 1, "Objects",
                        "Understand classes vs objects, state & behavior.",
                        "Model a BankAccount class with deposit/withdraw.",
                        "beginner", 8),
                    new CourseTopic(javaId, 2, "Inheritance",
                        "Reuse and extend behavior via parent-child relationships.",
                        "Vehicle base class with Car/Bike subclasses.",
                        "beginner", 10),
                    new CourseTopic(javaId, 3, "Polymorphism",
                        "Method overriding & dynamic dispatch.",
                        "Shape.draw() implemented differently per subclass.",
                        "intermediate", 12),
                    new CourseTopic(javaId, 4, "Interfaces",
                        "Contracts & multiple inheritance of type.",
                        "Use Comparable to sort custom objects.",
                        "intermediate", 9),
                    new CourseTopic(javaId, 5, "Collections",
                        "List/Set/Map basics & iteration.",
                        "Catalog products with Map<String, Product>.",
                        "intermediate", 12),
                    new CourseTopic(javaId, 6, "Exceptions",
                        "Checked vs unchecked; try/catch/finally.",
                        "Validate inputs and throw custom exceptions.",
                        "intermediate", 10)
                );

                var pythonTopics = List.of(
                    new CourseTopic(pythonId, 1, "Data Types",
                        "Numbers, strings, lists, tuples, dicts, sets.",
                        "Build a config dict for an app.",
                        "beginner", 8),
                    new CourseTopic(pythonId, 2, "Functions",
                        "Defining, returning values, *args, **kwargs.",
                        "Create a utilities module.",
                        "beginner", 10),
                    new CourseTopic(pythonId, 3, "Modules & Packages",
                        "Imports, venvs, packaging basics.",
                        "Package a CLI tool.",
                        "intermediate", 12),
                    new CourseTopic(pythonId, 4, "File I/O",
                        "Open/read/write files, context managers.",
                        "Process a CSV and write a summary.",
                        "beginner", 9),
                    new CourseTopic(pythonId, 5, "OOP in Python",
                        "Classes, methods, inheritance.",
                        "Class hierarchy for shapes.",
                        "intermediate", 11)
                );

                var springTopics = List.of(
                    new CourseTopic(springId, 1, "Spring Boot Intro",
                        "Starters, auto-config, lifecycle.",
                        "Create a simple REST service.",
                        "beginner", 8),
                    new CourseTopic(springId, 2, "REST Controllers",
                        "@RestController, routing, validation.",
                        "Build CRUD endpoints for Course.",
                        "beginner", 12),
                    new CourseTopic(springId, 3, "Mongo Persistence",
                        "Repositories, documents, indexes.",
                        "Store user progress & topics.",
                        "intermediate", 12),
                    new CourseTopic(springId, 4, "Profiles & Config",
                        "application.properties/yaml, @Profile.",
                        "Separate dev vs prod settings.",
                        "beginner", 9),
                    new CourseTopic(springId, 5, "Security (JWT)",
                        "Filters, authN, authZ.",
                        "Protect learning endpoints with roles.",
                        "intermediate", 14)
                );

                topicRepository.saveAll(javaTopics);
                topicRepository.saveAll(pythonTopics);
                topicRepository.saveAll(springTopics);

                System.out.println("✅ Seeded course topics.");
            } else {
                System.out.println("ℹ️ Topics exist. Skipping topic seeding.");
            }
        };
    }
}
