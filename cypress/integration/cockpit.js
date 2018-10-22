function login() {
    cy.visit("/system");
    cy.get('#authorized-input').
        click().
        should('be.checked');
    cy.get('#login-user-input').type('admin');
    cy.get('#login-password-input').type('foobar{enter}');
    cy.get('#host-nav').should('be.visible');
}

describe('cockpit demo', () => {
    beforeEach('start VM', function () {
        cy.task('startVM', 'fedora-29').then(url => {
            Cypress.config('baseUrl', url);
            cy.task('runVM', "printf '[Webservice]\\nAllowUnencrypted = true\\n' >> /etc/cockpit/cockpit.conf; systemctl start cockpit.socket; systemctl status cockpit.socket").then(out => {
            });
        });
    });

    afterEach('stop VM', function() {
        cy.task('stopVM');
    });

    it('"Other options" expansion', function () {
        cy.visit('/');
        cy.get('#server-field').should('not.be.visible');
        cy.get('#show-other-login-options').should('be.visible').click();
        cy.get('#server-field').should('be.visible');
        cy.get('#show-other-login-options').click();
        cy.get('#server-field').should('not.be.visible');
    });

    it('Change hostname', function () {
        login();
        // HACK: cypress doesn't handle frames, so go to specific frame
        cy.visit("/cockpit/@localhost/system/index.html");
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
