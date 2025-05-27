require('cypress-xpath');

describe('Signup Attempt', ()=> {

    beforeEach(() => {
        cy.visit("https://devv.plugonline.io/")
        // Disable CAPTCHA for the duration of the test
        cy.intercept('POST', '#root', (req) => {
          req.reply({ captchaPassed: true });
        });
    });

    it("verify that the user can ign up with correct email", () => {
        //.get(".MuiTypography-root.MuiLink-root.MuiLink-underlineHover.jss222.MuiTypography-colorPrimary").should("be.visible")
        //cy.get('.jss81 > .MuiTypography-root').should("be.visible").click()
        cy.xpath("//a[normalize-space()='Sign up']").should("exist").click()
        .get("input[placeholder='Enter your email address']").should("be.empty")
        .type("eniolaqa+1@gmail.com")
        //.get("input[placeholder='Enter your email address']").contains("eniolaqa+1@gmail.com")
        .get("input[placeholder='Enter password here']").type("Testing123@")
        .get("img[alt='Visibility']").click()
        .xpath("(//input[@aria-label='uncontrolled-checkbox'])[1]").check().should("be.checked")
        .xpath("(//input[@aria-label='uncontrolled-checkbox'])[2]").check().should("be.checked")
        .xpath("//span[normalize-space()='Get started!']").should("be.visible").click()
        //.url().should("eq", "https://devv.plugonline.io/signup-detail")

    })
    


})