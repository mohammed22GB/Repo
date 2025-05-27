require('cypress-xpath');

describe("Login", () => {
    beforeEach( () => {
        cy.visit("https://devv.plugonline.io/")
    })
    it("login with email", () => {
        cy.get("input[placeholder='Enter your email address']").should("be.visible")
        .get("input[placeholder='Enter your email address']").should("be.empty")
        .type("plugtest@mailinator.com")
        .get("input[placeholder='Enter password here']").should("be.empty")
        .type("Testing123@")
        .get("img[alt='Visibility']").click()
        .xpath("//span[normalize-space()='Login']").click()
        cy.get('[style="font-size: 18px; font-weight: 600; color: rgb(83, 83, 83); white-space: nowrap;"]').should("be.visible")

    })

    it("login with wrong email", () => {
        cy.get("input[placeholder='Enter your email address']").should("be.visible")
        .get("input[placeholder='Enter your email address']").should("be.empty")
        .type("plug@mailinator.com")
        .get("input[placeholder='Enter password here']").should("be.empty")
        .type("Testing123@")
        .get("img[alt='Visibility']").click()
        .xpath("//span[normalize-space()='Login']").click()
        .get("div[role='alert']").should("be.visible")
        .contains( "Email or password is invalid")
    
    })

    it("login with wrong password", () => {
        cy.get("input[placeholder='Enter your email address']").should("be.visible")
        .get("input[placeholder='Enter your email address']").should("be.empty")
        .type("plugtest@mailinator.com")
        .get("input[placeholder='Enter password here']").should("be.empty")
        .type("Testing123")
        .get("img[alt='Visibility']").click()
        .xpath("//span[normalize-space()='Login']").click()
        .xpath("//div[@id='error1']").should("be.visible")
        .contains("Email or password is invalid")
       
    })
    it("login with wrong email and password", () => {
        cy.get("input[placeholder='Enter your email address']").should("be.visible")
        .get("input[placeholder='Enter your email address']").should("be.empty")
        .type("plug@mailinator.com")
        .get("input[placeholder='Enter password here']").should("be.empty")
        .type("Testing123")
        .get("img[alt='Visibility']").click()
        .xpath("//span[normalize-space()='Login']").click()
        .xpath("//div[@id='error1']").should("be.visible")
        .contains("Email or password is invalid")
        
    })
    
    it("logout", () => {
        cy.get("input[placeholder='Enter your email address']").should("be.visible")
        //cy.get(".jss64").should("be.visible")
        .get("input[placeholder='Enter your email address']").should("be.empty")
        .type("plugtest@mailinator.com")
        .get("input[placeholder='Enter password here']").should("be.empty")
        .type("Testing123@")
        .get("img[alt='Visibility']").click()
        .xpath("//span[normalize-space()='Login']").click()
        //cy.get('.jss2485 > .MuiButton-label').click()
        cy.get('[style="font-size: 18px; font-weight: 600; color: rgb(83, 83, 83); white-space: nowrap;"]').should("be.visible")
        .xpath("//span[contains(text(),'Log out')]").should("be.visible")
        .click()
        cy.title("")
        //cy.get('.jss2791').should("be.visible")
        //cy.get("#root > div > div.MuiBox-root.css-0 > div.MuiDrawer-root.MuiDrawer-docked.main-nav-drawer._open.css-1w12bo > div > div:nth-child(2) > ul:nth-child(2) > span:nth-child(4) > div > li > div > div.MuiListItemText-root.side-nav-text.css-1nmt8ps > span").should("be.viible")
       
    })

})


