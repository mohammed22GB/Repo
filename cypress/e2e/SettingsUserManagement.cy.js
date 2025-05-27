require('cypress-xpath');
describe("User Management", () => {
    beforeEach( () => {
        cy.visit("https://devv.plugonline.io/")
    })

    it("Add User Group", () => {
        cy.get("input[placeholder='Enter your email address']").should("be.empty")
        .type("plugtest@mailinator.com")
        .get("input[placeholder='Enter password here']").should("be.empty")
        .type("Testing123@")
        .get("img[alt='Visibility']").click()
        .xpath("//span[normalize-space()='Login']").click()
        .get("#root > div > div.MuiBox-root.css-0 > div.MuiDrawer-root.MuiDrawer-docked.main-nav-drawer._open.css-1w12bo > div > div:nth-child(2) > ul:nth-child(1) > a:nth-child(14) > span > li > div > div.MuiListItemText-root.side-nav-text.css-1nmt8ps > span")
        .click()
        .xpath("//span[contains(text(),'User Management')]").should("be.visible").click()
        //.get(".MuiButtonBase-root.MuiButton-root.jss597.MuiButton-text").click()
        cy.get('a > .MuiButtonBase-root').click()
        .get("div[title='Add new user group']").click()
       //.get("body > div:nth-child(6) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input:nth-child(1)")
       .xpath("(//input[@id='outlined-basic'])[1]")
       .type("Cypress")
       .xpath("(//div[@class='MuiInputBase-root MuiOutlinedInput-root MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-multiline MuiOutlinedInput-multiline MuiInputBase-marginDense MuiOutlinedInput-marginDense'])[1]")
       .type("Cypress User Group")
        .xpath("(//button[@type='button'])[6]").click()

    })
    it("Add User Group duplicate", () => {
        cy.get("input[placeholder='Enter your email address']").should("be.empty")
        .type("plugtest@mailinator.com")
        .get("input[placeholder='Enter password here']").should("be.empty")
        .type("Testing123@")
        .get("img[alt='Visibility']").click()
        .xpath("//span[normalize-space()='Login']").click()
        .get("#root > div > div.MuiBox-root.css-0 > div.MuiDrawer-root.MuiDrawer-docked.main-nav-drawer._open.css-1w12bo > div > div:nth-child(2) > ul:nth-child(1) > a:nth-child(14) > span > li > div > div.MuiListItemText-root.side-nav-text.css-1nmt8ps > span")
        .click()
        .xpath("//span[contains(text(),'User Management')]").should("be.visible").click()
        //.get(".MuiButtonBase-root.MuiButton-root.jss597.MuiButton-text").click()
        cy.get('a > .MuiButtonBase-root').click()
        .get("div[title='Add new user group']").click()
       //.get("body > div:nth-child(6) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input:nth-child(1)")
       .xpath("(//input[@id='outlined-basic'])[1]")
       .type("Cypress")
       .xpath("(//div[@class='MuiInputBase-root MuiOutlinedInput-root MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-multiline MuiOutlinedInput-multiline MuiInputBase-marginDense MuiOutlinedInput-marginDense'])[1]")
       .type("Cypress User Group")
        .xpath("(//button[@type='button'])[6]").click()
        .xpath("(//div[@id='error1'])[1]").should("be.visible")
        .contains("Duplicate record is not allowed")
    })

    it("Add User Group without name", () => {
        cy.get("input[placeholder='Enter your email address']").should("be.empty")
        .type("plugtest@mailinator.com")
        .get("input[placeholder='Enter password here']").should("be.empty")
        .type("Testing123@")
        .get("img[alt='Visibility']").click()
        .xpath("//span[normalize-space()='Login']").click()
        .get("#root > div > div.MuiBox-root.css-0 > div.MuiDrawer-root.MuiDrawer-docked.main-nav-drawer._open.css-1w12bo > div > div:nth-child(2) > ul:nth-child(1) > a:nth-child(14) > span > li > div > div.MuiListItemText-root.side-nav-text.css-1nmt8ps > span")
        .click()
        .xpath("//span[contains(text(),'User Management')]").should("be.visible").click()
        //.get(".MuiButtonBase-root.MuiButton-root.jss597.MuiButton-text").click()
        cy.get('a > .MuiButtonBase-root').click()
        .get("div[title='Add new user group']").click()
       //.get("body > div:nth-child(6) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input:nth-child(1)")
       .xpath("(//input[@id='outlined-basic'])[1]")
       //.type("Cypress")
       .xpath("(//div[@class='MuiInputBase-root MuiOutlinedInput-root MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-multiline MuiOutlinedInput-multiline MuiInputBase-marginDense MuiOutlinedInput-marginDense'])[1]")
       .type("Cypress User Group")
        .xpath("(//button[@type='button'])[6]").should("be.disabled")
        // the save button is inactive
    })

    it("Add User Group without description", () => {
        cy.get("input[placeholder='Enter your email address']").should("be.empty")
        .type("plugtest@mailinator.com")
        .get("input[placeholder='Enter password here']").should("be.empty")
        .type("Testing123@")
        .get("img[alt='Visibility']").click()
        .xpath("//span[normalize-space()='Login']").click()
        .get("#root > div > div.MuiBox-root.css-0 > div.MuiDrawer-root.MuiDrawer-docked.main-nav-drawer._open.css-1w12bo > div > div:nth-child(2) > ul:nth-child(1) > a:nth-child(14) > span > li > div > div.MuiListItemText-root.side-nav-text.css-1nmt8ps > span")
        .click()
        .xpath("//span[contains(text(),'User Management')]").should("be.visible").click()
        //.get(".MuiButtonBase-root.MuiButton-root.jss597.MuiButton-text").click()
        cy.get('a > .MuiButtonBase-root').click()
        .get("div[title='Add new user group']").click()
       //.get("body > div:nth-child(6) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input:nth-child(1)")
       .xpath("(//input[@id='outlined-basic'])[1]")
       .type("Cypress")
       .xpath("(//div[@class='MuiInputBase-root MuiOutlinedInput-root MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-multiline MuiOutlinedInput-multiline MuiInputBase-marginDense MuiOutlinedInput-marginDense'])[1]")
       //.type("Cypress User Group")
       .xpath("(//button[@type='button'])[6]").should("be.disabled")
        // the save button is inactive
    })



    it("Add User", () => {
        cy.get("input[placeholder='Enter your email address']").should("be.empty")
        .type("plugtest@mailinator.com")
        .get("input[placeholder='Enter password here']").should("be.empty")
        .type("Testing123@")
        .get("img[alt='Visibility']").click()
        .xpath("//span[normalize-space()='Login']").click()
        //.get("#root > div > div.MuiBox-root.css-0 > div.MuiDrawer-root.MuiDrawer-docked.main-nav-drawer._open.css-1w12bo > div > div:nth-child(2) > ul:nth-child(1) > a:nth-child(14) > span > li > div > div.MuiListItemText-root.side-nav-text.css-1nmt8ps > span")
        //cy.get(':nth-child(16) > :nth-child(1) > .MuiListItem-root > .MuiButtonBase-root')
        .get("#root > div > div.MuiBox-root.css-0 > div.MuiDrawer-root.MuiDrawer-docked.main-nav-drawer._open.css-1w12bo > div > div:nth-child(2) > ul:nth-child(1) > a:nth-child(14) > span > li > div > div.MuiListItemText-root.side-nav-text.css-1nmt8ps > span")
        .click()
        .xpath("//span[contains(text(),'User Management')]").should("be.visible").click()
        .get("div[title='Add new user']").click()
        .get(".MuiTypography-root.MuiTypography-h5").should("be.visible")
        //.contains(".MuiTypography-root.MuiTypography-h5", "Add User")
        .get("input[placeholder='Enter first name here']").should("be.empty")
        .type("Cypress")
        .get("input[placeholder='Enter last name here']").should("be.empty")
        .type("User 1b")
        // cypres unique ID .get("cy.get(':nth-child(3) > .MuiFormControl-root > .MuiInputBase-root > #outlined-basic')")
       // chrome user id .get('<input aria-invalid="true" id="outlined-basic" name="email" placeholder="Enter email address here" type="text" class="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputMarginDense MuiOutlinedInput-inputMarginDense" value="">')
       // selectorhub option1 .get("body > div:nth-child(13) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > input:nth-child(1)")
       // selectorhub option3
       .xpath("(//input[@id='outlined-basic'])[3]")
       .should("be.empty")
        .type("cypress1@mailinator.com")
        .xpath("(//input[@id='outlined-basic'])[4]")
        .should("be.empty")
        .type("08012345678")
        // get employee id
        cy.get(':nth-child(5) > .MuiFormControl-root > .MuiInputBase-root > #outlined-basic')
        .type("Cy123")
        .get("#mui-component-select-roles").click()
        .xpath("//li[normalize-space()='Admin']").should("be.visible")
        .xpath("//li[normalize-space()='Designer']").should("be.visible")
        .xpath("//li[normalize-space()='Employee']").should("be.visible").click()
        .get("#lineManager").click()
        .get('#select-on-steroid-result-ut-id-1').click()
        .get("#userGroups").click()
        .get('#user-modal-main').scrollTo('bottom')
        .get('#select-on-steroid-result-gt-id-0').click()
        //.get("#new-user-submit-btn > span.MuiButton-label.jss20").click()
        .get('#new-user-submit-btn').click()
        .get("div[role='alert']").should('be.visible')
        
        





        // Kenny said for now we should put a peg on add user feature
    


    })

})