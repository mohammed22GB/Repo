require('cypress-xpath');
describe("User Roles", ()=> {
    beforeEach( () => {
        cy.visit("https://devv.plugonline.io/")
    })

    it("Asserstions Admin buttons", () => {
        cy.get("input[placeholder='Enter your email address']").should("be.empty")
        .type("plugtest@mailinator.com")
        .get("input[placeholder='Enter password here']").should("be.empty")
        .type("Testing123@")
        .get("img[alt='Visibility']").click()
        .xpath("//span[normalize-space()='Login']").click()
        .get("#root > div > div.MuiBox-root.css-0 > div.MuiDrawer-root.MuiDrawer-docked.main-nav-drawer._open.css-1w12bo > div > div:nth-child(2) > ul:nth-child(1) > a:nth-child(14) > span > li > div > div.MuiListItemText-root.side-nav-text.css-1nmt8ps > span")
        .click()
        .xpath("//span[contains(text(),'Roles')]").click()
        .get('body > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)')
        .should("be.visible")
        .xpath("//p[normalize-space()='Admin']").should("be.visible")
        .get("#root > div > div > div.main-page-layout-outer > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(3) > p")
        .should("be.visible").click()
        .get("button[aria-label='cancel']").click()
       
       

    })


    it("Employee Asserstions", () => {
        cy.get("input[placeholder='Enter your email address']").should("be.empty")
        .type("plugtest@mailinator.com")
        .get("input[placeholder='Enter password here']").should("be.empty")
        .type("Testing123@")
        .get("img[alt='Visibility']").click()
        .xpath("//span[normalize-space()='Login']").click()
        .get("#root > div > div.MuiBox-root.css-0 > div.MuiDrawer-root.MuiDrawer-docked.main-nav-drawer._open.css-1w12bo > div > div:nth-child(2) > ul:nth-child(1) > a:nth-child(14) > span > li > div > div.MuiListItemText-root.side-nav-text.css-1nmt8ps > span")
        .click()
        .xpath("//span[contains(text(),'Roles')]").click()
        .get('body > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)')
        .should("be.visible")
        .xpath("//p[normalize-space()='Employee']").should("be.visible")
        .get("#root > div > div > div.main-page-layout-outer > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > p")
        .should("be.visible").click()
        .xpath("//button[@aria-label='cancel']//span[@class='MuiIconButton-label']//*[name()='svg']")
        .click()
        
    })

    it("Designer Asserstions", () => {
        cy.get("input[placeholder='Enter your email address']").should("be.empty")
        .type("plugtest@mailinator.com")
        .get("input[placeholder='Enter password here']").should("be.empty")
        .type("Testing123@")
        .get("img[alt='Visibility']").click()
        .xpath("//span[normalize-space()='Login']").click()
        .get("#root > div > div.MuiBox-root.css-0 > div.MuiDrawer-root.MuiDrawer-docked.main-nav-drawer._open.css-1w12bo > div > div:nth-child(2) > ul:nth-child(1) > a:nth-child(14) > span > li > div > div.MuiListItemText-root.side-nav-text.css-1nmt8ps > span")
        .click()
        .xpath("//span[contains(text(),'Roles')]").click()
        .get('body > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)')
        .should("be.visible")
        .xpath("//p[normalize-space()='Designer']").should("be.visible")
        .get("#root > div > div > div.main-page-layout-outer > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(3) > p")
        .click()
        .xpath("//h5[normalize-space()='Designer']").contains("Designer")
        .xpath("//h6[normalize-space()='Can view and edit users management list.']")
        .should("be.visible")
        .get("button[aria-label='cancel']").click()
        //.xpath("//div[@class='collapse-drawer-btn']//*[name()='svg']").click()



    })

    it.skip("Admin", () => {
        cy.get("input[placeholder='Enter your email address']").should("be.empty")
        .type("plugtest@mailinator.com")
        .get("input[placeholder='Enter password here']").should("be.empty")
        .type("Testing123@")
        .get("img[alt='Visibility']").click()
        .xpath("//span[normalize-space()='Login']").click()
        .get("#root > div > div.MuiBox-root.css-0 > div.MuiDrawer-root.MuiDrawer-docked.main-nav-drawer._open.css-1w12bo > div > div:nth-child(2) > ul:nth-child(1) > a:nth-child(14) > span > li > div > div.MuiListItemText-root.side-nav-text.css-1nmt8ps > span")
        .click()
        .xpath("//span[contains(text(),'Roles')]").click()
        .get('body > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)')
        .should("be.visible")
        .xpath("//p[normalize-space()='Admin']").should("be.visible")
        .get("#root > div > div > div.main-page-layout-outer > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(3) > p")
        .should("be.visible").click()
        .xpath("//h5[normalize-space()='Admin']").should("be.visible")
        .xpath("//h6[contains(text(),'Can create, edit, view, and delete users managemen')]").should("be.visible")
        .xpath("//h6[normalize-space()='Can create, edit, view, and delete user groups.']").should("be.visible")
        .xpath('//div[4]//h6[1]').should("be.visible")
        .xpath("//h6[normalize-space()='Can create, edit, view, and delete apps created.']").should("be.visible")
        .xpath("//h6[contains(text(),'Can create, edit, view, and delete datasheets list')]").should("be.visible")
        .xpath("//h6[normalize-space()='Can create, edit, view, and delete app workflows.']").should("be.visible")
        //to scroll down
        .get("#permissions-list").scrollTo("bottom")
        .get("#roles-permission-6").should("be.visible")
        .get("#roles-permission-7").should("be.visible")
        //.xpath("(//h6[contains(text(),'Can create, edit, view, and delete tasks of apps r')])[1]").should("be.visible")
        //.get("#permissions-list > div > div:nth-child(8) > h6").should("be.visible")
        //the next one after it
        //.xpath("//h6[contains(text(),'Can create, edit, view, and delete screens of apps')]").should("be.visible")
        //.get("div:nth-child(9) h6:nth-child(1)").should("be.visible")
        //.get("#permissions-list > div > div:nth-child(9) > h6").should("be.visible")


    })


    it.skip("Employee", () => {
        cy.get("input[placeholder='Enter your email address']").should("be.empty")
        .type("plugtest@mailinator.com")
        .get("input[placeholder='Enter password here']").should("be.empty")
        .type("Testing123@")
        .get("img[alt='Visibility']").click()
        .xpath("//span[normalize-space()='Login']").click()
        .get("#root > div > div.MuiBox-root.css-0 > div.MuiDrawer-root.MuiDrawer-docked.main-nav-drawer._open.css-1w12bo > div > div:nth-child(2) > ul:nth-child(1) > a:nth-child(14) > span > li > div > div.MuiListItemText-root.side-nav-text.css-1nmt8ps > span")
        .click()
        .xpath("//span[contains(text(),'Roles')]").click()
        .get('body > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)')
        .should("be.visible")
        .xpath("//p[normalize-space()='Employee']").should("be.visible")
        .get("#root > div > div > div.main-page-layout-outer > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > p")
        .should("be.visible").click()
        .xpath("//h5[normalize-space()='Employee']").should("be.visible")
        .xpath("//h6[normalize-space()='Can view and edit users management list.']").should("be.visible")
        .xpath("//h6[normalize-space()='Can view user groups.']").should("be.visible")
        .xpath("//h6[normalize-space()='Can view apps created.']").should("be.visible")
        .get("div[role='presentation'] div:nth-child(5)").should("be.visible")
        .xpath("//h6[normalize-space()='Can view app workflows.']").should("be.visible")
        .xpath("//div[@role='presentation']//div[5]").should("be.visible")
        //.xpath("body > div:nth-child(6) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(6) > h6:nth-child(1)")
        .get("body > div:nth-child(6) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(6) > h6:nth-child(1)")
        .should('be.visible')
        .get("body > div:nth-child(6) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(7) > h6:nth-child(1)")
        .should("be.visible")
        .get("div:nth-child(8) h6:nth-child(1)").should("be.visible")
        // to scroll down 
        //.get('id="permissions-list”').scrollTo("bottom")
        .get("div:nth-child(9) h6:nth-child(1)").should("be.visible")


    })

    it.skip("Designer", () => {
        cy.get("input[placeholder='Enter your email address']").should("be.empty")
        .type("plugtest@mailinator.com")
        .get("input[placeholder='Enter password here']").should("be.empty")
        .type("Testing123@")
        .get("img[alt='Visibility']").click()
        .xpath("//span[normalize-space()='Login']").click()
        .get("#root > div > div.MuiBox-root.css-0 > div.MuiDrawer-root.MuiDrawer-docked.main-nav-drawer._open.css-1w12bo > div > div:nth-child(2) > ul:nth-child(1) > a:nth-child(14) > span > li > div > div.MuiListItemText-root.side-nav-text.css-1nmt8ps > span")
        .click()
        .xpath("//span[contains(text(),'Roles')]").click()
        .get('body > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)')
        .should("be.visible")
        .xpath("//p[normalize-space()='Designer']").should("be.visible")
        //.get("div[class='MuiBox-root jss264 jss231'] div p[class='MuiTypography-root jss234 MuiTypography-body1']")
        //.xpath("//div[@class='MuiBox-root jss264 jss231']//div//p[@class='MuiTypography-root jss234 MuiTypography-body1'][normalize-space()='View permissions']")
        .get("#root > div > div > div.main-page-layout-outer > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(3) > p")
        .click()
        .xpath("//h5[normalize-space()='Designer']").contains("Designer")
        .xpath("//h6[normalize-space()='Can view and edit users management list.']")
        .should("be.visible")
        .xpath("//h6[normalize-space()='Can view user groups.']").should("be.visible")
        .xpath("//h6[normalize-space()='Can create, edit, view, and delete apps created.']")
        .should("be.visible")
        .xpath("//h6[contains(text(),'Can create, edit, view, and delete datasheets list')]")
        .should("be.visible")
        .xpath("//h6[normalize-space()='Can create, edit, view, and delete app workflows.']")
        .should("be.visible")
        .xpath("//h6[contains(text(),'Can create, edit, view, and delete tasks of apps r')]")
        .should("be.visible")
        // to scroll down
        .get("#permissions-list > div > div:nth-child(8) > h6")
        //.xpath("//h6[contains(text(),'Can create, edit, view, and delete screens of apps')]")
        .should("be.visible")


    })


})