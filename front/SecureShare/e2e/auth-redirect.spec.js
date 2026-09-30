import { test, expect } from '@playwright/test'

const LOGIN_API = '**/api/v1/auth/login'

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type',
  'access-control-allow-methods': 'POST, OPTIONS',
}

// Simule l'API de login : identifiants corrects => 200 + token, sinon 401
async function mockLoginApi(page) {
  await page.route(LOGIN_API, async (route) => {
    const request = route.request()

    // requête préliminaire CORS envoyée par le navigateur avant le POST
    if (request.method() === 'OPTIONS') {
      return route.fulfill({ status: 204, headers: corsHeaders })
    }

    const { email, password } = request.postDataJSON()
    if (email === 'lucas@test.com' && password === 'Abcdef1!') {
      return route.fulfill({
        status: 200,
        headers: corsHeaders,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'faux.jwt.token' }),
      })
    }

    return route.fulfill({
      status: 401,
      headers: corsHeaders,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Identifiants invalides' }),
    })
  })
}

test.beforeEach(async ({ page }) => {
  await mockLoginApi(page)
})

test('accès à /publish : redirection vers /login puis retour sur /publish après connexion', async ({ page }) => {
  // 1. Tentative d'accès direct à /publish sans être connecté
  await page.goto('/publish')

  // 2. Redirection vers /login
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible()

  // 3. Saisie des identifiants et validation
  await page.getByPlaceholder('Email').fill('lucas@test.com')
  await page.getByPlaceholder('Mot de passe').fill('Abcdef1!')
  await page.getByRole('button', { name: 'Se connecter' }).click()

  // 4. Atterrissage effectif sur /publish (et non sur l'accueil)
  await expect(page).toHaveURL(/\/publish$/)
  await expect(page.getByRole('heading', { name: 'Connexion' })).toHaveCount(0)

  // le jeton est bien stocké dans le localStorage
  const token = await page.evaluate(() => localStorage.getItem('token'))
  expect(token).toBe('faux.jwt.token')
})

test('des identifiants incorrects affichent une erreur et restent sur /login', async ({ page }) => {
  await page.goto('/publish')
  await expect(page).toHaveURL(/\/login$/)

  await page.getByPlaceholder('Email').fill('lucas@test.com')
  await page.getByPlaceholder('Mot de passe').fill('MauvaisMdp1!')
  await page.getByRole('button', { name: 'Se connecter' }).click()

  await expect(page.getByText('Identifiants invalides')).toBeVisible()
  await expect(page).toHaveURL(/\/login$/)

  const token = await page.evaluate(() => localStorage.getItem('token'))
  expect(token).toBeNull()
})