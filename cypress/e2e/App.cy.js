require("cypress-xpath");

describe("App", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it.only("Testing", () => {
    cy.getByPlaceholderText("Enter your email address");
  });

  it("App creation", () => {
    //cy.get(".MuiTypography-root.jss856.MuiTypography-body1").should("be.visible")
    cy.get("input[placeholder='Enter your email address']")
      .should("be.empty")
      .type("plugtest@mailinator.com")
      .get("input[placeholder='Enter password here']")
      .should("be.empty")
      .type("Testing123@")
      .get("img[alt='Visibility']")
      .click()
      .xpath("//span[normalize-space()='Login']")
      .click();
    cy.get(
      '[style="font-size: 18px; font-weight: 600; color: rgb(83, 83, 83); white-space: nowrap;"]'
    )
      .should("be.visible")
      .xpath(
        "(//span[@class='MuiTypography-root MuiTypography-body1 MuiListItemText-primary css-yb0lig'][normalize-space()='Apps'])[1]"
      )
      .should("be.visible");
    cy.get('[data-testid="createButton"] > .MuiSvgIcon-root')
      .click()
      .get("input[placeholder='Enter name here']")
      .should("be.empty")
      .type("Cypress App 2c");
    cy.get("textarea[placeholder='Enter description']")
      .should("be.empty")
      .type("Description Cypress c");
    cy.contains(
      ":nth-child(4) > .MuiInputBase-root > .MuiInputBase-input",
      "Description Cypress"
    )
      .get("#mui-component-select-category")
      .click()
      .get("option:nth-child(1)")
      .should("be.visible")
      .xpath("//option[normalize-space()='Kenny category']")
      .should("be.visible")
      .xpath("//option[normalize-space()='New Category']")
      .should("be.visible")
      .xpath("//option[normalize-space()='General']")
      .should("be.visible")
      .click()
      .get("#mui-component-select-isPublic")
      .click()
      .get("option[data-value='false']")
      .should("be.visible")
      .xpath("//option[normalize-space()='External or customer-facing']")
      .should("be.visible")
      .click()
      .get("button[title='submitBtn'] span[class='MuiButton-label']")
      .click();
  });
  it("App creation duplicate", () => {
    cy.get("input[placeholder='Enter your email address']")
      .should("be.empty")
      .type("plugtest@mailinator.com")
      .get("input[placeholder='Enter password here']")
      .should("be.empty")
      .type("Testing123@")
      .get("img[alt='Visibility']")
      .click()
      .xpath("//span[normalize-space()='Login']")
      .click();
    cy.get(
      '[style="font-size: 18px; font-weight: 600; color: rgb(83, 83, 83); white-space: nowrap;"]'
    )
      .should("be.visible")
      .xpath(
        "(//span[@class='MuiTypography-root MuiTypography-body1 MuiListItemText-primary css-yb0lig'][normalize-space()='Apps'])[1]"
      )
      .should("be.visible");
    cy.get('[data-testid="createButton"] > .MuiSvgIcon-root')
      .click()
      .get("input[placeholder='Enter name here']")
      .should("be.empty")
      .type("Cypress App 2c");
    cy.get("textarea[placeholder='Enter description']")
      .should("be.empty")
      .type("Description Cypress c");
    cy.contains(
      ":nth-child(4) > .MuiInputBase-root > .MuiInputBase-input",
      "Description Cypress"
    )
      .get("#mui-component-select-category")
      .click()
      .get("option:nth-child(1)")
      .should("be.visible")
      .xpath("//option[normalize-space()='Kenny category']")
      .should("be.visible")
      .xpath("//option[normalize-space()='New Category']")
      .should("be.visible")
      .xpath("//option[normalize-space()='General']")
      .should("be.visible")
      .click()
      .get("#mui-component-select-isPublic")
      .click()
      .get("option[data-value='false']")
      .should("be.visible")
      .xpath("//option[normalize-space()='External or customer-facing']")
      .should("be.visible")
      .click()
      .get("button[title='submitBtn'] span[class='MuiButton-label']")
      .click()
      .get("div[role='alert']")
      .should("be.visible")
      .contains("div[role='alert']", "Duplicate record is not allowed");
  });

  it("creation without app name", () => {
    cy.get("input[placeholder='Enter your email address']")
      .should("be.empty")
      .type("plugtest@mailinator.com")
      .get("input[placeholder='Enter password here']")
      .should("be.empty")
      .type("Testing123@")
      .get("img[alt='Visibility']")
      .click()
      .xpath("//span[normalize-space()='Login']")
      .click();
    cy.get(
      '[style="font-size: 18px; font-weight: 600; color: rgb(83, 83, 83); white-space: nowrap;"]'
    )
      .should("be.visible")
      .xpath(
        "(//span[@class='MuiTypography-root MuiTypography-body1 MuiListItemText-primary css-yb0lig'][normalize-space()='Apps'])[1]"
      )
      .should("be.visible");
    cy.get('[data-testid="createButton"] > .MuiSvgIcon-root')
      .click()
      .get("input[placeholder='Enter name here']")
      .should("be.empty");
    //.type("Cypress App 1")
    cy.get("textarea[placeholder='Enter description']")
      .should("be.empty")
      .type("Description Cypress");
    cy.contains(
      ":nth-child(4) > .MuiInputBase-root > .MuiInputBase-input",
      "Description Cypress"
    )
      .get("#mui-component-select-category")
      .click()
      .get("option:nth-child(1)")
      .should("be.visible")
      .xpath("//option[normalize-space()='Kenny category']")
      .should("be.visible")
      .xpath("//option[normalize-space()='New Category']")
      .should("be.visible")
      .xpath("//option[normalize-space()='General']")
      .should("be.visible")
      .click()
      .get("#mui-component-select-isPublic")
      .click()
      .get("option[data-value='false']")
      .should("be.visible")
      .xpath("//option[normalize-space()='External or customer-facing']")
      .should("be.visible")
      .click();
    //.get(".MuiFormHelperText-root.MuiFormHelperText-contained.Mui-error.Mui-focused.MuiFormHelperText-marginDense")
    // .should("be.visible")
    //.contains(".MuiFormHelperText-root.MuiFormHelperText-contained.Mui-error.Mui-focused.MuiFormHelperText-marginDense", "Name is required")
    // error message shoyld be the 3 codes above
    //.get("button[title='submitBtn'] span[class='MuiButton-label']").click()
    // as at time of retesting, name is required is not visible on the app
  });

  it("creation without description", () => {
    cy.get("input[placeholder='Enter your email address']")
      .should("be.empty")
      .type("plugtest@mailinator.com")
      .get("input[placeholder='Enter password here']")
      .should("be.empty")
      .type("Testing123@")
      .get("img[alt='Visibility']")
      .click()
      .xpath("//span[normalize-space()='Login']")
      .click();
    cy.get(
      '[style="font-size: 18px; font-weight: 600; color: rgb(83, 83, 83); white-space: nowrap;"]'
    )
      .should("be.visible")
      .xpath(
        "(//span[@class='MuiTypography-root MuiTypography-body1 MuiListItemText-primary css-yb0lig'][normalize-space()='Apps'])[1]"
      )
      .should("be.visible");
    cy.get('[data-testid="createButton"] > .MuiSvgIcon-root')
      .click()
      .get("input[placeholder='Enter name here']")
      .should("be.empty")
      .type("Cypress App 1w");
    cy.get("textarea[placeholder='Enter description']")
      .should("be.empty")
      //.type("Description Cypress")
      //cy.contains(':nth-child(4) > .MuiInputBase-root > .MuiInputBase-input',"Description Cypress")
      .get("#mui-component-select-category")
      .click()
      .get("option:nth-child(1)")
      .should("be.visible")
      .xpath("//option[normalize-space()='Kenny category']")
      .should("be.visible")
      .xpath("//option[normalize-space()='New Category']")
      .should("be.visible")
      .xpath("//option[normalize-space()='General']")
      .should("be.visible")
      .click()
      .get("#mui-component-select-isPublic")
      .click()
      .get("option[data-value='false']")
      .should("be.visible")
      .xpath("//option[normalize-space()='External or customer-facing']")
      .should("be.visible")
      .click();
    //.get(".MuiFormHelperText-root.MuiFormHelperText-contained.Mui-error").should("be.visible")
    // .contains(".MuiFormHelperText-root.MuiFormHelperText-contained.Mui-error", "Description is required")
    // as at time of retesting creating an app without app discription, description is required is not visible on the app
  });
  it("creation without category", () => {
    cy.get("input[placeholder='Enter your email address']")
      .should("be.empty")
      .type("plugtest@mailinator.com")
      .get("input[placeholder='Enter password here']")
      .should("be.empty")
      .type("Testing123@")
      .get("img[alt='Visibility']")
      .click()
      .xpath("//span[normalize-space()='Login']")
      .click();
    cy.get(
      '[style="font-size: 18px; font-weight: 600; color: rgb(83, 83, 83); white-space: nowrap;"]'
    )
      .should("be.visible")
      .xpath(
        "(//span[@class='MuiTypography-root MuiTypography-body1 MuiListItemText-primary css-yb0lig'][normalize-space()='Apps'])[1]"
      )
      .should("be.visible");
    cy.get('[data-testid="createButton"] > .MuiSvgIcon-root')
      .click()
      .get("input[placeholder='Enter name here']")
      .should("be.empty")
      .type("Cypress App 1");
    cy.get("textarea[placeholder='Enter description']")
      .should("be.empty")
      .type("Description Cypress");
    cy.contains(
      ":nth-child(4) > .MuiInputBase-root > .MuiInputBase-input",
      "Description Cypress"
    )
      .get("#mui-component-select-category")
      .should("be.visible")
      //.click()
      //.get("option:nth-child(1)").should("be.visible")
      //.xpath("//option[normalize-space()='Kenny category']").should("be.visible")
      //.xpath("//option[normalize-space()='New Category']").should("be.visible")
      //.xpath("//option[normalize-space()='General']").should("be.visible").click()
      .get("#mui-component-select-isPublic")
      .click()
      .get("option[data-value='false']")
      .should("be.visible")
      .xpath("//option[normalize-space()='External or customer-facing']")
      .should("be.visible")
      .click();
    //.get("button[title='submitBtn'] span[class='MuiButton-label']").click()
  });
});
