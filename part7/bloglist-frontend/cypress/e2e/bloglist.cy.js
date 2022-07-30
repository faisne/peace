before(() => {
  cy.clearLocalStorage('user')
  cy.request('POST', 'http://localhost:3000/api/testing/reset')
  const user1 = { 
    name: 'Fa Isne', 
    username: 'faisne',
    password: '123123' 
  }
  const user2 = {
    username: 'anna',
    password: 'abc'
  }
  cy.request('POST', 'http://localhost:3000/api/users/', user1)
  cy.request('POST', 'http://localhost:3000/api/users/', user2)
  cy.visit('http://localhost:3000')
})

it('doesn\'t log in with wrong password', () => {
  cy.get('input:first').type('faisne')
  cy.get('input:last').type('000')
  cy.get('button').click()
  cy.contains('Invalid username or password').should('have.css', 'background-color', 'rgb(255, 221, 221)')
})

it('logs in', () => {
  cy.get('input:last').clear().type('123123')
  cy.get('button').click()
})

it('creates a blog', () => {
  cy.contains('Add blog...').click()
  cy.contains('Title').find('input').type('My new blog')
  cy.contains('Author').find('input').type('Manny')
  cy.contains('URL').find('input').type('https://manny.blog.org')
  cy.get('form').submit()
  cy.contains('My new blog, Manny')
})

it('can like a blog', () => {
  cy.contains('Expand').click()
  cy.contains('Like').click()
  cy.contains('1 like')
})

it('can\'t delete other\'s blog', () => {
  cy.contains('Log out').click()
  cy.get('input:first').type('anna')
  cy.get('input:last').type('abc')
  cy.get('button').click()
  cy.contains('Expand').click()
  cy.contains('Delete').should('not.exist')
})

it('can delete own blog', () => {
  cy.contains('Add blog...').click()
  cy.contains('Title').find('input').type('10 best ways to pet cats')
  cy.contains('Author').find('input').type('Anna')
  cy.contains('URL').find('input').type('https://cats.anna.net')
  cy.get('form').submit()
  cy.contains('Expand').click()
  cy.contains('Delete').click()
  cy.contains('10 best ways').should('not.exist')
})

it('blogs are ordered by likes', () => {
  cy.contains('Add blog...').click()
  cy.contains('Title').find('input').type('Travel diaries')
  cy.contains('Author').find('input').type('Vasya')
  cy.contains('URL').find('input').type('https://vasya.blogs.net')
  cy.get('form').submit()
  cy.contains('Expand').click()
  cy.get('button.like').eq(1).click().wait(1000).click().wait(1000)
  cy.get('li').eq(0).contains('Travel diaries')
})