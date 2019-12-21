/// <reference types="Cypress" />

describe('Рассылки', function() {

  before(function() {
    cy.sendsayLogin()
  })

  after(function() {
    cy.clearCookies()
  })

  beforeEach(function () {
    Cypress.Cookies.preserveOnce('sendsay_session')
    cy.visit('https://app.sendsay.ru/campaigns/issues')
  })

  it('Создание выпуска', function() {

    // Проверяем что мы на гравной странице рассылок
    cy.onIssuesPage().then(() => {
      // Клик по кнопке создания рассылки
      cy.get('button.action-button__main')
        .should('have.length', 1)
        .click()

      // Выбираем рассылку Email
      cy.get('button.ChannelMenuItem')
        .contains('Email')
        .should('have.length', 1)
        .click()
    })

    // Проверяем что мы на странице создания новой рассылки
    cy.onWizardPage().then(() => {
      // Устанавливаем переменные для каждого раздела
      cy.get('div.Wizard-step:nth-child(1)')
        .as('audience')

      cy.get('div.Wizard-step:nth-child(2)')
        .as('sender')

      cy.get('div.Wizard-step:nth-child(3)')
        .as('letter')

      cy.get('div.Wizard-step:nth-child(4)')
        .as('settings')

      cy.get('div.Wizard-step:nth-child(5)')
        .as('dispatch')
    })
    
    // АУДИТОРИЯ

    // Открываем выбор аудитории
    cy.get('@audience')
      .find('.WizardStep-title')
      .should('have.length', 1)
      .click()

    // Проверяем что открылась форма редактирования
    cy.onFormSettingsPage().then(() => {
      // Открываем выпадающее меню
      cy.get('div.ActiveCampaignRecipientsStep')
        .as('audienceForm')
        .find('.SelectButton')
        .find('button')
        .should('have.length', 1)
        .click()

      // Выбираем "Доступные для рассылки email"
      cy.get('.Dropdown-content')
        .as('dropdown')
        .find('button[title*="Доступные"]')
        .should('have.length', 1)
        .click()

      // Сохраняем
      cy.get('@audienceForm')
      .find('.WizardStepSubmitAndCloseButtons-submitButton')
      .find('button')
      .should('be.visible')
      .click()
    })

    cy.onWizardPage().then(() => {
      // Изменяем настройки
      cy.get('@audience')
        .find('button')
        .contains('Изменить')
        .should('have.length', 1)
        .click()
    })

    cy.onFormSettingsPage().then(() => {
      // Ограничить количество получателей
      cy.get('@audienceForm')
        .find('button')
        .contains('Ограничить')
        .should('have.length', 1)
        .click()

      // Устанавливаем ограничение
      cy.get('@audienceForm')
        .find('input[name="limitValue"]')
        .as('inputLimit')
        .clear()
        .type('35')

      // Выбираем ограничение по количеству
      cy.get('@inputLimit')
        .closest('div')
        .find('button')
        .should('have.length', 1)
        .click()

      cy.get('@dropdown')
        .find('button')
        .last()
        .click()

      // Проверяем поле информации об ограничении
      cy.get('@audienceForm')
        .find('*')
        .contains('Не более 35 из выбранной аудитории')
        .should('have.length', 1)

      // Сохраняем
      cy.get('@audienceForm')
        .find('.WizardStepSubmitAndCloseButtons-submitButton')
        .find('button')
        .click({ force: true })
    })


    // ОТПРАВИТЕЛЬ И ТЕМА

    cy.onWizardPage().then(() => {
      // Открываем форму
      cy.get('@sender')
        .find('.WizardStep-title')
        .should('have.length', 1)
        .click()
    })

    cy.onFormSettingsPage().then(() => {
      // Выбираем отправителя
      cy.get('div.ActiveCampaignEmailHeadersStep')
        .as('senderForm')
        .find('div.Fieldset-item:nth-child(1)')
        .find('textarea')
        .should('have.length', 1)
        .click()

      cy.get('@dropdown')
        .find('button')
        .first()
        .click()

      // Указываем тему письма
      cy.get('@senderForm')
        .find('div.Fieldset-item:nth-child(3)')
        .find('textarea')
        .should('have.length', 1)
        .type('Test: Cypress')

      // Сохраняем
      cy.get('@senderForm')
        .find('div.WizardStepSubmitAndCloseButtons-submitButton')
        .find('button')
        .click()
    })

    // ПИСЬМО

    cy.onWizardPage().then(() => {
      // Открываем редактор
      cy.get('@letter')
        .find('.WizardStep-title')
        .should('have.length', 1)
        .click()
    })

    cy.onGalleryPage().then(() => {
      // Выбираем шаблон "Акция"
      cy.get('div.GalleryCard:nth-child(6)')
        .find('button', { force: true })
        .should('have.length', 1)
        .click({ force: true })
    })
    
    cy.onEditorPage().then(() => {
      // Сохранить и закрыть
      cy.get('button.js-save-and-exit')
        .click()
    })

    cy.onWizardPage().then(() => {
      // Проверяем что отправка уже доступна
      cy.get('@dispatch')
        .find('button')
        .contains('Отправить')
        .should('have.length', 1)
    })

    // ДОПОЛНИТЕЛЬНЫЕ НАСТРОЙКИ

    // Открываем форму
    cy.get('@settings')
      .find('.WizardStep-title')
      .should('have.length', 1)
      .click()


    cy.onFormSettingsPage().then(() => {
      // Включаем отслеживание аналитики
      cy.get('div.ActiveCampaignExtraSettingsStep')
        .as('settingsForm')
        .find('input[type="checkbox"]')
        .first()
        .check({force: true})

      // Передаём доп.данные
      cy.get('@settingsForm')
        .find('input[type="checkbox"]')
        .last()
        .check({force: true})

      cy.get('@settingsForm')
        .find('textarea')
        .last()
        .type('test-cypress')

      // Сохраняем
      cy.get('@settingsForm')
        .find('.WizardStepSubmitAndCloseButtons-submitButton')
        .find('button')
        .should('have.length', 1)
        .click({force: true})
    })

    // ОТПРАВКА

    cy.onWizardPage().then(() => {
      // Сохраняем название выпуска
      cy.get('h1')
        .find('div.section-header__titleText')
        .then(($div) => {
          const text = $div.text();
          localStorage.setItem('checkTitle', text);
        })

      // Отправляем рассылку
      cy.get('@dispatch')
        .find('button')
        .contains('Отправить')
        .should('have.length', 1)
        .click()
    })

    // Подтверждаем отправку
    cy.isOpenedModal().then(() => {
      cy.get('div.dialog__action-button')
        .find('button')
        .click()
    })

    // Проверяем, создалась ли рассылка
    cy.isClosedModal().then(() => {
      cy.isSentMessage().then(() => {
        cy.log('Сообщение успешно отправлено')
      })
    })

  })
})
