// GitHub username - you can change this
const GITHUB_USERNAME = 'SubhasyaTippareddy';

// GitHub API endpoint
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

// Google Docs Resume URL - Replace with your Google Docs shareable link
// Make sure to set sharing to "Anyone with the link can view"
const GOOGLE_DOCS_RESUME_URL = 'https://docs.google.com/document/d/1bqhZ0Ylt1psSuoPRoGyLc8mYpHPdkmJX/edit?usp=sharing';

// DOM Elements
const projectsContainer = document.getElementById('projects-container');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');

// Filter out certain repositories (like this portfolio itself)
// Add repository names here to exclude them from the projects section
const EXCLUDED_REPOS = [
  'SubhasyaTippareddy.github.io',  
  'portfolio',    
  'OS_Project1',                 
  'OS_Project2',
  'OS_Project3',
  'OS_Project4',
  'AC_project1',
  'AC_project2',
  'Algorithms_Projects'
];

// Open resume function
function openResume() {
  // Check if we have a Google Docs URL configured
  if (GOOGLE_DOCS_RESUME_URL.includes('YOUR_DOCUMENT_ID')) {
    // Fallback to PDF if Google Docs URL not configured
    window.open('assets/resume/Subhasya_Tippareddy_resume.pdf', '_blank');
  } else {
    // Convert Google Docs share link to viewer link
    const docId = GOOGLE_DOCS_RESUME_URL.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (docId) {
      // Use Google Docs viewer - shows latest version
      const viewerUrl = `https://docs.google.com/document/d/${docId[1]}/preview`;
      window.open(viewerUrl, '_blank');
    } else {
      window.open(GOOGLE_DOCS_RESUME_URL, '_blank');
    }
  }
}

// Language icons mapping
const languageIcons = {
  'Python': 'fab fa-python',
  'JavaScript': 'fab fa-js',
  'Java': 'fab fa-java',
  'HTML': 'fab fa-html5',
  'CSS': 'fab fa-css3-alt',
  'TypeScript': 'fab fa-js-square',
  'C++': 'fab fa-cuttlefish',
  'C': 'fab fa-cuttlefish',
  'Shell': 'fas fa-terminal',
  'Default': 'fas fa-code'
};

// Fetch and display projects
async function fetchProjects() {
  try {
    const response = await fetch(GITHUB_API_URL);
    
    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }
    
    const repos = await response.json();
    
    // Filter out excluded repos
    const filteredRepos = repos.filter(repo => 
      !EXCLUDED_REPOS.includes(repo.name) && 
      !repo.name.includes('test') &&
      !repo.name.includes('sample')
    );
    
    // Hide loading spinner
    loadingSpinner.style.display = 'none';
    
    // Display projects
    if (filteredRepos.length === 0) {
      errorMessage.style.display = 'block';
      errorMessage.textContent = 'No projects found.';
      return;
    }
    
    displayProjects(filteredRepos);
    
  } catch (error) {
    console.error('Error fetching projects:', error);
    loadingSpinner.style.display = 'none';
    errorMessage.style.display = 'block';
  }
}

// Display projects in cards
function displayProjects(repos) {
  repos.forEach((repo, index) => {
    const projectCard = createProjectCard(repo);
    projectCard.style.animationDelay = `${index * 0.1}s`;
    projectsContainer.appendChild(projectCard);
  });
}

