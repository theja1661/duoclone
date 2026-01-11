import './CourseEnroll.css'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiService } from '../services/api'
import { CourseIcon } from '../components/IconFinder'
import { getUser } from '../context/UserContext'
import { FaChevronLeft, FaClock, FaBook, FaCode, FaSignal } from 'react-icons/fa'
import EnrollmentSuccessModal from '../components/EnrollmentSuccessModal'

export default function CourseEnroll() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [user, setUser] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser) {
      navigate('/signin', { replace: true })
      return
    }
    setUser(currentUser)
  }, [navigate])

  useEffect(() => {
    const fetchCourse = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        const courseData = await apiService.getCourseDetails(id)
        setCourse(courseData)
      } catch (error) {
        console.error('Error fetching course:', error)
        setCourse(null)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchCourse()
    }
  }, [id, user])

  const handleEnroll = async () => {
    if (!user) {
      navigate('/signin')
      return
    }

    try {
      setEnrolling(true)
      const response = await apiService.enrollCourse(course.id)
      
      if (response.error) {
        alert(response.error)
      } else {
        setShowSuccessModal(true)
      }
    } catch (error) {
      console.error('Enrollment error:', error)
      alert(error.response?.data?.error || 'Failed to enroll in course')
    } finally {
      setEnrolling(false)
    }
  }

  const handleContinueToCourse = () => {
    navigate(`/course-continue/${course.id}`)
  }

  const handleBackToHome = () => {
    navigate('/home')
  }

  if (!user || loading) {
    return (
      <div className="course-enroll-page">
        <div className="loading-container">
          <p>Loading course details...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="course-enroll-page">
        <div className="error-container">
          <h1>Course not found</h1>
          <p>We couldn't find this course.</p>
          <button className="btn-primary" onClick={() => navigate('/home')}>
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // If already enrolled, redirect to course page
  if (course.enrolled) {
    navigate(`/course/${course.id}`, { replace: true })
    return null
  }

  return (
    <div className="course-enroll-page">
      {showSuccessModal && (
        <EnrollmentSuccessModal
          courseName={course.name}
          onClose={handleBackToHome}
          onContinue={handleContinueToCourse}
        />
      )}

      <header className="enroll-header">
        <button className="btn-back-arrow" onClick={() => navigate('/home')} aria-label="Back to Home">
          <FaChevronLeft />
        </button>
        <div className="header-content">
          <div className="course-icon-large">
            <CourseIcon courseName={course.name} size={64} />
          </div>
          <div className="header-info">
            <h1>{course.name}</h1>
            <p className="course-tagline">Ready to start your learning journey?</p>
          </div>
        </div>
      </header>

      <main className="enroll-main">
        <div className="enroll-content">
          <section className="course-overview-section">
            <h2>About this course</h2>
            <p className="course-full-description">
              {course.fullDescription || course.description}
            </p>
          </section>

          <section className="course-highlights">
            <h2>Course Highlights</h2>
            <div className="highlights-grid">
              <div className="highlight-card">
                <FaSignal className="highlight-icon" />
                <div className="highlight-info">
                  <span className="highlight-label">Level</span>
                  <span className="highlight-value">{course.level}</span>
                </div>
              </div>
              <div className="highlight-card">
                <FaClock className="highlight-icon" />
                <div className="highlight-info">
                  <span className="highlight-label">Duration</span>
                  <span className="highlight-value">{course.duration}</span>
                </div>
              </div>
              <div className="highlight-card">
                <FaBook className="highlight-icon" />
                <div className="highlight-info">
                  <span className="highlight-label">Lessons</span>
                  <span className="highlight-value">{course.totalLessons} lessons</span>
                </div>
              </div>
              <div className="highlight-card">
                <FaCode className="highlight-icon" />
                <div className="highlight-info">
                  <span className="highlight-label">Exercises</span>
                  <span className="highlight-value">{course.totalExercises} challenges</span>
                </div>
              </div>
            </div>
          </section>

          {course.curriculum && course.curriculum.length > 0 && (
            <section className="curriculum-section">
              <h2>What you'll learn</h2>
              <ul className="curriculum-preview">
                {course.curriculum.map((item, index) => (
                  <li key={index}>
                    <span className="check-icon">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {course.technicalContent && course.technicalContent.length > 0 && (
            <section className="content-preview-section">
              <h2>Course Content Preview</h2>
              <p className="preview-description">
                Get a glimpse of what you'll learn in this course
              </p>
              <div className="content-cards">
                {course.technicalContent.slice(0, 3).map((content, index) => (
                  <div key={index} className="content-preview-card">
                    <div className="content-preview-header">
                      <h3>{content.title}</h3>
                      <span className="language-tag">{content.language}</span>
                    </div>
                    <p className="content-preview-text">
                      {content.content.substring(0, 150)}...
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="enroll-action-section">
            <div className="action-card">
              <h2>Ready to get started?</h2>
              <p>Enroll now and begin your learning journey with {course.name}</p>
              <button 
                className="btn-enroll-large" 
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? 'Enrolling...' : 'Enroll in Course'}
              </button>
              <button 
                className="btn-back-secondary"
                onClick={() => navigate('/home')}
              >
                Back to Courses
              </button>
            </div>
          </section>
        </div>

        <aside className="enroll-sidebar">
          <div className="sidebar-sticky">
            <div className="course-preview-card">
              <div className="preview-image">
                <CourseIcon courseName={course.name} size={80} />
              </div>
              <h3>{course.name}</h3>
              <p className="sidebar-description">{course.description}</p>
              
              <div className="sidebar-stats">
                <div className="sidebar-stat">
                  <FaBook className="stat-icon" />
                  <span>{course.totalLessons} Lessons</span>
                </div>
                <div className="sidebar-stat">
                  <FaCode className="stat-icon" />
                  <span>{course.totalExercises} Exercises</span>
                </div>
                <div className="sidebar-stat">
                  <FaClock className="stat-icon" />
                  <span>{course.duration}</span>
                </div>
              </div>

              <button 
                className="btn-enroll-sidebar" 
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
