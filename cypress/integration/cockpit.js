// Use this for skipping the login page, i. e. all tests which do not test the login page itself
const visit_opts = { auth: { username: 'admin', password: 'foobar' } };

describe('cockpit demo', () => {
    beforeEach('start VM', function () {
        cy.task('startVM', 'fedora-29').then(url => Cypress.config('baseUrl', url));

        // Programmatically enable the "Reuse my password for privileged tasks" option
        cy.server({
            onAnyRequest: function (route, proxy) {
                proxy.xhr.setRequestHeader('X-Authorize',  'password');
            }
        });
    });

    afterEach('stop VM', function() {
        cy.task('stopVM');
    });

    it('Login page', function () {
        cy.visit('/');

        // "Other options"
        cy.get('#server-field').should('not.be.visible');
        cy.get('#show-other-login-options').should('be.visible').click();
        cy.get('#server-field').should('be.visible');
        cy.get('#show-other-login-options').click();
        cy.get('#server-field').should('not.be.visible');

        // log in
        cy.get('#authorized-input').
            click().
            should('be.checked');
        cy.get('#login-user-input').type('admin');
        cy.get('#login-password-input').type('foobar{enter}');
        cy.get('#host-nav').should('be.visible');
    });

    it('Change hostname', function () {
        // HACK: cypress doesn't handle frames, so go to specific frame
        cy.visit('/cockpit/@localhost/system/index.html', visit_opts)
        cy.get('#system_information_hostname_button').
            should('contain', 'localhost.localdomain').
            click();

        cy.get('.modal-dialog #sich-hostname').
            clear().
            type('marmelade');
        cy.get('#system_information_change_hostname .modal-dialog .btn-primary').click();
        cy.get('#system_information_change_hostname .modal-dialog').should('not.be.visible');

        cy.get('#system_information_hostname_button').should('contain', 'marmelade');
    });
})
