import { AriaAttributes, AriaRole, HTMLInputTypeAttribute } from "react";

type DataAttribute = "cy" | "test" | "testid" | (string & {});

declare global {
  namespace Cypress {
    interface cy {
      /**
       * @description
       * Get an element by its `data-*` attribute.
       *
       * @param {string} attribute
       */
      getByDataAttribute: (attribute: DataAttribute) => {
        /**
         * @description
         * Get an element by its `data-*` attribute.
         *
         * @param {{ prefix?: string, value: string, suffix?: string }} data
         * @returns {Cypress.Chainable}
         *
         * @example
         *
         * ```css
         * div[data-cy="test-id"]
         * ```
         * ===
         * ```typescript
         * cy.getByData('cy').with({ prefix: "div", value: 'test-id' });
         * ```
         * ===
         * ```html
         * <div data-cy="test-id">Hello World</div>
         * ```
         */
        with: (data: {
          value: string;
          prefix?: string;
          suffix?: string;
        }) => Cypress.Chainable;

        /**
         * @description
         * Get an element which `data-*` attribute starts with `id`.
         *
         * @param {{ prefix?: string, value: string, suffix?: string }} data
         * @returns {Cypress.Chainable}
         *
         * @example
         *
         * ```css
         * div[data-cy^="test-id"]
         * ```
         * ===
         * ```typescript
         * cy.getByData('cy').startsWith({ prefix: "div", value: 'test-id' });
         * ```
         * ===
         * ```html
         * <div data-cy="test-id-1">Hello World</div>
         * <div data-cy="test-id-2">Welcome</div>
         * ```
         */
        startsWith: (data: {
          value: string;
          prefix?: string;
          suffix?: string;
        }) => Cypress.Chainable;

        /**
         * @description
         * Get an element which `data-*` attribute ends with `id`.
         *
         * @param {{ prefix?: string, value: string, suffix?: string }} data
         * @returns {Cypress.Chainable}
         *
         * @example
         *
         * ```css
         * div[data-cy$="test-id"]
         * ```
         * ===
         * ```typescript
         * cy.getByData('cy').endsWith({ prefix: "div", value: 'test-id' });
         * ```
         * ===
         * ```html
         * <div data-cy="1-test-id">Hello World</div>
         * <div data-cy="2-test-id">Welcome</div>
         * ```
         */
        endsWith: (data: {
          value: string;
          prefix?: string;
          suffix?: string;
        }) => Cypress.Chainable;

        /**
         * @description
         * Get an element which `data-*` attribute contains `id`.
         *
         * @param {{ prefix?: string, value: string, suffix?: string }} data
         * @returns {Cypress.Chainable}
         *
         * @example
         *
         * ```css
         * div[data-cy*="test-id"]
         * ```
         * ===
         * ```typescript
         * cy.getByData('cy').contains({ prefix: "div", value: 'test-id' });
         * ```
         * ===
         * ```html
         * <div data-cy="1-test-id-1">Hello World</div>
         * <div data-cy="2-test-id-2">Welcome</div>
         * ```
         */
        contains: (data: {
          value: string;
          prefix?: string;
          suffix?: string;
        }) => Cypress.Chainable;

        /**
         * @description
         * Get an element which `data-*` attribute starts and ends with `start` and `end`.
         *
         * @param {{ prefix?: string, value: { start: string, end: string }, suffix?: string }} data
         * @returns {Cypress.Chainable}
         *
         * @example
         *
         * ```css
         * div[data-cy^="test"][data-cy$="id"]
         * ```
         * ===
         * ```typescript
         * cy.getByData('cy').startsAndEndsWith({ prefix: "div", value: { start: 'test', end: 'id' } });
         * ```
         * ===
         * ```html
         * <div data-cy="test-1-id">Hello World</div>
         * <div data-cy="test-2-id">Welcome</div>
         * ```
         */
        startsAndEndsWith: (data: {
          value: { start: string; end: string };
          prefix?: string;
          suffix?: string;
        }) => Cypress.Chainable;
      };

      /**
       * @description
       * Get an element by its `role` attribute.
       *
       * @param {string} type
       */
      getByRoleType: (type: AriaRole) => {
        /**
         * @description
         * Get an element by its `role` attribute.
         *
         * @param {{ prefix?: string, value: string, suffix?: string }} data
         * @returns {Cypress.Chainable}
         *
         * @example
         *
         * ```css
         * div[role="button"]
         * ```
         * ===
         * ```typescript
         * cy.getByRole('button').with({ prefix: "div" });
         * ```
         * ===
         * ```html
         * <div role="button">Hello World</div>
         * ```
         */
        with: (data: { prefix?: string; suffix?: string }) => Cypress.Chainable;
      };

      /**
       * @description
       * Get an element by its `aria-*` attribute.
       *
       * @param {string} state
       */
      getByAriaState: <State extends keyof AriaAttribute>(
        state: State
      ) => {
        /**
         * @description
         * Get an element by its `aria-*` attribute.
         *
         * @param {{ prefix?: string, value: string, suffix?: string }} data
         * @returns {Cypress.Chainable}
         *
         * @example
         *
         * ```css
         * div[aria-checked="true"]
         * ```
         * ===
         * ```typescript
         * cy.getByAria('checked').with({ prefix: "div", value: 'true' });
         * ```
         * ===
         * ```html
         * <div aria-checked="true">Hello World</div>
         * ```
         */
        with: (data: {
          value: AriaAttributes[State];
          prefix?: string;
          suffix?: string;
        }) => Cypress.Chainable;
      };

      getByInputType: (type: HTMLInputTypeAttribute) => {
        /**
         * @description
         * Get an element by its `type` attribute.
         *
         * @param {{ prefix?: string, value: string, suffix?: string }} data
         * @returns {Cypress.Chainable}
         *
         * @example
         *
         * ```css
         * input[type="password"]
         * ```
         * ===
         * ```typescript
         * cy.getByInputType('password').with({ prefix: "input" });
         * ```
         * ===
         * ```html
         * <input type="password">Hello World</input>
         * ```
         */
        with: (data: { prefix?: string; suffix?: string }) => Cypress.Chainable;
      };

      getByPlaceholderText: (text: string) => {
        /**
         * @description
         * Get an element by its `placeholder` attribute.
         *
         * @param {{ prefix?: string, value: string, suffix?: string }} data
         * @returns {Cypress.Chainable}
         *
         * @example
         *
         * ```css
         * input[placeholder="Title"]
         * ```
         * ===
         * ```typescript
         * cy.getByPlaceholderText('Title').with({ prefix: "input" });
         * ```
         * ===
         * ```html
         * <input placeholder="Title">Hello World</input>
         * ```
         */
        with: (data: { prefix?: string; suffix?: string }) => Cypress.Chainable;
      };
    }

    interface Chainable {}
  }
}
