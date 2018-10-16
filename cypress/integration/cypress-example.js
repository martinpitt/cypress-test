describe('hello tautology', () => {
    it('BDD true should be equal to true', () => {
        expect(true).to.equal(true);
    });

    it('TDD 3 should be bigger than 2', () => {
        assert.isAtLeast(3, 2);
    })
})

describe('examples.cypress.io tests', () => {
    it('click on "type"', () => {
        cy.visit('https://example.cypress.io');
        cy.contains('type').click();
        cy.location('pathname').should('eq', '/commands/actions');
    });
})
