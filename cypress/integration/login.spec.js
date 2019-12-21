/// <reference types="Cypress" />

describe('Вход в приложение', function() {

  beforeEach(function() {
    cy.visit('https://app.sendsay.ru/signin');

    cy.fixture('user')
      .as('user');

  })

  it('Переключение между формами', function() {
    
    // Переключаемся на корпоративную форму
    cy.get('form.signin-form')
    cy.get('a[href="/signin/corporate"]')
      .click()
    
    // Переключаемся на стандартную форму
    cy.get('form.corporate-signin-form')
    cy.get('a[href="/signin"]')
      .click()

    // Проверяем что вернулись
    cy.get('form.signin-form')
    cy.get('a[href="/signin/corporate"]')

  })

  it.skip('Забыли пароль?', function () {
    
    // Жмем кнопку "Забыли пароль?"
    cy.get('a[href^="/signin/forgot-password"]')
      .click()

    // Вводим фейковый логин и отправляем форму
    cy.get('form[class*="forgot-password-form"]')
      .find('input[name="login"]')
      .as('inputLoginForgot')
      .type('fakeemail@fakedomain.com{enter}')

    // Проверяем что всплыла ошибка
    cy.get('*.forgot-password-form__error')
      .should('be.visible')

    // Вводим настоящие данные и отправляем форму
    cy.get('@user')
      .then((user) => {
        cy.get('@inputLoginForgot')
          .clear()
          .type(`${user.login}{enter}`)
      })

    // Проверяем что всплыло сообщение об успешной отправке
    cy.get('*.reset-intstructions-sent')
    
  })

  it('Стандартный вход: Требует пароль', function () {

    cy.get('@user')
      .then((user) => {
        // Вводим логин и отправляем форму
        cy.get('form.signin-form')
          .as('form')
          .find('input[name="login"]')
          .type(`${user.login}{enter}`)

        // Проверяем что остались на той же странице
        cy.url()
          .should('include', '/signin')

        cy.get('@form')
    })
    
  })

  it('Стандартный вход: Требует логин', function () {

    cy.get('@user')
      .then((user) => {
        // Вводим пароль и отправляем форму
        cy.get('form.signin-form')
          .as('form')
          .find('input[name="password"]')
          .type(`${user.password}{enter}`)

        // Проверяем что остались на той же странице
        cy.url()
          .should('include', '/signin')
        
        cy.get('@form')
    })
    
  })

  it('Корпоративный вход: Требует пароль', function () {

    cy.get('@user')
      .then((user) => {
        // Переключаемся на корпоративную форму
        cy.get('a[href="/signin/corporate"]')
          .click()

        // Вводим логин и саблогин, отправляем форму
        cy.get('form.corporate-signin-form')
          .as('form')
          .find('input[name="login"]')
          .type(user.login)

        cy.get('@form')
          .find('input[name="sublogin"]')
          .type(`${user.sublogin}{enter}`)

        // Проверяем что остались на той же странице
        cy.url()
          .should('include', '/signin/corporate')

        cy.get('@form')
    })
    
  })

  it('Корпоративный вход: Требует саблогин', function () {

    cy.get('@user')
      .then((user) => {
        // Переключаемся на корпоративную форму
        cy.get('a[href="/signin/corporate"]')
          .click()

        // Вводим логин и пароль, отправляем форму
        cy.get('form.corporate-signin-form')
          .as('form')
          .find('input[name="login"]')
          .type(user.login)

        cy.get('@form')
          .find('input[name="password"]')
          .type(`${user.password}{enter}`)

        // Проверяем что остались на той же странице
        cy.url()
          .should('include', '/signin/corporate')

        cy.get('@form')
    })
    
  })

  it('Стандартный вход: Неправильный пароль', function () {

    cy.get('@user')
      .then((user) => {
        // Вводим логин
        cy.get('form.signin-form')
          .as('form')
          .find('input[name="login"]')
          .type(user.login)

        // Вводим неправильный пароль, отправляем форму
        cy.get('@form')
          .find('input[name="password"]')
          .type('fakePassword123{enter}')

        // Проверяем что остались на той же странице
        cy.url()
          .should('include', '/signin')
    })
    
  })

  it('Корпоративный вход: Неправильный пароль', function () {

    cy.get('@user')
      .then((user) => {
        // Переключаемся на корпоративную форму
        cy.get('a[href="/signin/corporate"]')
          .click()

        // Вводим логин
        cy.get('form.corporate-signin-form')
          .as('form')
          .find('input[name="login"]')
          .type(`${user.login}`)

        // Вводим саблогин
        cy.get('@form')
          .find('input[name="sublogin"]')
          .type(`${user.sublogin}`)

        // Вводим неправильный пароль
        cy.get('@form')
          .find('input[name="password"]')
          .type('fakePassword123{enter}')

        // Проверяем что остались на той же странице
        cy.url()
          .should('include', '/signin/corporate')
    })
    
  })

  it('Стандартный вход: Успешно', function () {

    cy.get('@user')
      .then((user) => {
        // Вводим логин
        cy.get('form.signin-form')
          .as('form')
          .find('input[name="login"]')
          .type(`${user.login}`)

        // Вводим пароль
        cy.get('@form')
          .find('input[name="password"]')
          .type(`${user.password}{enter}`)

        // Дожидамся ухода со страницы входа
        cy.onDashboardPage().then(() => {
          // Убеждаемся что ушли со страницы входа
          cy.url()
            .should('not.include', '/signin')
        })
    })
    
  })

  it('Корпоративный вход: Успешно', function () {

    cy.get('@user')
      .then((user) => {
        // Переключаемся на корпоративную форму
        cy.get('a[href="/signin/corporate"]')
          .click()

        // Вводим логин
        cy.get('form.corporate-signin-form')
          .as('form')
          .find('input[name="login"]')
          .type(`${user.login}`)

        // Вводим саблогин
        cy.get('@form')
          .find('input[name="sublogin"]')
          .type(`${user.sublogin}`)

        // Вводим пароль
        cy.get('@form')
          .find('input[name="password"]')
          .type(`${user.subpassword}{enter}`)

        // Дожидаемся загрузки страницы '/dashboard'
        cy.onDashboardPage().then(() => {
          // Убеждаемся что ушли со страницы входа
          cy.url()
            .should('not.include', '/signin')
        })

    })
    
  })
  
})
