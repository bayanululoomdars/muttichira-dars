const fs = require('fs');
let html = fs.readFileSync('public/admin.html', 'utf8');

// The layout closing tags are around line 1779:
//      </div><!-- end page-area -->
//    </div><!-- end main-content -->
//  </div><!-- end app-layout -->
//</div><!-- end dashboard -->

const layoutClosings = `      </div><!-- end page-area -->
    </div><!-- end main-content -->
  </div><!-- end app-layout -->
</div><!-- end dashboard -->`;

// We will REMOVE these closing tags from their current position.
html = html.replace(layoutClosings, '');

// Now we need to PUT them back right after page-exams!
// page-exams closes right before `<!-- Create Exam Modal -->`.
// Let's find: `        <!-- Create Exam Modal -->`
// And we insert the layoutClosings right before it!

// Actually, wait! The user added Modals (like admissionModal, etc) between the old layout closings and page-portal-users!
// So if I just move the closings, all those Modals (admissionModal, etc) will end up INSIDE the main-content! That's BAD! Modals should be at the root body level.

// The correct approach:
// 1. EXTRACT page-portal-users, page-users, and page-exams (and maybe formAddStudent/unifiedAddUserModal? NO, modals stay out).
// Wait, unifiedAddUserModal is currently AT THE ROOT (after page-portal-users). It's fine for it to stay at the root.

// Let's extract the Pages precisely!
// I'll extract from `<!-- ════════════════════════════════\n             UNIFIED PORTAL USERS PANEL` 
// to the end of `page-users` and `page-exams`.
// Actually, it's easier to find the chunks.
