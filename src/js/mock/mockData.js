// Mock data for the learning platform

export const roles = [
  {
    id: 'java',
    name: 'Java Developer',
    icon: 'Code',
    description: 'Full Stack, Backend, Frontend Development',
    variants: ['Full Stack', 'Backend', 'Frontend'],
    color: '#f89820',
    trainingTopics: {
      'Full Stack': ['Core Java', 'Spring Boot', 'React/Angular', 'REST APIs', 'Hibernate', 'MySQL', 'Docker', 'CI/CD'],
      'Backend': ['Core Java', 'Spring Boot', 'Microservices', 'Kafka', 'Redis', 'PostgreSQL', 'JUnit', 'Maven'],
      'Frontend': ['HTML/CSS', 'JavaScript', 'React', 'TypeScript', 'Redux', 'Webpack', 'Jest', 'Material UI']
    }
  },
  {
    id: 'dotnet',
    name: '.NET Developer',
    icon: 'Code2',
    description: 'Full Stack, Backend, Frontend Development',
    variants: ['Full Stack', 'Backend', 'Frontend'],
    color: '#512bd4',
    trainingTopics: {
      'Full Stack': ['C#', 'ASP.NET Core', 'Blazor', 'Entity Framework', 'SQL Server', 'Azure', 'Docker', 'SignalR'],
      'Backend': ['C#', 'ASP.NET Web API', 'gRPC', 'CQRS/MediatR', 'Dapper', 'RabbitMQ', 'Azure Service Bus'],
      'Frontend': ['Blazor WebAssembly', 'JavaScript', 'React', 'TypeScript', 'Tailwind CSS']
    }
  },
  {
    id: 'sap',
    name: 'SAP Consultant',
    icon: 'Database',
    description: 'MM, PTP, BTP, Sales, Integration',
    variants: ['MM', 'PTP', 'BTP', 'Sales', 'Integration'],
    color: '#008fd3',
    trainingTopics: {
      'MM': ['SAP MM Basics', 'Procurement Cycle', 'Inventory Management', 'Vendor Master', 'Invoice Verification'],
      'PTP': ['Purchase to Pay Process', 'Accounts Payable', 'GR/IR Clearing', 'Payment Processing'],
      'BTP': ['SAP BTP Cockpit', 'Cloud Foundry', 'HANA Cloud', 'SAP Integration Suite', 'CAP Framework'],
      'Sales': ['SAP SD', 'Order Management', 'Pricing Procedures', 'Billing', 'Credit Management'],
      'Integration': ['SAP PI/PO', 'SAP Integration Suite', 'iDocs', 'BAPIs', 'Web Services']
    }
  },
  {
    id: 'salesforce',
    name: 'Salesforce Developer',
    icon: 'Cloud',
    description: 'CRM, Development, Administration',
    variants: ['Developer', 'Admin', 'Architect'],
    color: '#00a1e0',
    trainingTopics: {
      'Developer': ['Apex Programming', 'Lightning Web Components', 'SOQL/SOSL', 'Triggers', 'Visualforce', 'REST APIs'],
      'Admin': ['Object Configuration', 'Workflow Rules', 'Process Builder', 'Flows', 'Reports and Dashboards', 'Security'],
      'Architect': ['Platform Architecture', 'Data Modeling', 'Integration Patterns', 'Governor Limits', 'Org Strategy']
    }
  },
  {
    id: 'testing',
    name: 'QA/Testing',
    icon: 'TestTube2',
    description: 'Manual, Automation, Performance Testing',
    variants: ['Manual', 'Automation', 'Performance'],
    color: '#10b981',
    trainingTopics: {
      'Manual': ['Test Planning', 'Test Case Design', 'Bug Reporting', 'Jira', 'Agile QA', 'API Testing with Postman'],
      'Automation': ['Selenium WebDriver', 'Java/Python', 'TestNG/JUnit', 'Cucumber BDD', 'Appium', 'RestAssured', 'CI/CD'],
      'Performance': ['JMeter', 'Gatling', 'LoadRunner', 'Performance Metrics', 'Bottleneck Analysis', 'Grafana']
    }
  },
  {
    id: 'devops',
    name: 'DevOps Engineer',
    icon: 'Settings',
    description: 'CI/CD, Cloud, Infrastructure as Code',
    variants: ['AWS', 'Azure', 'GCP', 'Multi-Cloud'],
    color: '#ff6b35',
    trainingTopics: {
      'AWS': ['EC2/S3/RDS', 'Lambda', 'EKS', 'CloudFormation', 'CodePipeline', 'IAM', 'VPC Networking'],
      'Azure': ['Azure DevOps', 'AKS', 'ARM Templates', 'Azure Functions', 'Monitor', 'Key Vault'],
      'GCP': ['GKE', 'Cloud Build', 'Terraform on GCP', 'Cloud Run', 'BigQuery', 'Pub/Sub'],
      'Multi-Cloud': ['Kubernetes', 'Terraform', 'Ansible', 'Docker', 'Helm', 'ArgoCD', 'Prometheus']
    }
  },
  {
    id: 'data-engineer',
    name: 'Data Engineer',
    icon: 'BarChart',
    description: 'ETL Pipelines, Big Data, Analytics Engineering',
    variants: ['ETL/ELT', 'Big Data', 'Analytics', 'ML Ops'],
    color: '#8b5cf6',
    trainingTopics: {
      'ETL/ELT': ['Python', 'SQL', 'Apache Airflow', 'dbt', 'Fivetran', 'Snowflake', 'Data Modeling'],
      'Big Data': ['Hadoop', 'Apache Spark', 'Kafka', 'Hive', 'HDFS', 'Delta Lake', 'PySpark'],
      'Analytics': ['SQL Advanced', 'Power BI', 'Tableau', 'Looker', 'Dimensional Modeling', 'dbt'],
      'ML Ops': ['MLflow', 'Kubeflow', 'Feature Store', 'Model Serving', 'Data Versioning', 'Monitoring']
    }
  },
  {
    id: 'python',
    name: 'Python Developer',
    icon: 'Code',
    description: 'Web, Data Science, Automation, AI/ML',
    variants: ['Django/Flask', 'Data Science', 'Automation', 'AI/ML'],
    color: '#3776ab',
    trainingTopics: {
      'Django/Flask': ['Python Core', 'Django ORM', 'Django REST Framework', 'FastAPI', 'Celery', 'PostgreSQL'],
      'Data Science': ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn', 'Jupyter', 'Statistics', 'ML Algorithms'],
      'Automation': ['Selenium', 'Playwright', 'BeautifulSoup', 'Scrapy', 'Pytest', 'CI/CD with Python'],
      'AI/ML': ['TensorFlow', 'PyTorch', 'Transformers', 'LangChain', 'OpenAI APIs', 'Vector Databases']
    }
  },
  {
    id: 'mobile',
    name: 'Mobile Developer',
    icon: 'Smartphone',
    description: 'iOS, Android, React Native, Flutter',
    variants: ['iOS (Swift)', 'Android (Kotlin)', 'React Native', 'Flutter'],
    color: '#06b6d4',
    trainingTopics: {
      'iOS (Swift)': ['Swift Basics', 'UIKit', 'SwiftUI', 'CoreData', 'Networking', 'App Store Deployment'],
      'Android (Kotlin)': ['Kotlin', 'Jetpack Compose', 'Room DB', 'Retrofit', 'Coroutines', 'Play Store'],
      'React Native': ['React Native Basics', 'Expo', 'Navigation', 'Redux', 'Native Modules', 'Deployment'],
      'Flutter': ['Dart', 'Flutter Widgets', 'State Management', 'Firebase', 'Platform Channels']
    }
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity Analyst',
    icon: 'Shield',
    description: 'SOC, Penetration Testing, Cloud Security',
    variants: ['SOC Analyst', 'Penetration Testing', 'Cloud Security', 'AppSec'],
    color: '#ef4444',
    trainingTopics: {
      'SOC Analyst': ['SIEM Tools', 'Incident Response', 'Log Analysis', 'Threat Intelligence', 'CompTIA Security+'],
      'Penetration Testing': ['Kali Linux', 'Metasploit', 'Burp Suite', 'Network Scanning', 'OWASP Top 10', 'CEH'],
      'Cloud Security': ['AWS Security', 'Azure Sentinel', 'Zero Trust', 'IAM Policies', 'CSPM Tools'],
      'AppSec': ['SAST/DAST', 'Code Review', 'OWASP', 'Threat Modeling', 'DevSecOps']
    }
  }
];

