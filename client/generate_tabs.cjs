const fs = require('fs');

const baseContent = fs.readFileSync('src/topics/INTERVIEW_SYS.jsx', 'utf8');

const generate = (name, category, emoji, apiPrefix) => {
  let content = baseContent
    .replace(/INTERVIEW_SYS/g, `INTERVIEW_${name.toUpperCase()}`)
    .replace(/fetchSystemDesignQuestions/g, `fetch${apiPrefix}Questions`)
    .replace(/addSystemDesignQuestion/g, `add${apiPrefix}Question`)
    .replace(/updateSystemDesignQuestion/g, `update${apiPrefix}Question`)
    .replace(/deleteSystemDesignQuestion/g, `delete${apiPrefix}Question`)
    .replace(/System Design Question/g, `${category} Question`)
    .replace(/System Design/g, category)
    .replace(/📐/g, emoji)
    .replace(/SYSTEM/g, name.toUpperCase());

  fs.writeFileSync(`src/topics/INTERVIEW_${name.toUpperCase()}.jsx`, content);
}

generate('manager', 'Manager Round', '👔', 'Manager');
generate('hr', 'HR Round', '🤝', 'Hr');
generate('project', 'Project Explanation', '🚀', 'Project');
