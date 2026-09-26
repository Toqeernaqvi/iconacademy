// This is the only file you need to edit for day-to-day website updates.
// Replace the social URLs below with Icon Academy Lahore's exact profile links.

export const academy = {
  name: 'Icon Academy',
  location: 'Lahore, Pakistan',
  description: 'Academic learning and practical computer training in Lahore.',
  facebook: 'https://www.facebook.com/iconacademylahore',
  address: 'Umar Khan Road, Rizwan Garden, The Spirit School, Canal Road, Lahore.',
  mapsUrl: 'https://www.google.com/maps/dir//The+Icon+Academy,+Rizwan+Gardens+Lahore,+54850/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x391911001d1fedb5:0xa20fabff3176073?sa=X&ved=1t:57443&ictx=111',
  email: '',
  phone: '',
  whatsappNumber: '923090833501', // Admissions: Sir Fida Hussain; international format without +
};

export const socialLinks = [
  { label: 'YouTube', href: 'https://www.youtube.com/@iconacademylahore', color: 'red' },
  { label: 'Instagram', href: 'http://instagram.com/iconacademyrizwan?utm_source=qr&stkn=NWxrYnF3eDViMDRu', color: 'pink' },
  { label: 'Facebook', href: 'https://www.facebook.com/iconacademylahore', color: 'blue' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@iconacademylahore', color: 'ink' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/code-with-naqvi/', color: 'sky' },
];

export const globalPartner = {
  name: 'CWN Solutions',
  eyebrow: 'Global Career Partner',
  logo: '/images/cwn-solutions-logo.svg',
  url: 'https://www.linkedin.com/company/code-with-naqvi/',
  youtube: 'https://www.youtube.com/@CodeWithNaqvi',
  description: 'A professional pathway where Icon Academy web development students can move from classroom learning to real industry experience.',
  highlights: ['Professional project exposure', 'Career-focused mentorship', 'Opportunities for job-ready students'],
};

export const programs = [
  {
    number: '01',
    title: 'Kids',
    description: 'Supportive learning that helps young students build strong concepts, confidence and better study habits.',
    tags: ['Concept building', 'Core skills', 'Confidence'],
    accent: 'yellow',
  },
  {
    number: '02',
    title: 'Matric',
    description: 'Focused academic preparation for 9th and 10th class students with guidance for board examinations.',
    tags: ['9th class', '10th class', 'Board preparation'],
    accent: 'coral',
  },
  {
    number: '03',
    title: 'Intermediate',
    description: 'Structured learning support for first-year and second-year students preparing for their next academic step.',
    tags: ['1st year', '2nd year', 'Exam preparation'],
    accent: 'mint',
  },
  {
    number: '04',
    title: 'Computer Courses',
    description: 'Professional and practical computer training that turns digital knowledge into useful, career-ready skills.',
    tags: ['Digital skills', 'Professional tools', 'Practical training'],
    accent: 'blue',
  },
];

// Replace each placeholder path with the teacher’s photo when available.
export const facultyMembers = [
  { name: 'Sir Fakhar Abbas', designation: 'Chemistry Teacher', image: '/images/team/teacher-placeholder.svg' },
  { name: 'Sir Talha', designation: 'Teacher', image: '/images/team/teacher-placeholder.svg' },
  { name: 'Miss Eman Khan', designation: 'Teacher', image: '/images/team/teacher-placeholder.svg' },
  { name: 'Miss Eman Fatima', designation: 'Teacher', image: '/images/team/teacher-placeholder.svg' },
  { name: 'Miss Saliha', designation: 'Teacher', image: '/images/team/teacher-placeholder.svg' },
  { name: 'Miss Sofia', designation: 'Teacher', image: '/images/team/teacher-placeholder.svg' },
];