export const companyCategories = [
  { id: 'product', name: 'Product Companies', icon: 'Sparkles' },
  { id: 'service', name: 'Service Companies', icon: 'Briefcase' },
  { id: 'startup', name: 'Startups', icon: 'Rocket' }
];

export const companies = [
  {
    id: 'google',
    name: 'Google',
    category: 'product',
    logo: 'https://www.google.com/favicon.ico',
    hiringProcess: [
      { step: 1, name: 'Online Assessment', duration: '90 mins', description: 'Coding and problem-solving on HackerRank' },
      { step: 2, name: 'Phone Screen', duration: '45 mins', description: 'Technical discussion with a Google engineer' },
      { step: 3, name: 'On-site Round 1', duration: '60 mins', description: 'Data structures and algorithms deep dive' },
      { step: 4, name: 'On-site Round 2', duration: '60 mins', description: 'System design - design YouTube or WhatsApp' },
      { step: 5, name: 'On-site Round 3', duration: '45 mins', description: 'Behavioral and Googleyness' }
    ],
    salaryRange: { min: 1200000, max: 5000000, currency: 'INR' },
    requirements: ['Strong problem-solving skills', 'Proficiency in DSA', 'System design knowledge', 'Good communication skills'],
    openPositions: 45,
    difficulty: 'Hard',
    rolesHiring: ['java', 'python', 'devops', 'data-engineer']
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    category: 'product',
    logo: 'https://www.microsoft.com/favicon.ico',
    hiringProcess: [
      { step: 1, name: 'Online Test', duration: '60 mins', description: 'Coding assessment on Codility' },
      { step: 2, name: 'Technical Round 1', duration: '60 mins', description: 'DSA and problem-solving' },
      { step: 3, name: 'Technical Round 2', duration: '60 mins', description: 'System design' },
      { step: 4, name: 'HR Round', duration: '30 mins', description: 'Behavioral and cultural fit' }
    ],
    salaryRange: { min: 1000000, max: 4500000, currency: 'INR' },
    requirements: ['Strong coding skills', 'Knowledge of algorithms', 'Team collaboration', 'Problem-solving mindset'],
    openPositions: 32,
    difficulty: 'Hard',
    rolesHiring: ['dotnet', 'java', 'devops', 'cybersecurity']
  },
  {
    id: 'amazon',
    name: 'Amazon',
    category: 'product',
    logo: 'https://www.amazon.com/favicon.ico',
    hiringProcess: [
      { step: 1, name: 'Online Assessment', duration: '105 mins', description: 'Two coding problems + work simulation' },
      { step: 2, name: 'Phone Screen', duration: '60 mins', description: 'LP + technical coding round' },
      { step: 3, name: 'Virtual Loop Round 1', duration: '60 mins', description: 'Coding + Leadership Principles' },
      { step: 4, name: 'Virtual Loop Round 2', duration: '60 mins', description: 'System design + LP' },
      { step: 5, name: 'Bar Raiser Round', duration: '60 mins', description: 'Deep dive into Leadership Principles' }
    ],
    salaryRange: { min: 1100000, max: 4200000, currency: 'INR' },
    requirements: ['Amazon Leadership Principles knowledge', 'Strong DSA skills', 'STAR method for behavioral rounds', 'Distributed systems knowledge'],
    openPositions: 60,
    difficulty: 'Hard',
    rolesHiring: ['java', 'python', 'devops', 'data-engineer']
  },
  {
    id: 'meta',
    name: 'Meta',
    category: 'product',
    logo: 'https://www.meta.com/favicon.ico',
    hiringProcess: [
      { step: 1, name: 'Recruiter Screen', duration: '30 mins', description: 'Initial conversation and background check' },
      { step: 2, name: 'Technical Phone Screen', duration: '60 mins', description: 'Two coding problems on CoderPad' },
      { step: 3, name: 'Onsite Coding 1', duration: '60 mins', description: 'Two medium/hard LeetCode-style problems' },
      { step: 4, name: 'Onsite Coding 2', duration: '60 mins', description: 'Two medium/hard LeetCode-style problems' },
      { step: 5, name: 'System Design', duration: '60 mins', description: 'Design Instagram Feed or Messenger' },
      { step: 6, name: 'Behavioral', duration: '45 mins', description: 'Meta values and past experiences' }
    ],
    salaryRange: { min: 1300000, max: 5500000, currency: 'INR' },
    requirements: ['LeetCode hard problem skills', 'Distributed systems', 'Move fast culture mindset', 'Strong communication'],
    openPositions: 28,
    difficulty: 'Hard',
    rolesHiring: ['java', 'python', 'mobile']
  },
  {
    id: 'adobe',
    name: 'Adobe',
    category: 'product',
    logo: 'https://www.adobe.com/favicon.ico',
    hiringProcess: [
      { step: 1, name: 'Online Coding Test', duration: '75 mins', description: 'HackerEarth platform - DSA problems' },
      { step: 2, name: 'Technical Round 1', duration: '60 mins', description: 'DSA and project discussion' },
      { step: 3, name: 'Technical Round 2', duration: '60 mins', description: 'Low-level design / object design' },
      { step: 4, name: 'Hiring Manager Round', duration: '45 mins', description: 'Team fit and experience mapping' }
    ],
    salaryRange: { min: 800000, max: 3000000, currency: 'INR' },
    requirements: ['Strong DSA fundamentals', 'Object-oriented design', 'Creative problem-solving', 'Relevant internship or project experience'],
    openPositions: 22,
    difficulty: 'Medium',
    rolesHiring: ['java', 'python', 'testing', 'mobile']
  },
  {
    id: 'oracle',
    name: 'Oracle',
    category: 'product',
    logo: 'https://www.oracle.com/favicon.ico',
    hiringProcess: [
      { step: 1, name: 'Written Test', duration: '60 mins', description: 'Aptitude + technical MCQ' },
      { step: 2, name: 'Technical Round 1', duration: '60 mins', description: 'Java/SQL coding and OOP' },
      { step: 3, name: 'Technical Round 2', duration: '45 mins', description: 'Database design and optimization' },
      { step: 4, name: 'HR Round', duration: '30 mins', description: 'Offer negotiation and cultural fit' }
    ],
    salaryRange: { min: 700000, max: 2500000, currency: 'INR' },
    requirements: ['Strong Java and SQL skills', 'Database design expertise', 'OOP concepts', 'Cloud fundamentals'],
    openPositions: 35,
    difficulty: 'Medium',
    rolesHiring: ['java', 'dotnet', 'data-engineer', 'sap']
  },
  {
    id: 'tcs',
    name: 'TCS',
    category: 'service',
    logo: 'https://www.tcs.com/favicon.ico',
    hiringProcess: [
      { step: 1, name: 'TCS NQT', duration: '90 mins', description: 'Quantitative, Logical, Verbal + Coding' },
      { step: 2, name: 'Technical Interview', duration: '45 mins', description: 'Core subjects and basics' },
      { step: 3, name: 'Managerial Round', duration: '30 mins', description: 'Project discussion and team fit' },
      { step: 4, name: 'HR Interview', duration: '20 mins', description: 'Background verification' }
    ],
    salaryRange: { min: 350000, max: 800000, currency: 'INR' },
    requirements: ['Good academic record (60%+)', 'Basic programming knowledge', 'Communication skills', 'Willingness to learn'],
    openPositions: 150,
    difficulty: 'Easy',
    rolesHiring: ['java', 'dotnet', 'testing', 'sap', 'salesforce']
  },
  {
    id: 'infosys',
    name: 'Infosys',
    category: 'service',
    logo: 'https://www.infosys.com/favicon.ico',
    hiringProcess: [
      { step: 1, name: 'InfyTQ Certification', duration: '120 mins', description: 'Online aptitude + programming test' },
      { step: 2, name: 'Technical Interview', duration: '45 mins', description: 'Programming concepts and projects' },
      { step: 3, name: 'HR Interview', duration: '20 mins', description: 'Salary, location, and joining discussion' }
    ],
    salaryRange: { min: 330000, max: 750000, currency: 'INR' },
    requirements: ['Basic programming in any language', 'Good aptitude score', 'Team player', 'Flexibility for relocation'],
    openPositions: 120,
    difficulty: 'Easy',
    rolesHiring: ['java', 'dotnet', 'sap', 'testing']
  },
  {
    id: 'wipro',
    name: 'Wipro',
    category: 'service',
    logo: 'https://www.wipro.com/favicon.ico',
    hiringProcess: [
      { step: 1, name: 'NLTH Test', duration: '60 mins', description: 'Aptitude + written communication + coding' },
      { step: 2, name: 'Technical Interview', duration: '45 mins', description: 'Core concepts and aptitude discussion' },
      { step: 3, name: 'HR Round', duration: '20 mins', description: 'Offer and joining formalities' }
    ],
    salaryRange: { min: 320000, max: 700000, currency: 'INR' },
    requirements: ['Consistent academic background', 'Any programming language basics', 'Good communication', 'No active backlogs'],
    openPositions: 200,
    difficulty: 'Easy',
    rolesHiring: ['java', 'dotnet', 'sap', 'testing', 'salesforce']
  },
  {
    id: 'hcl',
    name: 'HCL Technologies',
    category: 'service',
    logo: 'https://www.hcltech.com/favicon.ico',
    hiringProcess: [
      { step: 1, name: 'Online Test', duration: '60 mins', description: 'Aptitude, logical reasoning, and verbal' },
      { step: 2, name: 'Group Discussion', duration: '20 mins', description: 'Communication and group thinking' },
      { step: 3, name: 'Technical Interview', duration: '40 mins', description: 'Project and tech stack discussion' },
      { step: 4, name: 'HR Interview', duration: '20 mins', description: 'Final round' }
    ],
    salaryRange: { min: 340000, max: 780000, currency: 'INR' },
    requirements: ['Minimum 60% throughout academics', 'Basic programming', 'Good communication skills', 'Eagerness to learn'],
    openPositions: 180,
    difficulty: 'Easy',
    rolesHiring: ['java', 'dotnet', 'sap', 'devops', 'testing']
  },
  {
    id: 'cognizant',
    name: 'Cognizant',
    category: 'service',
    logo: 'https://www.cognizant.com/favicon.ico',
    hiringProcess: [
      { step: 1, name: 'GenC / GenC Next Test', duration: '75 mins', description: 'Aptitude + coding + communication' },
      { step: 2, name: 'Technical Interview', duration: '45 mins', description: 'CS fundamentals and project work' },
      { step: 3, name: 'HR Interview', duration: '20 mins', description: 'Background and offer discussion' }
    ],
    salaryRange: { min: 400000, max: 900000, currency: 'INR' },
    requirements: ['CGPA 7.5+ preferred for GenC Next', 'Programming knowledge', 'Logical thinking', 'Flexible for different time zones'],
    openPositions: 130,
    difficulty: 'Easy',
    rolesHiring: ['java', 'salesforce', 'sap', 'testing', 'dotnet']
  },
  {
    id: 'capgemini',
    name: 'Capgemini',
    category: 'service',
    logo: 'https://www.capgemini.com/favicon.ico',
    hiringProcess: [
      { step: 1, name: 'Pseudo Code Test', duration: '45 mins', description: 'Logical flow and problem-solving' },
      { step: 2, name: 'Behavioral Assessment', duration: '30 mins', description: 'Video-based behavioral round' },
      { step: 3, name: 'Technical Interview', duration: '45 mins', description: 'CS basics and project work' },
      { step: 4, name: 'HR Interview', duration: '20 mins', description: 'Final formalities' }
    ],
    salaryRange: { min: 380000, max: 850000, currency: 'INR' },
    requirements: ['No standing backlogs', 'Good logical reasoning', 'Communication skills', 'Teamwork mindset'],
    openPositions: 100,
    difficulty: 'Easy',
    rolesHiring: ['java', 'dotnet', 'sap', 'devops']
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    category: 'startup',
    logo: 'https://razorpay.com/favicon.ico',
    hiringProcess: [
      { step: 1, name: 'Coding Round', duration: '90 mins', description: 'Problem-solving on HackerEarth' },
      { step: 2, name: 'Technical Discussion', duration: '60 mins', description: 'Project deep dive + algorithms' },
      { step: 3, name: 'System Design', duration: '60 mins', description: 'Design a payment gateway or billing engine' },
      { step: 4, name: 'Cultural Fit', duration: '30 mins', description: 'Values and startup alignment' }
    ],
    salaryRange: { min: 800000, max: 2500000, currency: 'INR' },
    requirements: ['Startup mindset', 'Fast learner', 'Strong technical skills', 'Ownership attitude'],
    openPositions: 12,
    difficulty: 'Medium',
    rolesHiring: ['java', 'python', 'devops', 'data-engineer']
  },
  {
    id: 'zepto',
    name: 'Zepto',
    category: 'startup',
    logo: 'https://zeptonow.com/favicon.ico',
    hiringProcess: [
      { step: 1, name: 'Online Coding Test', duration: '60 mins', description: 'DSA questions + a practical challenge' },
      { step: 2, name: 'Tech Interview 1', duration: '60 mins', description: 'DSA and problem-solving depth' },
      { step: 3, name: 'Tech Interview 2', duration: '60 mins', description: 'System design for logistics scale' },
      { step: 4, name: 'Founder/VP Round', duration: '30 mins', description: 'Vision alignment and culture fit' }
    ],
    salaryRange: { min: 1000000, max: 3500000, currency: 'INR' },
    requirements: ['High-performance engineering mindset', 'Strong system design skills', 'Experience with high-scale systems', 'Bias for action'],
    openPositions: 8,
    difficulty: 'Hard',
    rolesHiring: ['java', 'python', 'devops', 'mobile']
  },
  {
    id: 'cred',
    name: 'CRED',
    category: 'startup',
    logo: 'https://cred.club/favicon.ico',
    hiringProcess: [
      { step: 1, name: 'Coding Assignment', duration: '3 days', description: 'Take-home project to build a working feature' },
      { step: 2, name: 'Code Review Round', duration: '60 mins', description: 'Walk through your assignment code' },
      { step: 3, name: 'System Design', duration: '60 mins', description: 'Scale the assignment to production' },
      { step: 4, name: 'Culture and Values', duration: '45 mins', description: 'CRED values and team fit' }
    ],
    salaryRange: { min: 900000, max: 3000000, currency: 'INR' },
    requirements: ['High-quality code standards', 'Product thinking', 'Strong architectural understanding', 'Member-first mindset'],
    openPositions: 6,
    difficulty: 'Hard',
    rolesHiring: ['java', 'python', 'mobile', 'devops']
  },
  {
    id: 'groww',
    name: 'Groww',
    category: 'startup',
    logo: 'https://groww.in/favicon.ico',
    hiringProcess: [
      { step: 1, name: 'Online Coding Round', duration: '75 mins', description: '2-3 DSA problems on competitive platforms' },
      { step: 2, name: 'Technical Interview 1', duration: '60 mins', description: 'Algorithms, OS, database concepts' },
      { step: 3, name: 'Technical Interview 2', duration: '60 mins', description: 'System design + fintech-specific scenarios' },
      { step: 4, name: 'Bar Raiser / Culture Fit', duration: '30 mins', description: 'Mission-driven assessment' }
    ],
    salaryRange: { min: 900000, max: 3200000, currency: 'INR' },
    requirements: ['Finance domain interest preferred', 'Strong backend or fullstack skills', 'High ownership culture', 'User-first thinking'],
    openPositions: 10,
    difficulty: 'Hard',
    rolesHiring: ['java', 'python', 'data-engineer', 'devops']
  },
  {
    id: 'meesho',
    name: 'Meesho',
    category: 'startup',
    logo: 'https://meesho.com/favicon.ico',
    hiringProcess: [
      { step: 1, name: 'Coding Test', duration: '90 mins', description: 'HackerRank - 3 coding problems' },
      { step: 2, name: 'Technical Round 1', duration: '60 mins', description: 'DSA + past project discussion' },
      { step: 3, name: 'Technical Round 2', duration: '60 mins', description: 'System design for e-commerce at scale' },
      { step: 4, name: 'Leadership Round', duration: '30 mins', description: 'Entrepreneurial mindset evaluation' }
    ],
    salaryRange: { min: 700000, max: 2800000, currency: 'INR' },
    requirements: ['Entrepreneurial mindset', 'Resilience and grit', 'Strong coding fundamentals', 'E-commerce domain curiosity'],
    openPositions: 15,
    difficulty: 'Medium',
    rolesHiring: ['java', 'python', 'mobile', 'devops', 'data-engineer']
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    category: 'startup',
    logo: 'https://swiggy.com/favicon.ico',
    hiringProcess: [
      { step: 1, name: 'Online Test', duration: '90 mins', description: 'Aptitude + 2 coding questions' },
      { step: 2, name: 'DSA Round', duration: '60 mins', description: 'Algorithmic problem-solving' },
      { step: 3, name: 'System Design', duration: '60 mins', description: 'Design Swiggy delivery allocation system' },
      { step: 4, name: 'Behavioral + Closing', duration: '30 mins', description: 'Past experience + offer' }
    ],
    salaryRange: { min: 800000, max: 2800000, currency: 'INR' },
    requirements: ['Passion for food tech / logistics', 'Strong algorithms background', 'Ability to handle distributed systems', 'Quick learner'],
    openPositions: 20,
    difficulty: 'Medium',
    rolesHiring: ['java', 'python', 'devops', 'data-engineer', 'mobile']
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    category: 'startup',
    logo: 'https://phonepe.com/favicon.ico',
    hiringProcess: [
      { step: 1, name: 'Coding Round', duration: '90 mins', description: 'HackerEarth - medium to hard problems' },
      { step: 2, name: 'Technical Round 1', duration: '60 mins', description: 'DSA, system concepts, DBMS' },
      { step: 3, name: 'Technical Round 2', duration: '60 mins', description: 'System design for payments infra' },
      { step: 4, name: 'Culture Fit + HR', duration: '30 mins', description: 'Values and compensation discussion' }
    ],
    salaryRange: { min: 900000, max: 3000000, currency: 'INR' },
    requirements: ['Fintech passion preferred', 'High-availability systems experience', 'Strong Java or Go skills', 'Attention to security and compliance'],
    openPositions: 14,
    difficulty: 'Hard',
    rolesHiring: ['java', 'devops', 'data-engineer', 'cybersecurity']
  }
];

