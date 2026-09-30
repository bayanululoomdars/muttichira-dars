const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    
    await page.goto('http://localhost:10000/admin.html');
    
    // login
    await page.type('#adminKey', 'albayan@2025');
    await page.click('button[onclick="submitAdminLogin()"]');
    await page.waitForTimeout(2000);
    
    // click users tab
    await page.click('a[onclick="showPanel(\'usersPanel\')"]');
    await page.waitForTimeout(2000);
    
    // log buttons
    const btns = await page.$$('button.btn-primary');
    console.log('Found buttons:', btns.length);
    
    // Find edit button
    const editBtn = await page.$('button[onclick^="editUserAdmin"]');
    if (editBtn) {
        console.log('Clicking edit button...');
        await editBtn.click();
        await page.waitForTimeout(1000);
        console.log('Clicked edit button. Checking modal...');
        const isModalVisible = await page.evaluate(() => {
            return document.getElementById('unifiedAddUserModal').classList.contains('show');
        });
        console.log('Modal visible:', isModalVisible);
    } else {
        console.log('No edit button found!');
    }
    
    await browser.close();
})();