export const teamMembers = [
  {
    name: 'Ali Raza Jafri',
    designation: 'Director, Group of Icon Academies',
    image: '/images/team/ali-raza-jafri.jpg',
    imagePosition: 'center 24%',
    description: 'Provides strategic direction across the academy group and supports its commitment to quality education and student growth.',
  },
  {
    name: 'Syed Toqeer Abbas',
    designation: 'CEO, The Icon Academy — Rizwan Garden Campus',
    image: '/images/team/syed-toqeer-abbas.jpg',
    imagePosition: 'center 30%',
    description: 'Leads the campus vision with a focus on practical learning, digital skills and meaningful opportunities for students.',
  },
  {
    name: 'Fida Hussain Jafri',
    designation: 'Managing Director, Rizwan Garden Campus',
    image: '/images/team/fida-hussain-jafri.jpg',
    imagePosition: 'center 35%',
    imageScale: 1.12,
    imageOrigin: 'right center',
    description: 'Oversees campus operations and helps create a focused, supportive and well-managed learning environment.',
  },
];

export const computerCourses = [
  {
    code: '08',
    title: 'Full Stack Web Development',
    duration: '1 Year',
    regularFee: 'Rs. 10,000 / month',
    discountedFee: 'Rs. 5,000 / month',
    icon: 'code',
    category: 'Development',
    description: 'Turn ideas into complete websites, from your first page to full-stack projects.',
    technologies: [{ name: 'React', image: '/images/technologies/react.svg' }, { name: 'HTML', image: '/images/technologies/html5.svg' }, { name: 'CSS', image: '/images/technologies/css.svg' }, { name: 'JavaScript', image: '/images/technologies/javascript.svg' }],
    topics: ['HTML, CSS & JavaScript', 'Bootstrap / Tailwind CSS', 'React.js', 'Databases & MySQL', 'PHP / Laravel', 'Full-stack projects'],
  },
  {
    code: '09',
    title: 'Python Programming Foundation',
    duration: '3 Months',
    regularFee: 'Rs. 30,000',
    discountedFee: 'Rs. 5,000 / month',
    icon: 'python',
    category: 'Development',
    description: 'Start coding with clear fundamentals and bring your logic to life with mini projects.',
    technologies: [{ name: 'Python', image: '/images/technologies/python.svg' }],
    topics: ['Python basics', 'Logic building', 'Functions', 'File handling', 'Mini projects'],
  },
  {
    code: '10',
    title: 'C++ Programming Foundation',
    duration: '3 Months',
    regularFee: 'Rs. 30,000',
    discountedFee: 'Rs. 5,000 / month',
    icon: 'cpp',
    category: 'Development',
    description: 'Build a strong programming foundation, one problem and one solution at a time.',
    technologies: [{ name: 'C++', image: '/images/technologies/cplusplus.svg' }],
    topics: ['Programming basics', 'Loops', 'Arrays', 'Functions', 'OOP fundamentals'],
  },
  {
    code: '11',
    title: 'Digital Marketing',
    duration: '3 Months',
    regularFee: 'Rs. 30,000',
    discountedFee: 'Rs. 5,000 / month',
    icon: 'marketing',
    category: 'Marketing',
    description: 'Learn how brands reach people through search, social media and digital campaigns.',
    technologies: [{ name: 'Google Ads', image: '/images/technologies/googleads.svg' }],
    topics: ['Social media marketing', 'SEO basics', 'Content strategy', 'Ads basics', 'Branding'],
  },
  {
    code: '12',
    title: 'Spoken English',
    duration: '3 Months',
    regularFee: 'Rs. 30,000',
    discountedFee: 'Rs. 5,000 / month',
    icon: 'spoken',
    category: 'Communication',
    description: 'Find your voice with conversation practice, pronunciation and everyday English.',
    topics: ['Conversation practice', 'Vocabulary', 'Pronunciation', 'Confidence building', 'Interview speaking'],
  },
  {
    code: '13',
    title: 'Video Editing',
    duration: '3 Months',
    regularFee: 'Rs. 30,000',
    discountedFee: 'Rs. 5,000 / month',
    icon: 'video',
    category: 'Creative',
    description: 'Turn raw footage into engaging stories with editing, titles and creative tools.',
    technologies: [{ name: 'Filmora', image: '/images/technologies/wondersharefilmora.svg' }],
    topics: ['Filmora', 'AI tools', 'Cutting', 'Transitions', 'Titles', 'Social media editing'],
  },
];

