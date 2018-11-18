// Use this for skipping the login page, i. e. all tests which do not test the login page itself
const visit_opts = { auth: { username: 'admin', password: 'foobar' } };

Cypress.config('baseUrl', 'http://127.0.0.2:9091');

describe('cockpit demo', () => {
    beforeEach('start VM', function () {
        // Programmatically enable the "Reuse my password for privileged tasks" option
        cy.server({
            onAnyRequest: function (route, proxy) {
                proxy.xhr.setRequestHeader('X-Authorize',  'password');
            }
        });
    });

    it('switch to German translations', function() {
        cy.visit('/', visit_opts);

        // change language in menu
        cy.get('#content-user-name').click();
        cy.get('.display-language-menu a').click();
        cy.get('#display-language select').select('de-de');

        // HACK: language switching in Chrome not working in current session (Cockpit issue #8160)
        cy.on('uncaught:exception', (err, runnable) => {
            cy.log("Uncaught exception:", err);
            return false;
        });

        // menu label (from manifest) should be translated
        cy.get('#display-language-select-button').click();
        cy.get("#host-apps a[href='/system/logs']").should('contain', 'Protokolle');
    });
})
