'use strict'

const API = {
  characters:    'https://starwars-databank-server.onrender.com/api/v1/characters',
  locations:     'https://starwars-databank-server.onrender.com/api/v1/locations',
  organizations: 'https://starwars-databank-server.onrender.com/api/v1/organizations',
  species:       'https://starwars-databank-server.onrender.com/api/v1/species',
}


async function fetchFromAPI(endpoint, search) {
  const url = `${endpoint}/name/${encodeURIComponent(search)}`
  const response = await fetch(url)
  if (response.status === 404) return []
  if (!response.ok) throw new Error(`Erro: ${response.status}`)
  const data = await response.json()
  if (Array.isArray(data)) return data
  if (data.docs) return data.docs
  return []
}


function createCard(item) {
  const card = document.createElement('div')
  card.classList.add('card')

  const img = document.createElement('img')
  img.src = item.image || ''
  img.alt = item.name || ''
  img.loading = 'lazy'
  img.onerror = () => { img.style.display = 'none' }

  const info = document.createElement('div')
  info.classList.add('card-info')

  const nameEl = document.createElement('p')
  nameEl.classList.add('card-name')
  nameEl.innerHTML = `<span class="label">NAME:</span> ${item.name || '—'}`

  const descEl = document.createElement('p')
  descEl.classList.add('card-desc')
  descEl.innerHTML = `<span class="label">DESCRIPTION:</span> ${item.description || '—'}`

  info.appendChild(nameEl)
  info.appendChild(descEl)
  card.appendChild(img)
  card.appendChild(info)

  return card
}


function initSearchPage() {
  const main        = document.querySelector('main')
  const inputBusca  = document.getElementById('buscar')
  const btnBuscar   = document.getElementById('botao-pesquisar')
  const btnRetornar = document.getElementById('retornar')

  if (!main || !inputBusca || !btnBuscar) return

  const cardsContainer = document.createElement('div')
  cardsContainer.id    = 'cards-container'
  main.appendChild(cardsContainer)

  const endpointKey = document.body.dataset.endpoint || 'characters'
  const endpoint    = API[endpointKey]

  async function buscar() {
    const termo = inputBusca.value.trim()
    if (!termo) return

    cardsContainer.innerHTML = '<p class="msg-status">Carregando...</p>'

    try {
      const items = await fetchFromAPI(endpoint, termo)
      cardsContainer.innerHTML = ''
      items.forEach(item => cardsContainer.appendChild(createCard(item)))
    } catch (err) {
      cardsContainer.innerHTML = `<p class="msg-status erro">Erro: ${err.message}</p>`
    }
  }

  btnBuscar.addEventListener('click', buscar)
  inputBusca.addEventListener('keydown', (e) => { if (e.key === 'Enter') buscar() })

  if (btnRetornar) {
    btnRetornar.style.cursor = 'pointer'
    btnRetornar.addEventListener('click', () => { window.location.href = './index.html' })
  }
}


function initIndexPage() {
  const catalogo = document.querySelector('.catalogo')
  if (!catalogo) return

  const links = {
    characters:    './characters.html',
    locations:     './locations.html',
    species:       './species.html',
    organizations: './organizations.html',
  }

  catalogo.querySelectorAll('div').forEach((div) => {
    const p = div.querySelector('p')
    if (!p) return
    const key = p.textContent.toLowerCase().trim()
    if (links[key]) {
      div.addEventListener('click', () => { window.location.href = links[key] })
    }
  })
}


document.addEventListener('DOMContentLoaded', () => {
  initIndexPage()
  initSearchPage()
})