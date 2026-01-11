import { 
  FaJava, 
  FaPython, 
  FaReact, 
  FaNodeJs, 
  FaDatabase,
  FaCode,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaPhp,
  FaRust,
  FaSwift,
  FaAndroid,
  FaApple,
  FaAws,
  FaDocker,
  FaGitAlt
} from 'react-icons/fa'
import { 
  SiSpring, 
  SiTypescript, 
  SiCplusplus,
  SiKotlin,
  SiGo,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiRedis,
  SiKubernetes,
  SiGraphql,
  SiFlutter,
  SiDjango,
  SiFlask,
  SiExpress,
  SiNextdotjs,
  SiVuedotjs,
  SiAngular,
  SiTailwindcss,
  SiBootstrap
} from 'react-icons/si'

const courseIconMap = {
  // Java related
  'java': FaJava,
  'spring': SiSpring,
  'spring boot': SiSpring,
  
  // Python related
  'python': FaPython,
  'django': SiDjango,
  'flask': SiFlask,
  
  // JavaScript/TypeScript related
  'javascript': FaJs,
  'typescript': SiTypescript,
  'react': FaReact,
  'node': FaNodeJs,
  'nodejs': FaNodeJs,
  'express': SiExpress,
  'next': SiNextdotjs,
  'nextjs': SiNextdotjs,
  'vue': SiVuedotjs,
  'angular': SiAngular,
  
  // Web related
  'html': FaHtml5,
  'css': FaCss3Alt,
  'tailwind': SiTailwindcss,
  'bootstrap': SiBootstrap,
  
  // Mobile
  'android': FaAndroid,
  'ios': FaApple,
  'swift': FaSwift,
  'kotlin': SiKotlin,
  'flutter': SiFlutter,
  
  // Databases
  'database': FaDatabase,
  'mongodb': SiMongodb,
  'postgres': SiPostgresql,
  'postgresql': SiPostgresql,
  'mysql': SiMysql,
  'redis': SiRedis,
  
  // Other languages
  'c++': SiCplusplus,
  'cpp': SiCplusplus,
  'c#': FaCode,  // Use generic code icon for C#
  'csharp': FaCode,  // Use generic code icon for C#
  'go': SiGo,
  'golang': SiGo,
  'rust': FaRust,
  'php': FaPhp,
  
  // DevOps/Tools
  'docker': FaDocker,
  'kubernetes': SiKubernetes,
  'aws': FaAws,
  'git': FaGitAlt,
  'graphql': SiGraphql,
}

const getCourseIconKey = (courseName) => {
  if (!courseName) return null
  
  const normalizedName = courseName.toLowerCase().trim()
  
  // Check for exact match first
  if (courseIconMap[normalizedName]) {
    return normalizedName
  }
  
  // Check for partial match
  for (const key of Object.keys(courseIconMap)) {
    if (normalizedName.includes(key)) {
      return key
    }
  }
  
  // Return null if no match found
  return null
}

// Component wrapper that renders the icon directly
export const CourseIcon = ({ courseName, className = '', size = 24, color }) => {
  const iconKey = getCourseIconKey(courseName)
  const Icon = iconKey ? courseIconMap[iconKey] : FaCode
  
  return <Icon className={className} size={size} color={color} />
}

export default CourseIcon