export const learningModules = [
  {
    id: 'aptitude',
    name: 'Aptitude',
    icon: 'Calculator',
    duration: '4 weeks',
    topics: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation'],
    questionsCount: 250,
    order: 1
  },
  {
    id: 'coding',
    name: 'Coding',
    icon: 'Code',
    duration: '8 weeks',
    topics: ['Arrays', 'Strings', 'LinkedList', 'Trees', 'Graphs', 'Dynamic Programming'],
    questionsCount: 400,
    order: 2
  },
  {
    id: 'technical',
    name: 'Technical',
    icon: 'BookOpen',
    duration: '6 weeks',
    topics: ['OOP Concepts', 'Database', 'Operating Systems', 'Computer Networks'],
    questionsCount: 300,
    order: 3
  },
  {
    id: 'system-design',
    name: 'System Design',
    icon: 'Network',
    duration: '4 weeks',
    topics: ['Scalability', 'Load Balancing', 'Caching', 'Database Design', 'Microservices'],
    questionsCount: 50,
    order: 4
  },
  {
    id: 'behavioral',
    name: 'Behavioral',
    icon: 'Users',
    duration: '2 weeks',
    topics: ['STAR Method', 'Common Questions', 'Leadership', 'Conflict Resolution'],
    questionsCount: 100,
    order: 5
  }
];

