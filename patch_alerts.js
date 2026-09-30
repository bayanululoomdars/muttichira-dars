const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');

// Replace showAlert inside the matrix functions with standard alert
// We know they are inside submitExamMarksUsthad
html = html.replace(/showAlert\('Please select a valid Exam and Class with students', "warning"\);/g, "alert('Please select a valid Exam and Class with students');");
html = html.replace(/showAlert\(res\.message \|\| 'Marks and Ranks published!', res\.success \? "success" : "danger"\);/g, "alert(res.message || 'Marks and Ranks published!');");
html = html.replace(/showAlert\('Error publishing exam marks', "warning"\);/g, "alert('Error publishing exam marks');");

// Also, the button says `<button class="btn btn-primary" onclick="loadUsthadExamMatrix()">`
// Let's make sure the save button says `<button class="btn btn-accent mt-3" style="width:100%;" onclick="submitExamMarksUsthad()">`
// Actually, earlier in the HTML block, it might not have the save button!
// In admin.html, the save button was at the bottom of the table?
fs.writeFileSync('public/login.html', html);
console.log('Fixed alerts in matrix');
