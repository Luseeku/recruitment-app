import { time } from "console";

describe('Each page from toolbar', () => {
  beforeEach(() => {
    cy.visit('localhost:4200')
  })

  it('Check link in buttons on welcome page and click on it', ()=> {
    cy.get('[href="https://angular.io/tutorial"]').as('TutorialButton');
    cy.get('@TutorialButton').should('have.attr', 'href').and('include', 'https://angular.io/tutorial');
    cy.get('@TutorialButton').click();
    cy.get('[href="https://angular.io/cli"]').as('CLIbutton');
    cy.get('@CLIbutton').should('have.attr', 'href').and('include', 'https://angular.io/cli');
    cy.get('@CLIbutton').click();
    cy.get('[href="https://blog.angular.io/"]').as('BlogButton');
    cy.get('@BlogButton').should('have.attr', 'href').and('include', 'https://blog.angular.io/');
    cy.get('@BlogButton').click();
    cy.get('[href="https://angular.io/devtools/"]').as('DevToolsButton');
    cy.get('@DevToolsButton').should('have.attr', 'href').and('include', 'https://angular.io/devtools');
    cy.get('@DevToolsButton').click();
  })

  it('Click through each link in toolbar', () => {
  // Verify that the toolbar is present and contains the expected links
    cy.get('.toolbar').within(() => {
      cy.get('a').should('have.length', 5);
      cy.get('a').eq(0).should('have.text', 'Welcome');
      cy.get('a').eq(1).should('have.text', 'Form');
      cy.get('a').eq(2).should('have.text', 'Stepper');
    });
    // Click the Form link in the toolbar
    cy.get('.toolbar a').eq(1).click();
    // Verify that the Form page has loaded correctly by checking the label titles
    cy.get(':nth-child(1) > label').should('have.text', 'Name');
    cy.get(':nth-child(2) > label').should('have.text', 'Alter Ego');
    cy.get(':nth-child(3) > label').should('have.text', 'Hero Power');
   
    // Verify that the Form page buttons contains the expected text
    cy.get('.btn-success').should('have.text', 'Submit');
    cy.get('.btn-default').should('have.text', 'New Hero');

    // Click the Stepper link in the toolbar
    cy.get('.toolbar a').eq(2).click();

    // Verify that the Stepper page has loaded correctly by checking the label title
    cy.get('#cdk-step-label-0-0 > .mat-step-label > .mat-step-text-label').should('have.text', 'Fill out your name');

    // Verify that the Stepper page contains the expected form fields
    cy.get('#cdk-step-content-0-0 > form.ng-untouched').within(() => {
      cy.get('label').should('have.length', 1);
      cy.get('label').eq(0).should('have.text', 'Name *');
      cy.get('input').should('have.length', 1);
    });

  }) 

  it('Welcome page Next Steps section test', ()=>{
    cy.get(':nth-child(8) > :nth-child(1)').click();
    cy.get('pre').should('have.text', 'ng generate component xyz');
    cy.get(':nth-child(8) > :nth-child(2)').click();
    cy.get('pre').should('have.text', 'ng add @angular/material');
    cy.get(':nth-child(8) > :nth-child(3)').click();
    cy.get('pre').should('have.text', 'ng add @angular/pwa');
    cy.get(':nth-child(8) > :nth-child(4)').click();
    cy.get('pre').should('have.text', 'ng add _____');
    cy.get(':nth-child(8) > :nth-child(5)').click();
    cy.get('pre').should('have.text', 'ng test');
    cy.get(':nth-child(8) > :nth-child(6)').click();
    cy.get('pre').should('have.text', 'ng build');
    
  })

  it('Form submit test - incorrect flow without providing power', ()=>{
    cy.get('.toolbar a').eq(1).click();
    cy.get('.btn-success').click();
    cy.get('h2').should('have.text', 'You submitted the following:');
    cy.get(':nth-child(1) > .btn').click();
    cy.get('.btn-default').click();
    cy.get('#name').type('Batman');
    cy.get('.btn-success').should('be.disabled', 'true')
  })
  it('Form submit test - incorrect flow without providing name ', ()=>{
    cy.get('.toolbar a').eq(1).click();
    cy.get('.btn-success').click();
    cy.get('h2').should('have.text', 'You submitted the following:');
    cy.get(':nth-child(1) > .btn').click();
    cy.get('.btn-default').click();
    cy.get('#power').select('Super Hot');
    cy.get('.btn-success').should('be.disabled', 'true')
  })

  it('Form submit test - correct flow', ()=>{
    cy.get('.toolbar a').eq(1).click();
    cy.get('.btn-success').click();
    cy.get('h2').should('have.text', 'You submitted the following:');
    cy.get(':nth-child(1) > .btn').click();
    cy.get('.btn-default').click();
    cy.get('#name').type('Batman');
    cy.get('#power').select('Super Hot');
    cy.get('.btn-success').click();
    cy.get(':nth-child(2) > .col-xs-9').should('have.text', 'Batman');
    cy.get(':nth-child(4) > .col-xs-9').should('have.text', 'Super Hot');

  })

  it('Stepper page test - incorrect flow without providing name', ()=>{
    cy.get('.toolbar a').eq(2).click();
    cy.get('button').contains("Next").click();
    cy.get('#cdk-step-content-0-1 > form.ng-star-inserted > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix').should('not.have.css','-webkit-text-fill-color','rgb(0,0,0)');

  })

  it('Stepper page test - incorrect flow without providing adress', ()=>{
    cy.get('.toolbar a').eq(2).click();
    cy.get('#cdk-step-content-0-0 > form.ng-pristine > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix').type('Jamie');
    cy.get('button').contains("Next").click();
    cy.get('button').contains("Next").click({force: true});
    cy.get('#cdk-step-content-0-1 > form.ng-star-inserted > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix').should('not.have.css','-webkit-text-fill-color','rgb(0,0,0)');

  })

  it('Stepper page test - correct flow with back and reset', ()=>{
    cy.get('.toolbar a').eq(2).click();
    cy.get('#cdk-step-content-0-0 > form.ng-pristine > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix').type('Jamie');
    cy.get('button').contains("Next").click();
    cy.get('#mat-input-1').type('NewYork');
    cy.get('button').contains("Next").click({force: true});
    cy.get('#cdk-step-content-0-2 > :nth-child(1)').should('have.text', 'You are now done!');
    cy.get('#cdk-step-content-0-2 > :nth-child(2)').should('have.text', ' Name: Jamie ');
    cy.get('button').contains("Back").click({force: true});
    cy.get('#mat-input-1').clear().type('Cracow');
    cy.get('button').contains("Next").click({force: true});
    cy.get('#cdk-step-content-0-2 > :nth-child(3)').should('have.text', ' Address: Cracow ');
    cy.get('button').contains("Reset").click({force: true});
    cy.get('#cdk-step-label-0-0 > .mat-step-label > .mat-step-text-label').should('have.text', 'Fill out your name');
  })
})