// Mock tests are organized by ROLE, not by company. This is the offline fallback
// used only if the live /api/mock-tests/list call fails; it mirrors CompanyService.java.
export const mockTests = [
  { id: 'mock-java-full', title: 'Java Developer Mock Test', duration: 90, questions: 30, difficulty: 'Medium', type: 'free', sections: ['Aptitude', 'Coding', 'Technical'], role: 'java' },
  { id: 'mock-python-full', title: 'Python Developer Mock Test', duration: 90, questions: 30, difficulty: 'Medium', type: 'free', sections: ['Aptitude', 'Coding', 'Technical'], role: 'python' },
  { id: 'mock-devops-full', title: 'DevOps Engineer Mock Test', duration: 90, questions: 30, difficulty: 'Medium', type: 'free', sections: ['Aptitude', 'Coding', 'Technical'], role: 'devops' },
  { id: 'mock-dataengineer-full', title: 'Data Engineer Mock Test', duration: 90, questions: 30, difficulty: 'Medium', type: 'free', sections: ['Aptitude', 'Coding', 'Technical'], role: 'data-engineer' },
  { id: 'mock-testing-full', title: 'QA/Testing Mock Test', duration: 90, questions: 30, difficulty: 'Medium', type: 'free', sections: ['Aptitude', 'Coding', 'Technical'], role: 'testing' },
  { id: 'mock-dotnet-full', title: '.NET Developer Mock Test', duration: 90, questions: 30, difficulty: 'Medium', type: 'free', sections: ['Aptitude', 'Coding', 'Technical'], role: 'dotnet' },
  { id: 'mock-mobile-full', title: 'Mobile Developer Mock Test', duration: 90, questions: 30, difficulty: 'Medium', type: 'free', sections: ['Aptitude', 'Coding', 'Technical'], role: 'mobile' },
  { id: 'mock-salesforce-full', title: 'Salesforce Developer Mock Test', duration: 90, questions: 30, difficulty: 'Medium', type: 'free', sections: ['Aptitude', 'Coding', 'Technical'], role: 'salesforce' },
  { id: 'mock-sap-full', title: 'SAP Consultant Mock Test', duration: 90, questions: 30, difficulty: 'Medium', type: 'free', sections: ['Aptitude', 'Coding', 'Technical'], role: 'sap' },
  { id: 'mock-cybersecurity-full', title: 'Cybersecurity Analyst Mock Test', duration: 90, questions: 30, difficulty: 'Medium', type: 'free', sections: ['Aptitude', 'Coding', 'Technical'], role: 'cybersecurity' },
  { id: 'mock-java-coding', title: 'Java Coding Round', duration: 90, questions: 6, difficulty: 'Hard', type: 'paid', sections: ['Coding'], role: 'java' },
  { id: 'mock-python-coding', title: 'Python Coding Round', duration: 90, questions: 6, difficulty: 'Hard', type: 'paid', sections: ['Coding'], role: 'python' },
  { id: 'mock-devops-coding', title: 'DevOps Coding & Scripting Round', duration: 90, questions: 6, difficulty: 'Hard', type: 'paid', sections: ['Coding'], role: 'devops' },
  { id: 'mock-dataengineer-coding', title: 'Data Engineering Coding Round', duration: 90, questions: 6, difficulty: 'Hard', type: 'paid', sections: ['Coding'], role: 'data-engineer' },
  { id: 'mock-dotnet-coding', title: '.NET Coding Round', duration: 90, questions: 6, difficulty: 'Hard', type: 'paid', sections: ['Coding'], role: 'dotnet' },
  { id: 'mock-aptitude', title: 'Aptitude & Reasoning Test', duration: 60, questions: 30, difficulty: 'Easy', type: 'free', sections: ['Aptitude'], role: null },
  { id: 'mock-systemdesign', title: 'System Design Round', duration: 60, questions: 3, difficulty: 'Hard', type: 'paid', sections: ['System Design'], role: null },
  { id: 'mock-behavioral', title: 'Behavioral / HR Round', duration: 45, questions: 20, difficulty: 'Medium', type: 'free', sections: ['Behavioral'], role: null }
];

