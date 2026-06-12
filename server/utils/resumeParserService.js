const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// A predefined list of common technical skills
const TECH_SKILLS = [
  'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'go', 'rust',
  'react', 'angular', 'vue', 'svelte', 'next.js', 'node.js', 'express', 'django', 'flask',
  'spring boot', 'laravel', 'ruby on rails', 'html', 'css', 'sass', 'tailwind', 'bootstrap',
  'mysql', 'postgresql', 'mongodb', 'sqlite', 'redis', 'cassandra', 'elasticsearch',
  'aws', 'azure', 'google cloud', 'docker', 'kubernetes', 'jenkins', 'github actions', 'gitlab ci',
  'git', 'linux', 'unix', 'bash', 'powershell', 'typescript', 'graphql', 'rest api',
  'machine learning', 'data analysis', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch'
];

/**
 * Parses a PDF resume and extracts technical skills
 * @param {string} resumePath - The relative path to the resume (e.g., 'uploads/resumes/123.pdf')
 * @returns {Promise<string[]>} - Array of extracted skills
 */
const parseResumeForSkills = async (resumePath) => {
  try {
    // Construct absolute path
    // Remove leading slashes/backslashes to prevent resolving to root of drive
    const normalizedPath = resumePath.replace(/^[\\/]+/, '');
    const absolutePath = path.join(__dirname, '..', normalizedPath);
    
    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Resume file not found on disk: ${absolutePath}`);
    }

    // Read the PDF
    const dataBuffer = fs.readFileSync(absolutePath);
    
    // Parse the PDF
    let data;
    try {
      data = await pdfParse(dataBuffer);
    } catch (parseErr) {
      throw new Error(`PDF parsing failed. Ensure the file is a valid PDF. Internal error: ${parseErr.message}`);
    }

    const text = data.text.toLowerCase();

    // Find matching skills
    const extractedSkills = new Set();
    
    // We use word boundaries \b to avoid matching sub-words (e.g. 'go' in 'good')
    TECH_SKILLS.forEach(skill => {
      // Escape special characters in skill names for regex (e.g. C++)
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
      if (regex.test(text)) {
        extractedSkills.add(skill);
      }
    });

    // Return unique skills array
    return Array.from(extractedSkills);

  } catch (error) {
    console.error('Error parsing resume:', error);
    // Rethrow exact error so it bubbles up to the frontend
    throw new Error(error.message);
  }
};

module.exports = {
  parseResumeForSkills
};