// Create a project card element
function createProjectCard(repo) {
  const card = document.createElement('div');
  card.className = 'project-card fade-in';
  
  const language = repo.language || 'Default';
  const icon = languageIcons[language] || languageIcons['Default'];
  
  card.innerHTML = `
    <div class="project-header">
      <div class="project-icon">
        <i class="${icon}"></i>
      </div>
      <div class="project-links">
        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" aria-label="View live site"><i class="fas fa-external-link-alt"></i></a>` : ''}
        <a href="${repo.html_url}" target="_blank" aria-label="View on GitHub"><i class="fab fa-github"></i></a>
      </div>
    </div>
    <h3 class="project-title">${repo.name}</h3>
    <p class="project-description">${repo.description || 'No description available.'}</p>
    ${repo.topics && repo.topics.length > 0 ? `
      <div class="project-topics">
        ${repo.topics.slice(0, 5).map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
      </div>
    ` : ''}
    <div style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.85rem;">
      <span><i class="fas fa-code"></i> ${language}</span>
      ${repo.stargazers_count > 0 ? `<span style="margin-left: 1rem;"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>` : ''}
      ${repo.fork ? `<span style="margin-left: 1rem;"><i class="fas fa-code-branch"></i> Forked</span>` : ''}
    </div>
  `;
  
  return card;
}

// Navigation functionality
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  // Smooth scroll for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          const navHeight = document.querySelector('.navbar').offsetHeight;
          const targetPosition = targetSection.offsetTop - navHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          navMenu.classList.remove('active');
        }
      }
    });
  });
  
  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('active');
    }
  });
}

// Navbar scroll effect
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Intersection Observer for fade-in animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all sections
  const sections = document.querySelectorAll('.section > .container');
  sections.forEach(section => observer.observe(section));
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initNavbarScroll();
  initScrollAnimations();
  initThemeToggle();
  fetchProjects();
  loadResumeData();
});

// Theme Toggle Functionality
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';
  
  // Set initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);
  
  // Toggle theme on button click
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('theme-toggle');
  if (theme === 'dark') {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

// Load resume data (skills and experience)
async function loadResumeData() {
  try {
    console.log('Loading resume data...');
    const response = await fetch('./assets/js/resume-data.json');
    if (!response.ok) {
      throw new Error('Failed to fetch resume data');
    }
    const data = await response.json();
    console.log('Resume data loaded:', data);
    
    // Load about section
    if (data.about) {
      console.log('Loading about section...');
      loadAbout(data.about);
    }
    
    // Load skills
    if (data.skills) {
      console.log('Loading skills...');
      loadSkills(data.skills);
    }
    
    // Load experience
    if (data.experience) {
      console.log('Loading experience...');
      loadExperience(data.experience);
    }
  } catch (error) {
    console.error('Error loading resume data:', error);
    console.error('Error details:', error.message);
  }
}

// Load about section dynamically
function loadAbout(about) {
  const aboutText = document.querySelector('.about-text');
  if (!aboutText) {
    console.error('About text element not found');
    return;
  }
  console.log('Loading about content into element:', aboutText);
  
  aboutText.innerHTML = `
    <p>${about.intro}</p>
    <p>${about.experience}</p>
    <p>${about.goal}</p>
  `;
}

// Load skills dynamically
function loadSkills(skills) {
  const skillsGrid = document.querySelector('.skills-grid');
  if (!skillsGrid) {
    console.error('Skills grid element not found');
    return;
  }
  console.log('Loading skills into element:', skillsGrid);
  
  skillsGrid.innerHTML = '';
  
  Object.keys(skills).forEach(category => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'skill-category';
    
    const h4 = document.createElement('h4');
    h4.textContent = category;
    
    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'skill-tags';
    
    skills[category].forEach(skill => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.textContent = skill;
      tagsDiv.appendChild(tag);
    });
    
    categoryDiv.appendChild(h4);
    categoryDiv.appendChild(tagsDiv);
    skillsGrid.appendChild(categoryDiv);
  });
}

// Load experience dynamically
function loadExperience(experience) {
  const experienceTimeline = document.querySelector('.experience-timeline');
  if (!experienceTimeline) {
    console.error('Experience timeline element not found');
    return;
  }
  console.log('Loading experience into element:', experienceTimeline);
  
  experienceTimeline.innerHTML = '';
  
  experience.forEach(exp => {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    
    const timelineContent = document.createElement('div');
    timelineContent.className = 'timeline-content';
    
    // Company header
    const companyHeader = document.createElement('div');
    companyHeader.className = 'company-header';
    
    const logo = document.createElement('img');
    logo.src = exp.logo;
    logo.alt = exp.company;
    logo.className = 'company-logo';
    
    const companyInfo = document.createElement('div');
    companyInfo.className = 'company-info';
    
    const companyName = document.createElement('h3');
    companyName.className = 'company-name';
    companyName.textContent = exp.company;
    
    const jobTitle = document.createElement('p');
    jobTitle.className = 'job-title';
    jobTitle.textContent = exp.position;
    
    const jobPeriod = document.createElement('p');
    jobPeriod.className = 'job-period';
    jobPeriod.textContent = `${exp.period} | ${exp.location}`;
    
    companyInfo.appendChild(companyName);
    companyInfo.appendChild(jobTitle);
    companyInfo.appendChild(jobPeriod);
    
    companyHeader.appendChild(logo);
    companyHeader.appendChild(companyInfo);
    
    // Job details
    const jobDetails = document.createElement('ul');
    jobDetails.className = 'job-details';
    
    exp.responsibilities.forEach(resp => {
      const li = document.createElement('li');
      li.innerHTML = resp;
      jobDetails.appendChild(li);
    });
    
    timelineContent.appendChild(companyHeader);
    timelineContent.appendChild(jobDetails);
    timelineItem.appendChild(timelineContent);
    experienceTimeline.appendChild(timelineItem);
  });
}

// Update year in footer
const currentYear = new Date().getFullYear();
const footer = document.querySelector('.footer p');
if (footer) {
  footer.textContent = `© ${currentYear} Subhasya Tippareddy. Built with ❤️`;
}

