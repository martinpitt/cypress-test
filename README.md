Cypress Cockpit playground
==========================

This is my playground for learning the [cypress.io](https://www.cypress.io/)
web testing framework. In particular, this evaluates how it works for testing
[Cockpit](https://cockpit-project.org/) plugins. Design-wise, it is pretty
strongly assuming that the [web server is running before the test
starts](https://docs.cypress.io/guides/references/best-practices.html#Web-Servers),
but this is not an option for Cockpit - every test should run in a fresh VM.

So this works out how to start these VMs as part of the per-test setup, and how
to deal with [tests restarting after the first cy.visit() and losing all
state](https://github.com/cypress-io/cypress/issues/2636).

Usage
-----

Start from a fresh clone of this repository.

1. Install the necessary modules (in particular, cypress):

       npm install

2. Get [Cockpit's bots/ directory](https://github.com/cockpit-project/cockpit/tree/master/bots/)
   which provides access to a lot of standard test VMs and the mechanics how to
   start/stop and interact with them. Use that to build a VM image with Cockpit
   pre-installed and enabled:

       npm run prepare

3. Start the headless test:

       npm run test

4. Or start the test with watching the browser:

       npm run test:headed

5. Or open the Cypress GUI and manually start, watch, and debug tests:

       npm run cypress