export const paidServices = [
  {
    id: 'one-on-one-mock',
    name: 'One-on-One Mock Interview',
    description: 'Personalized mock interview with industry experts',
    price: 999,
    duration: '60 mins',
    features: ['Live interview with expert', 'Detailed feedback', 'Performance report', 'Areas of improvement', 'Schedule as per convenience'],
    icon: 'UserCheck'
  },
  {
    id: 'mentorship',
    name: 'Personal Mentorship',
    description: 'Get guided by experienced professionals',
    price: 4999,
    duration: '1 month',
    features: ['4 one-on-one sessions', 'Career guidance', 'Resume review', 'Interview preparation', 'Doubt clearing'],
    icon: 'Award'
  },
  {
    id: 'resume-review',
    name: 'Resume Review and Optimization',
    description: 'Get your resume reviewed by hiring managers from top companies',
    price: 499,
    duration: '3-day turnaround',
    features: ['ATS score analysis', 'Expert written feedback', 'Keyword optimization', 'Two revision rounds', 'LinkedIn profile tips'],
    icon: 'FileText'
  },
  {
    id: 'company-prep',
    name: 'Company-Specific Prep Pack',
    description: 'Hyper-focused preparation for a single company of your choice',
    price: 1499,
    duration: '2 weeks access',
    features: ['Previous interview questions', 'Company culture insights', 'Role-specific study plan', 'Expert tips and strategies', 'Company-specific mock test'],
    icon: 'Building'
  }
];

export const userProgress = {
  selectedRole: 'java',
  selectedVariant: 'Full Stack',
  completedModules: ['aptitude', 'coding'],
  currentModule: 'technical',
  overallProgress: 40,
  testsTaken: 5,
  averageScore: 78
};
