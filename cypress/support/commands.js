// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/**
 * @description
 * Replace special characters with their escaped version.
 *
 * @see {@link https://docs.cypress.io/api/commands/get#Find-the-element-with-id-that-has-characters-used-in-CSS-like-- For more information}
 *
 * @param {string} selector
 * @returns {string}
 */
const replace = (selector) => {
  return selector.replace(/(\.|,|;)/g, "\\$1");
};

/**
 * @description
 * Concatenate all selectors and remove any falsy values.
 *
 * @param  {...string} selectors
 * @returns {string}
 */
const concatenate = (...selectors) => {
  return selectors.map(replace).filter(Boolean).join("");
};

const getByDataAttribute = (attribute) => {
  return {
    with: ({ prefix, value, suffix }) => {
      const css = `[data-${attribute}=${value}]`;
      const selector = concatenate(prefix, css, suffix);
      return cy.get(selector);
    },

    startsWith: ({ prefix, value, suffix }) => {
      const css = `[data-${attribute}^=${value}]`;
      const selector = concatenate(prefix, css, suffix);
      return cy.get(selector);
    },

    endsWith: ({ prefix, value, suffix }) => {
      const css = `[data-${attribute}$=${value}]`;
      const selector = concatenate(prefix, css, suffix);
      return cy.get(selector);
    },

    contains: ({ prefix, value, suffix }) => {
      const css = `[data-${attribute}*=${value}]`;
      const selector = concatenate(prefix, css, suffix);
      return cy.get(selector);
    },

    startsAndEndsWith: ({ prefix, value: { start, end }, suffix }) => {
      const css = `[data-${attribute}^=${start}][data-${attribute}$=${end}]`;
      const selector = concatenate(prefix, css, suffix);
      return cy.get(selector);
    },
  };
};

Cypress.Commands.add("getByDataAttribute", getByDataAttribute);

const getByRoleType = (type) => {
  return {
    with: ({ prefix, suffix }) => {
      const css = `[role=${type}]`;
      const selector = concatenate(prefix, css, suffix);
      return cy.get(selector);
    },
  };
};

Cypress.Commands.add("getByRoleType", getByRoleType);

const getByAriaState = (state) => {
  return {
    with: ({ prefix, value, suffix }) => {
      const css = `[aria-${state}=${value}]`;
      const selector = concatenate(prefix, css, suffix);
      return cy.get(selector);
    },
  };
};

Cypress.Commands.add("getByAriaState", getByAriaState);

const getByPlaceholderText = (text) => {
  return {
    with: ({ prefix, suffix }) => {
      const css = `[placeholder=${text}]`;
      const selector = concatenate(prefix, css, suffix);
      return cy.get(selector);
    },
  };
};

Cypress.Commands.add("getByPlaceholderText", getByPlaceholderText);

const getByInputType = (type) => {
  return {
    with: ({ prefix, suffix }) => {
      const css = `[type=${type}]`;
      const selector = concatenate(prefix, css, suffix);
      return cy.get(selector);
    },
  };
};

Cypress.Commands.add("getByInputType", getByInputType);
