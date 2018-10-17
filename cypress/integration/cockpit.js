/* HACK: https://github.com/cypress-io/cypress/issues/771
 * requires this in /etc/hosts: 127.0.0.2 cockpittest
 */
// const cockpit_url = 'https://cockpittest:9091';

/* or disable SSL:
 *   printf '[Webservice]\nAllowUnencrypted = true\n' >> /etc/cockpit/cockpit.conf
 */
// FIXME: set baseUrl
const cockpit_url = 'http://127.0.0.2:9091';

function login() {
    cy.visit(cockpit_url + "/system");
    cy.get('#authorized-input').
        click().
        should('be.checked');
    cy.get('#login-user-input').type('admin');
    cy.get('#login-password-input').type('foobar{enter}');
    cy.get('#host-nav').should('be.visible');
}

describe('cockpit demo', () => {
    it('"Other options" expansion', () => {
        cy.visit(cockpit_url);
        cy.get('#server-field').should('not.be.visible');
        cy.get('#show-other-login-options').should('be.visible').click();
        cy.get('#server-field').should('be.visible');
        cy.get('#show-other-login-options').click();
        cy.get('#server-field').should('not.be.visible');
    });

    it('Change hostname', () => {
        login();
        // HACK: cypress doesn't handle frames, so go to specific frame
        cy.visit(cockpit_url + "/cockpit/@localhost/system/index.html");
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
