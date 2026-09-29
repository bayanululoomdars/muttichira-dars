const fs = require('fs');

// Patch admissionController.js
let admissionCode = fs.readFileSync('controllers/admissionController.js', 'utf8');
const tgRegex = /const tgMessage = \[[\s\S]*?\]\.join\('\\n'\);/;
const replacement = `const tgMessage = [
      \`🎓 <b>NEW ADMISSION APPLICATION RECEIVED</b>\`,
      \`<b>Bayanul Uloom Dars, Muttichira</b>\`,
      \`\`,
      \`A new admission application has been submitted.\`,
      \`For privacy and security reasons, applicant details are kept secret.\`,
      \`\`,
      \`🕒 Submitted: \${now}\`,
      \`\`,
      \`🔐 <i>Please log in to the admin panel to view the full details.</i>\`
    ].join('\\n');`;
admissionCode = admissionCode.replace(tgRegex, replacement);
fs.writeFileSync('controllers/admissionController.js', admissionCode);

// Patch contactController.js
let contactCode = fs.readFileSync('controllers/contactController.js', 'utf8');
const tgRegexContact = /const tgMessage = `[^`]+`;/;
const replacementContact = `const tgMessage = \`📩 <b>NEW CONTACT MESSAGE RECEIVED</b>\\n\\nA new message was submitted via the website contact form.\\nFor privacy, details are kept secret.\\n🔐 <i>Please check the admin panel to read the message.</i>\`;`;
contactCode = contactCode.replace(tgRegexContact, replacementContact);
fs.writeFileSync('controllers/contactController.js', contactCode);

console.log("Patched successfully!");
