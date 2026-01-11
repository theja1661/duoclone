import './Home.css'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import { CourseIcon } from '../components/IconFinder'
import { FaUser, FaChartBar, FaCog, FaSignOutAlt, FaArrowRight } from 'react-icons/fa'
import { getUser, removeUser } from '../context/UserContext'

function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeCourses, setActiveCourses] = useState([])
  const [discoverCourses, setDiscoverCourses] = useState([])
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [favorites, setFavorites] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [enrolling, setEnrolling] = useState(null)

  // Redirect admin users to admin dashboard
  useEffect(() => {
    const currentUser = getUser()
    
    if (!currentUser) {
      navigate('/signin', { replace: true })
      return
    }

    setUser(currentUser)

    const userRole = currentUser.role?.replace('ROLE_', '')
    if (userRole === 'ADMIN') {
      navigate('/admin', { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        setError(null)
        
        // Fetch all courses, enrolled courses, and liked courses
        const [allCourses, enrolledCourses, likedCourseIds] = await Promise.all([
          apiService.getUserDashboard(),
          apiService.getEnrolledCourses(),
          apiService.getLikedCourses().catch(() => []) // Handle if endpoint fails
        ])
        
        console.log('All courses:', allCourses)
        console.log('Enrolled courses with progress:', enrolledCourses)
        console.log('Liked course IDs:', likedCourseIds)
        
        // Create a Set of enrolled course IDs for quick lookup
        const enrolledIds = new Set(enrolledCourses.map(c => c.id))
        
        // Create a Set of liked course IDs
        const likedIds = new Set(Array.isArray(likedCourseIds) ? likedCourseIds : [])
        setFavorites(likedIds)
        
        // Format enrolled courses with actual progress from backend
        const formattedEnrolled = enrolledCourses.map((course, index) => ({
          id: course.id,
          name: course.name,
          description: course.description,
          icon: ['📚', '🐍', '⚡', '⚛️', '🍃', '💻'][index % 6],
          progress: course.progress || 0,
          isActive: true
        }))

        // Format non-enrolled courses
        const formattedDiscover = allCourses
          .filter(course => !enrolledIds.has(course.id))
          .map((course, index) => ({
            id: course.id,
            name: course.name,
            description: course.description,
            icon: ['📚', '🐍', '⚡', '⚛️', '🍃', '💻'][index % 6],
            progress: 0,
            isActive: false
          }))

        console.log('Formatted enrolled with progress:', formattedEnrolled)
        console.log('Formatted discover:', formattedDiscover)

        setActiveCourses(formattedEnrolled)
        setDiscoverCourses(formattedDiscover)
      } catch (err) {
        console.error('Failed to load courses:', err)
        setError(`Failed to load courses: ${err.message}`)
        setActiveCourses([])
        setDiscoverCourses([])
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchCourses()
    }
  }, [user])

  const handleLogout = () => {
    removeUser()
    navigate('/signin')
  }

  const handleOpenCourse = (courseId, isActive) => {
    if (isActive) {
      navigate(`/course-continue/${courseId}`)
    } else {
      navigate(`/course/${courseId}`)
    }
  }

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu)
  }

  const toggleFavorite = async (e, courseId) => {
    e.stopPropagation()
    
    const isCurrentlyLiked = favorites.has(courseId)
    
    // Optimistically update UI
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (isCurrentlyLiked) {
        newFavorites.delete(courseId)
      } else {
        newFavorites.add(courseId)
      }
      return newFavorites
    })
    
    try {
      // Call API
      if (isCurrentlyLiked) {
        await apiService.unlikeCourse(courseId)
        console.log('Course unliked:', courseId)
      } else {
        await apiService.likeCourse(courseId)
        console.log('Course liked:', courseId)
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
      
      // Revert on error
      setFavorites(prev => {
        const newFavorites = new Set(prev)
        if (isCurrentlyLiked) {
          newFavorites.add(courseId)
        } else {
          newFavorites.delete(courseId)
        }
        return newFavorites
      })
      
      // Show error briefly
      setError('Failed to update favorite. Please try again.')
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleProfile = () => {
    setShowProfileMenu(false)
    navigate('/profile')
  }

  const handleViewCourse = (courseId) => {
    navigate(`/course-enroll/${courseId}`)
  }

  if (!user) {
    return (
      <div className="home-container">
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="home-container">
      <nav className="navbar">
        <h2>TechLingo</h2>
        
        <div className="navbar-profile">
          <span className="navbar-username">{user?.name || 'User'}</span>
          <button className="profile-btn" onClick={toggleProfileMenu}>
            <FaUser className="profile-icon" />
          </button>
          
          {showProfileMenu && (
            <>
              <div className="profile-overlay" onClick={() => setShowProfileMenu(false)} />
              <div className="profile-menu">
                <div className="profile-menu-header">
                  <div className="profile-avatar">
                    <FaUser size={24} />
                  </div>
                  <div className="profile-info">
                    <p className="profile-name">{user?.name || 'Demo User'}</p>
                    <p className="profile-email">{user?.email || 'demo@techlingo.com'}</p>
                  </div>
                </div>
                
                <div className="profile-menu-divider" />
                
                <button className="profile-menu-item" onClick={handleProfile}>
                  <FaUser className="menu-icon" />
                  My Profile
                </button>
                
                <div className="profile-menu-divider" />
                
                <button className="profile-menu-item logout" onClick={handleLogout}>
                  <FaSignOutAlt className="menu-icon" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </nav>
      
      <div className="home-content">
        {error && (
          <div className="error-banner">
            <p>⚠️ {error}</p>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <p>Loading courses...</p>
          </div>
        ) : (
          <>
            {/* Active Courses Section */}
            <section className="courses-section active-courses">
              <h1>Continue Learning</h1>
              <p className="subtitle">Pick up where you left off</p>
              
              <div className="courses-grid">
                {activeCourses.length > 0 ? (
                  activeCourses.map(course => (
                    <div key={course.id} className="course-card active" onClick={() => handleOpenCourse(course.id, true)}>
                      <div className="course-icon">
                        <CourseIcon courseName={course.name} size={28} />
                      </div>

                      <div className="course-content">
                        <h3>{course.name}</h3>
                        <div className="course-progress-row">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="progress-percent">{course.progress}%</span>
                        </div>
                      </div>

                      <button className="btn-continue" onClick={(e) => { e.stopPropagation(); handleOpenCourse(course.id, true); }}>
                        Continue
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-courses">No active courses. Start a new one below!</p>
                )}
              </div>
            </section>

            {/* Discover More Section */}
            <section className="courses-section discover-section">
              <h2>Discover More Courses</h2>
              <p className="subtitle">Expand your knowledge with new topics</p>

              <div className="courses-grid">
                {discoverCourses.map((course, index) => (
                  <div 
                    key={course.id} 
                    className={`course-card discover color-${['blue', 'purple', 'green', 'pink', 'teal', 'orange'][index % 6]}`}
                  >
                    <div className="course-image">
                      <span className="course-title-overlay">{course.name}</span>
                      <span className="course-icon-badge">
                        <CourseIcon courseName={course.name} size={40} />
                      </span>
                    </div>

                    <div className="course-card-content">
                      <div className="course-body">
                        <p className="course-desc">{course.description}</p>
                      </div>
                    </div>

                    <div className="course-footer">
                      <button
                        className={`btn-favorite ${favorites.has(course.id) ? 'active' : ''}`}
                        onClick={(e) => toggleFavorite(e, course.id)}
                        aria-label={favorites.has(course.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <span className="heart-icon">{favorites.has(course.id) ? '❤️' : '🤍'}</span>
                      </button>
                      <button
                        className="btn-start"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewCourse(course.id)
                        }}
                        aria-label={`View ${course.name}`}
                      >
                        View More
                        <FaArrowRight />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default Home
