const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "icxxv4",
  e2e: {
     experimentalRunAllSpecs : true, 
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    "experimentalRunAllSpecs": true
  },

  defaultCommandTimeout: 90000, 
  defaultCommandTimeout: 90000

  

});


