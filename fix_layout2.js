const fs = require('fs');

const lines = fs.readFileSync('public/admin.html', 'utf8').split('\n');

// 1. Identify the line index for `</div><!-- end page-area -->`
let pageAreaEndIndex = -1;
for(let i=0; i<lines.length; i++) {
    if(lines[i].includes('</div><!-- end page-area -->')) {
        pageAreaEndIndex = i;
        break;
    }
}

console.log("pageAreaEndIndex:", pageAreaEndIndex);

// We need to extract the PAGES:
// - UNIFIED PORTAL USERS PANEL (which is page-portal-users)
// - USERS MANAGEMENT PANEL (which is page-users)
// - EXAM & RANK MANAGEMENT PANEL (which is page-exams)

// We'll extract them using our HTML tag balancer to be completely safe!

function extractPage(pageId) {
    let startIdx = -1;
    let endIdx = -1;
    let inPage = false;
    let divs = 0;
    
    // Find where the block comment starts for this page
    // We look upwards from the pageId line
    for(let i=0; i<lines.length; i++) {
        if(lines[i].includes(`id="${pageId}"`)) {
            startIdx = i;
            // Look up for the comment block
            if (lines[i-1] && lines[i-1].includes('-->')) {
                if (lines[i-2] && lines[i-2].includes('PANEL')) {
                    if (lines[i-3] && lines[i-3].includes('═══')) {
                         startIdx = i-3;
                    }
                }
            }
            break;
        }
    }
    
    if (startIdx === -1) return null;
    
    // Find where it ends
    for(let i=startIdx; i<lines.length; i++) {
        const l = lines[i];
        if (l.includes(`id="${pageId}"`)) inPage = true;
        if (inPage) {
            divs += (l.match(/<div/g) || []).length;
            divs -= (l.match(/<\/div/g) || []).length;
            if (divs === 0) {
                endIdx = i;
                break;
            }
        }
    }
    
    if (startIdx !== -1 && endIdx !== -1) {
        // Extract lines
        const extracted = lines.slice(startIdx, endIdx + 1);
        // Remove from original array (replace with empty strings for now to not mess up indexes)
        for(let i=startIdx; i<=endIdx; i++) {
            lines[i] = "DELETE_ME";
        }
        return extracted.join('\n');
    }
    return null;
}

const pagePortal = extractPage('page-portal-users');
const pageUsers = extractPage('page-users');
const pageExams = extractPage('page-exams');

console.log("Extracted Portal:", !!pagePortal);
console.log("Extracted Users:", !!pageUsers);
console.log("Extracted Exams:", !!pageExams);

// Now, remove all 'DELETE_ME' lines
const cleanLines = lines.filter(l => l !== "DELETE_ME");

// Find the new pageAreaEndIndex in cleanLines
let newPageAreaEndIndex = -1;
for(let i=0; i<cleanLines.length; i++) {
    if(cleanLines[i].includes('</div><!-- end page-area -->')) {
        newPageAreaEndIndex = i;
        break;
    }
}

// Insert the extracted pages right before `</div><!-- end page-area -->`
if (newPageAreaEndIndex !== -1) {
    const pagesToInsert = [pagePortal, pageUsers, pageExams].filter(Boolean).join('\n\n');
    cleanLines.splice(newPageAreaEndIndex, 0, pagesToInsert);
    
    fs.writeFileSync('public/admin.html', cleanLines.join('\n'));
    console.log("Successfully moved pages into page-area!");
} else {
    console.log("Could not find page-area end marker.");
}

