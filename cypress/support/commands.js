import 'cypress-wait-until';
import Sendsay from 'sendsay-api';

// Авторизация
Cypress.Commands.add('sendsayAuth', () => {
  
  const sendsay = new Sendsay();

  return cy
    .fixture('user')
    .then((user) => {
      return sendsay
        .login({
          login: user.login, 
          password: user.password,
        })
        .then(() => {
          return sendsay;
        })
    })

})

// Авторизация и установка cookie
Cypress.Commands.add('sendsayLogin', () => {
  cy.sendsayAuth()
    .then((sendsay) => {
      cy.setCookie('sendsay_session', sendsay.session)
    })
})

// Ожидание загрузки страницы "/dashboard"
Cypress.Commands.add('onDashboardPage', () => (
  cy.waitUntil(() => (
    cy.then(() => {
      const titleEl = Cypress.$('.section-header__titleText');
      if (titleEl.length) {
        const title = titleEl.text();
        return title.includes('Обзор');
      }
      return false;
    })
  ))
))

// Ожидание загрузки главной страницы редактора выпуска
Cypress.Commands.add('onWizardPage', () => (
  cy.waitUntil(() => (
    cy.then(() => {
      const collVis = Cypress.$('div.Wizard-step');
      const collShaded = Cypress.$('div.Wizard-step.is-shaded');
      return (collVis.length && !collShaded.length);
    })
  ), {
    timeout: 10000,
    interval: 1000,
  })
))

// Ожидание загрузки формы настроек
Cypress.Commands.add('onFormSettingsPage', () => (
  cy.waitUntil(() => (
    cy.then(() => {
      const formVis = Cypress.$('.Wizard-step form');
      const collShaded = Cypress.$('div.Wizard-step.is-shaded');
      return (collShaded.length && formVis.length);
    })
  ))
))

// Ожидание загрузки галлереи
Cypress.Commands.add('onGalleryPage', () => (
  cy.waitUntil(() => (
    cy.then(() => {
      const titleEl = Cypress.$('.GallerySidebar-title');
      return titleEl.length;
    })
  ))
))

// Ожидание загрузки редактора
Cypress.Commands.add('onEditorPage', () => (
  cy.waitUntil(() => (
    cy.then(() => {
      const titleEl = Cypress.$('.templateEditor');
      return titleEl.length;
    })
  ))
))

// Ожидание загрузки страницы "/issues"
Cypress.Commands.add('onIssuesPage', () => (
  cy.waitUntil(() => (
    cy.then(() => {
      const titleEl = Cypress.$('.section-header__titleText');
      if (titleEl.length) {
        const title = titleEl.text();
        return title.includes('Рассылки');
      }
      return false;
    })
  ))
))

// Ожидание открытия модального окна отправки выпуска
Cypress.Commands.add('isOpenedModal', () => (
  cy.waitUntil(() => (
    cy.then(() => {
      const modal = Cypress.$('.ReactModalPortal');
      return modal.length;
    })
  ))
))

// Ожидание закрытия модального окна отправки выпуска
Cypress.Commands.add('isClosedModal', () => (
  cy.waitUntil(() => (
    cy.then(() => {
      const modal = Cypress.$('.ReactModalPortal');
      return !modal.length;
    })
  ), {
    timeout: 10000,
    interval: 1000,
  })
))

// Проверка что сообщение попало в список отправленных
Cypress.Commands.add('isSentMessage', () => (
  cy.waitUntil(() => (
    // Переходим на страницу выпусков
    cy.visit('https://app.sendsay.ru/campaigns/issues')
      .get('button.FolderItem-label')
      .contains('Отправленные')
      .click()
      .url()
      .should('include', 'byKey=sentAt')
      .wait(2000)
      .then(() => (
        cy.get('div.CampaignsRow-main')
          .find('.WordBreak')
          .first()
          // Сравниваем с заголовком, сохраненным  перед отправкой
          .then(($title) => {
            const checkTitle = localStorage.getItem('checkTitle');
            const currentTitle = $title.text();
            console.log('cur:', currentTitle, 'chek:', checkTitle);
            return Boolean(checkTitle === currentTitle);
          })
      ))
  ), {
    interval: 1000,
  })
))
