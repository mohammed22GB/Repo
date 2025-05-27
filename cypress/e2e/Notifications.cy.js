require('cypress-xpath');
describe("Notifications", () => {
    beforeEach( () => {
        cy.visit("https://devv.plugonline.io/")
    })
    it("Notification Assertions", () => {
        cy.get("input[placeholder='Enter your email address']").should("be.empty")
        .type("plugtest@mailinator.com")
        .get("input[placeholder='Enter password here']").should("be.empty")
        .type("Testing123@")
        .get("img[alt='Visibility']").click()
        .xpath("//span[normalize-space()='Login']").click()
        .get("#root > div > div > div.MuiDrawer-root.MuiDrawer-docked.main-nav-drawer._open.css-1w12bo > div > div:nth-child(2) > ul:nth-child(1) > a:nth-child(12) > span > li > div > div.MuiListItemText-root.side-nav-text.css-1nmt8ps > span")
        .click()
        .get(".MuiButtonBase-root.MuiTab-root.MuiTab-textColorPrimary.Mui-selected").should("be.visible")
        .xpath("//span[normalize-space()='Read']").should("be.visible").click()
        .xpath("//span[normalize-space()='Unread']").should("be.visible").click()
        .get("#root > div > div > header > div > div > div.toolbar-notification-and-user > div > span > span")
        .should("be.visible")
        //.xpath("//div[@class='MuiBox-root jss8997']//*[name()='svg']").should("exist").click()
        .xpath("(//*[name()='svg'][@class='MuiSvgIcon-root MuiSvgIcon-colorAction'])[1]")
        .should("exist").click()
        // clicking return up has 32 elements with the same name
        //.xpath("(//*[name()='path'])[6]").should("exist")


    })
})