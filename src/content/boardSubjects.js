// BISE Lahore subject choices grouped by class and stream. “Other” remains available
// in NotesAdmin for campus subjects that are outside these board lists.
const matricCore = ['Urdu', 'English', 'Translation of the Holy Quran', 'Ethics (Non-Muslim)', 'Islamiyat', 'Religious Education (Non-Muslim)', 'Pakistan Studies', 'Mathematics'];
const matricScience = ['General Science', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Computer Science & Entrepreneurship'];
const matricHumanities = [
  'General Mathematics', 'Civics', 'Education', 'Economics', 'Elements of Home Economics',
  'Physiology & Hygiene', 'Geography', 'Food & Nutrition', 'Clothing & Textiles', 'Military Science',
  'History of Pakistan', 'History (Islamic / Muslim)', 'English Literature', 'Urdu Literature',
  'Art and Model Drawing', 'Persian', 'Arabic', 'Punjabi', 'Saraiki', 'Advanced Islamic Studies',
  'Health and Physical Education', 'Commercial Geography', 'Poultry Farming', 'Dress Making & Fashion Designing',
  'Environmental Studies', 'Seerat-ul-Rasool', 'Al-Quran', 'Al-Hadith', 'Electrical Wiring', 'Fish Farming',
  'Geometrical & Technical Drawing', 'Repair & Maintenance of Domestic Refrigerator / Air Conditioner',
  'Computer Hardware', 'Business Studies', 'Wood Working', 'Beautician', 'Auto Mechanic',
];
const interCore11 = ['English', 'Urdu', 'Pakistani Culture (Foreign Students)', 'Islamic Education', 'Religious Education (Non-Muslim)', 'Translation of the Holy Quran', 'Ethics (Non-Muslim)'];
const interCore12 = ['English', 'Urdu', 'Pakistani Culture (Foreign Students)', 'Pakistan Studies', 'Translation of the Holy Quran', 'Ethics (Non-Muslim)'];
const interScience = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Statistics', 'Economics', 'Computer Science & Entrepreneurship'];
const interHumanities = [
  'History of Islam', 'History of Muslim India', 'History of Pakistan', 'History of Modern World',
  'Economics', 'Geography', 'Military Science', 'Philosophy', 'Psychology', 'Statistics',
  'Islamic Studies', 'Outlines of Home Economics', 'Music', 'Fine Arts', 'Arabic', 'English Elective',
  'French', 'German', 'Punjabi', 'Pashto', 'Persian', 'Sindhi', 'Urdu Advance',
  'Health and Physical Education', 'Education', 'Geology', 'Sociology', 'Library Science',
  'Computer Science and Entrepreneurship', 'Agriculture', 'Civics', 'Nursing', 'Commercial Practices', 'Mathematics',
  'Saraiki', 'Balochi',
];
const interCommerce = ['Principles of Accounting', 'Principles of Economics', 'Principles of Commerce', 'Business Mathematics', 'Commercial Geography', 'Computer Studies / Computer Science', 'Banking', 'Statistics'];
const interHomeEconomics = ['Biology and Chemistry', 'Home Management', 'Clothing and Textiles', 'Applied Art', 'Food and Nutrition', 'Child Development and Family Living'];
const interIslamicStudies = ['Arabic', 'Islamic Studies', 'Islamic History and Culture'];
const interMedicalTechnology = ['Medical Laboratory Technology', 'Dental Hygiene Technology', 'Operation Theatre Technology', 'Medical Imaging Technology', 'Physiotherapy Technology', 'Ophthalmic Technology'];

export const boardSubjectsByClass = {
  '9': [
    { label: 'Core and compulsory subjects', options: [...matricCore.slice(0, 6), ...matricScience.slice(0, 1)] },
    { label: 'Science group choices', options: matricScience.slice(1) },
    { label: 'Humanities electives', options: matricHumanities },
  ],
  '10': [
    { label: 'Core and compulsory subjects', options: [...matricCore.slice(0, 4), ...matricCore.slice(6), ...matricScience.slice(0, 1)] },
    { label: 'Science group choices', options: matricScience.slice(1) },
    { label: 'Humanities electives', options: matricHumanities },
  ],
  '11': [
    { label: 'Core and compulsory subjects', options: interCore11 },
    { label: 'Pre-medical / Pre-engineering / General Science', options: interScience },
    { label: 'Humanities electives', options: interHumanities },
    { label: 'Commerce group', options: interCommerce },
    { label: 'Home Economics group', options: interHomeEconomics },
    { label: 'Islamic Studies group', options: interIslamicStudies },
    { label: 'Medical Technology groups', options: interMedicalTechnology },
  ],
  '12': [
    { label: 'Core and compulsory subjects', options: interCore12 },
    { label: 'Pre-medical / Pre-engineering / General Science', options: interScience },
    { label: 'Humanities electives', options: interHumanities },
    { label: 'Commerce group', options: interCommerce },
    { label: 'Home Economics group', options: interHomeEconomics },
    { label: 'Islamic Studies group', options: interIslamicStudies },
    { label: 'Medical Technology groups', options: interMedicalTechnology },
  ],
};