export const onlineTutoring = {
  eyebrow: 'The Icon Academy · Online learning',
  title: 'Learn a skill.',
  titleAccent: 'Create your next chapter.',
  description: 'Code your first website, explore digital marketing or find your creative voice. Build practical skills from home with online courses at The Icon Academy.',
  classes: [
    { title: 'Primary classes', detail: 'Class 1–5', description: 'Build strong foundations in English, Mathematics, Science and everyday learning.' },
    { title: 'Middle classes', detail: 'Class 6–8', description: 'Strengthen subject concepts, work through questions and get support with school learning.' },
    { title: 'Matric', detail: 'Class 9–10', description: 'Focused subject guidance, revision and preparation for board examinations.' },
    { title: 'Intermediate', detail: 'Class 11–12', description: 'Online subject support for first-year and second-year students, from concepts to exam preparation.' },
    { title: 'Other classes & higher studies', detail: 'Tell us what you are studying', description: 'Share your class, subject and syllabus so we can discuss suitable online teaching support.' },
  ],
  steps: [
    { title: 'Tell us your learning goal', description: 'Send your class, subjects or preferred course on WhatsApp, along with your current level.' },
    { title: 'Discuss your classes', description: 'Confirm the syllabus, teacher availability, online class timings and fees with our team.' },
    { title: 'Start learning online', description: 'Our team will share joining details and guide you through what you need for your lessons.' },
  ],
};

export const courseContacts = [
  { name: 'Syed Toqeer Abbas', qualification: 'Computer Courses Instructor', phone: '0307-8875229', whatsapp: '923078875229' },
  { name: 'Sir Fida Hussain', qualification: 'Managing Director', phone: '0309-0833501', whatsapp: '923090833501' },
];

// To publish a story, duplicate an object, give it a unique slug, then push to GitHub.
// Vercel will rebuild the website automatically.
export const articles = [
  {
    slug: 'practical-it-training',
    category: 'IT learning',
    date: 'September 18, 2026',
    readTime: '4 min read',
    title: 'Why practical IT training makes a difference',
    excerpt: 'Technology becomes useful when learners move beyond theory and practise with real tools and projects.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85',
    body: [
      'Knowing what a tool does is only the beginning. Real confidence comes from opening the software, completing a task and understanding how to solve the next problem independently.',
      'Icon Academy focuses on professional and practical IT training. Guided exercises and project work help learners connect concepts with the skills expected in further study and work.',
      'Every expert started with the basics. Consistent practice, useful feedback and a willingness to keep learning are what turn digital knowledge into a dependable skill.',
    ],
  },
  {
    slug: 'choosing-your-first-it-course',
    category: 'Student guide',
    date: 'September 10, 2026',
    readTime: '6 min read',
    title: 'How to choose your first IT course',
    excerpt: 'Start with your current level, the work you want to do and a course that gives you time to practise.',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85',
    body: [
      'A useful first course should match both your present skills and your goal. Beginners may need digital foundations, while learners with the basics can move into creative, freelance or development skills.',
      'Look for practical exercises and clear outcomes. By the end of a course, you should be able to point to work you completed and explain the process behind it.',
      'If you are unsure where to start, contact the academy through Facebook and ask about current batches, timings and entry requirements.',
    ],
  },
  {
    slug: 'admissions-and-batch-updates',
    category: 'News',
    date: 'September 01, 2026',
    readTime: '3 min read',
    title: 'Get the latest admissions and batch updates',
    excerpt: 'Follow the official Icon Academy Lahore Facebook page for current course announcements and academy news.',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=85',
    body: [
      'Course availability, admission dates and class timings can change as new batches are organised.',
      'The official Facebook page is the best place to see current public announcements from Icon Academy Lahore.',
      'Use the Facebook feed on this website or visit the page directly to check the latest information before enrolling.',
    ],
  },
];

// Illustrative content only: replace with permission-cleared student feedback.
// Set isSample to false only after replacing the name, quote and rating with a real review.
export const testimonials = [
  { id: 'review-01', name: 'Sample learner 01', course: 'Full Stack Web Development', rating: 5, quote: 'Building a page step by step helped HTML and CSS make sense to me.', isSample: true },
  { id: 'review-02', name: 'Sample learner 02', course: 'Python Programming Foundation', rating: 4.5, quote: 'The small exercises helped me get more comfortable with programming logic.', isSample: true },
  { id: 'review-03', name: 'Sample learner 03', course: 'Digital Marketing', rating: 5, quote: 'I enjoyed connecting content ideas with the audience a brand wants to reach.', isSample: true },
  { id: 'review-04', name: 'Sample learner 04', course: 'Spoken English', rating: 4.5, quote: 'Conversation practice gave me a reason to speak English more regularly.', isSample: true },
  { id: 'review-05', name: 'Sample learner 05', course: 'Video Editing', rating: 5, quote: 'Working with cuts and titles helped me turn separate clips into a story.', isSample: true },
  { id: 'review-06', name: 'Sample learner 06', course: 'C++ Programming Foundation', rating: 4.5, quote: 'Breaking problems into smaller steps made loops and functions easier to follow.', isSample: true },
  { id: 'review-07', name: 'Sample learner 07', course: 'Full Stack Web Development', rating: 5, quote: 'I liked seeing how the layout, styling and JavaScript fit together in a project.', isSample: true },
  { id: 'review-08', name: 'Sample learner 08', course: 'Python Programming Foundation', rating: 5, quote: 'Writing my own functions was a useful step beyond copying code examples.', isSample: true },
  { id: 'review-09', name: 'Sample learner 09', course: 'Digital Marketing', rating: 4.5, quote: 'The content strategy topics helped me organise ideas for a social media page.', isSample: true },
  { id: 'review-10', name: 'Sample learner 10', course: 'Video Editing', rating: 5, quote: 'Practising transitions helped me understand when a simple edit works best.', isSample: true },
  { id: 'review-11', name: 'Sample learner 11', course: 'Spoken English', rating: 5, quote: 'Everyday speaking topics made vocabulary practice feel useful and approachable.', isSample: true },
  { id: 'review-12', name: 'Sample learner 12', course: 'C++ Programming Foundation', rating: 4.5, quote: 'Array exercises helped me understand how to work with a collection of values.', isSample: true },
  { id: 'review-13', name: 'Sample learner 13', course: 'Full Stack Web Development', rating: 4.5, quote: 'Learning about databases helped me see what happens behind a website.', isSample: true },
  { id: 'review-14', name: 'Sample learner 14', course: 'Python Programming Foundation', rating: 5, quote: 'Mini projects gave me a way to practise several concepts together.', isSample: true },
  { id: 'review-15', name: 'Sample learner 15', course: 'Digital Marketing', rating: 5, quote: 'SEO basics helped me think more carefully about how people discover content.', isSample: true },
  { id: 'review-16', name: 'Sample learner 16', course: 'Video Editing', rating: 4.5, quote: 'I enjoyed experimenting with titles and pacing for short social media videos.', isSample: true },
  { id: 'review-17', name: 'Sample learner 17', course: 'Spoken English', rating: 4.5, quote: 'Pronunciation practice helped me notice sounds I used to rush through.', isSample: true },
  { id: 'review-18', name: 'Sample learner 18', course: 'C++ Programming Foundation', rating: 5, quote: 'The introduction to objects gave me a new way to organise a program.', isSample: true },
  { id: 'review-19', name: 'Sample learner 19', course: 'Full Stack Web Development', rating: 5, quote: 'React practice helped me understand how reusable components make a page easier to build.', isSample: true },
  { id: 'review-20', name: 'Sample learner 20', course: 'Python Programming Foundation', rating: 4.5, quote: 'File handling exercises showed me how a program can save and reuse information.', isSample: true },
];
