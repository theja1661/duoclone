import './AdminCourseView.css'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiService } from '../services/api'
import { FaChevronLeft, FaEdit, FaTrash, FaBook, FaCode, FaQuestion, FaClock, FaSignal } from 'react-icons/fa'
import { CourseIcon } from '../components/IconFinder'
import { getUser } from '../context/UserContext'

function AdminCourseView() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  // Check admin access
  useEffect(() => {
    const currentUser = getUser()
    
    if (!currentUser) {
      navigate('/signin', { replace: true })
      return
    }

    setUser(currentUser)

    const userRole = currentUser.role?.replace('ROLE_', '')
    if (userRole !== 'ADMIN') {
      navigate('/home', { replace: true })
    }
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
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchCourse()
    }
  }, [id, user])

  const handleEdit = () => {
    navigate(`/admin/edit-course/${id}`)
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${course.name}"? This action cannot be undone.`)) {
      try {
        await apiService.deleteCourse(id)
        alert('Course deleted successfully')
        navigate('/admin')
      } catch (error) {
        console.error('Error deleting course:', error)
        alert('Failed to delete course')
      }
    }
  }

  if (!user) {
    return (
      <div className="admin-course-view">
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="admin-course-view">
        <div className="loading-container">
          <p>Loading course details...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="admin-course-view">
        <div className="error-container">
          <h2>Course not found</h2>
          <button className="btn-primary" onClick={() => navigate('/admin')}>
            Back to Admin
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-course-view">
      <div className="course-view-header">
        <div className="header-left">
          <button className="btn-back-arrow" onClick={() => navigate('/admin')} aria-label="Back to Admin">
            <FaChevronLeft />
          </button>
          <div className="header-icon">
            <CourseIcon courseName={course.name} size={64} />
          </div>
          <div className="header-info">
            <h1>{course.name}</h1>
            <p className="course-description">{course.description}</p>
            <div className="course-stats">
              <div className="stat-item">
                <FaSignal />
                <span>{course.level}</span>
              </div>
              <div className="stat-item">
                <FaClock />
                <span>{course.duration}</span>
              </div>
              <div className="stat-item">
                <FaBook />
                <span>{course.totalLessons} lessons</span>
              </div>
              <div className="stat-item">
                <FaCode />
                <span>{course.totalExercises} exercises</span>
              </div>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-edit" onClick={handleEdit}>
            <FaEdit /> Edit
          </button>
          <button className="btn-delete" onClick={handleDelete}>
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      <div className="course-view-content">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            Technical Content ({course.technicalContent?.length || 0})
          </button>
          <button 
            className={`tab ${activeTab === 'mcq' ? 'active' : ''}`}
            onClick={() => setActiveTab('mcq')}
          >
            MCQ Questions ({course.mcqQuestions?.length || 0})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="content-card">
                <h3>Full Description</h3>
                <p>{course.fullDescription || course.description}</p>
              </div>

              {course.curriculum && course.curriculum.length > 0 && (
                <div className="content-card">
                  <h3>Curriculum ({course.curriculum.length} topics)</h3>
                  <ul className="curriculum-list-view">
                    {course.curriculum.map((item, index) => (
                      <li key={index}>
                        <span className="curriculum-number">{index + 1}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'content' && (
            <div className="content-section">
              {course.technicalContent && course.technicalContent.length > 0 ? (
                course.technicalContent.map((content, index) => (
                  <div key={index} className="technical-content-card">
                    <div className="content-header">
                      <h3>{index + 1}. {content.title}</h3>
                      <span className="language-badge">{content.language}</span>
                    </div>
                    <p className="content-description">{content.content}</p>
                    {content.codeExample && (
                      <div className="code-block">
                        <div className="code-header">
                          <span>Code Example</span>
                        </div>
                        <pre><code>{content.codeExample}</code></pre>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No technical content added yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'mcq' && (
            <div className="mcq-section">
              {course.mcqQuestions && course.mcqQuestions.length > 0 ? (
                course.mcqQuestions.map((mcq, index) => (
                  <div key={index} className="mcq-card">
                    <h3>Question {index + 1}</h3>
                    <p className="mcq-question">{mcq.question}</p>
                    <div className="mcq-options-view">
                      {mcq.options.map((option, optIndex) => (
                        <div 
                          key={optIndex} 
                          className={`option-view ${optIndex === mcq.correctAnswerIndex ? 'correct' : ''}`}
                        >
                          <span className="option-letter">{String.fromCharCode(65 + optIndex)}</span>
                          <span className="option-text">{option}</span>
                          {optIndex === mcq.correctAnswerIndex && (
                            <span className="correct-badge">✓ Correct Answer</span>
                          )}
                        </div>
                      ))}
                    </div>
                    {mcq.explanation && (
                      <div className="explanation">
                        <strong>Explanation:</strong>
                        <p>{mcq.explanation}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No MCQ questions added yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminCourseView
