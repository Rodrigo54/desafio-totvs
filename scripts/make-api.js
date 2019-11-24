const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const ProgressBar = require('progress');

let pokedex = [];

function criarJson(dados) {
  const file = path.join('src/assets', 'pokedex.json');
  fs.writeFile(
    file,
    JSON.stringify(dados, null, 2),
    'utf8',
    (erro) => {
      if (erro) {
        throw erro;
      }
      console.log('Arquivo salvo');
    }
  );
}

async function run() {
  let tempArray = [];
  const browser = await puppeteer.launch();
  const pokedexPage = await browser.newPage();

  await pokedexPage.goto('https://pokemondb.net/pokedex/all');
  await pokedexPage.waitFor(1000);
  const initSelector = await pokedexPage.$('#pokedex');
  const rows = await initSelector.$$('tbody>tr');

  let bar = new ProgressBar('Search [:bar] :id :name :percent time - :etas', {
    complete: '█',
    incomplete: ' ',
    width: 20,
    total: rows.length
  });

  for (const element of rows) {
    let url = await element.$eval('.ent-name', node => node.getAttribute('href'));
    let id = await element.$eval('.infocard-cell-data', node => node.textContent.trim());
    const name = await element.$eval('.ent-name', node => node.textContent.trim());
    const total = await element.$eval('.cell-total', node => node.textContent.trim());
    const hp = await element.$eval('.cell-num:nth-child(5)', node => node.textContent.trim());
    const attack = await element.$eval('.cell-num:nth-child(6)', node => node.textContent.trim());
    const defense = await element.$eval('.cell-num:nth-child(7)', node => node.textContent.trim());
    const spAtk = await element.$eval('.cell-num:nth-child(8)', node => node.textContent.trim());
    const spDef = await element.$eval('.cell-num:nth-child(9)', node => node.textContent.trim());
    const speed = await element.$eval('.cell-num:nth-child(10)', node => node.textContent.trim());
    const type = await element.$$eval('.cell-icon>a', nodes => nodes.map(element => element.textContent));
    const icon = await element.$eval('.infocard-cell-img .icon-pkmn', node => {
      const src = node.getAttribute('src');
      const data = node.getAttribute('data-src');
      return src ? src : data;
    });
    url = `https://pokemondb.net${url}`;
    id = parseInt(id, 10);
    bar.tick({ name, id });
    tempArray.push({ id, name, url, total, hp, attack, defense, spAtk, spDef, speed, icon, type });
  }
  await pokedexPage.close();
  const distinct = [...new Set(tempArray.map(x => x.id))];
  tempArray = Array.from(distinct).map(id => {
    return tempArray.find(i => i.id === id);
  });

  bar = new ProgressBar('pokedex progress [:bar] :id :name :percent time - :etas', {
    complete: '█',
    incomplete: ' ',
    width: 20,
    total: tempArray.length
  });

  for (const element of tempArray) {
    const { name, id } = element;
    bar.tick({ name, id });
    const browser = await puppeteer.launch();
    const pokemonPage = await browser.newPage();
    await pokemonPage.goto(element.url);
    const mainSelector = await pokemonPage.$('main.main-content');
    const img = await mainSelector.$eval(`.tabs-panel .grid-col.span-md-6.span-lg-4.text-center img`, node => node.getAttribute('src'));
    const description = await mainSelector.$eval('div:nth-child(4) > div.grid-col.span-md-6.span-lg-8', node => node.textContent.trim());
    const species = await mainSelector.$eval('.vitals-table tr:nth-child(3) td', node => node.textContent.trim());
    const height = await mainSelector.$eval('.vitals-table tr:nth-child(4) td', node => node.textContent.trim());
    const weight = await mainSelector.$eval('.vitals-table tr:nth-child(5) td', node => node.textContent.trim());
    await pokemonPage.close();
    await browser.close();
    pokedex.push({ ...element, description, img, species, height, weight });
  }

  await browser.close();
  criarJson(pokedex);
}


async function test() {
  const browser = await puppeteer.launch();
  const pokemonPage = await browser.newPage();
  await pokemonPage.goto('https://pokemondb.net/pokedex/axew');
  const mainSelector = await pokemonPage.$('main.main-content');
  const img = await mainSelector.$eval(`.tabs-panel .grid-col.span-md-6.span-lg-4.text-center img`, node => node.getAttribute('src'));
  const description = await mainSelector.$eval('div:nth-child(4) > div.grid-col.span-md-6.span-lg-8', node => node.textContent.trim());
  const species = await mainSelector.$eval('.vitals-table tr:nth-child(3) td', node => node.textContent.trim());
  const height = await mainSelector.$eval('.vitals-table tr:nth-child(4) td', node => node.textContent.trim());
  const weight = await mainSelector.$eval('.vitals-table tr:nth-child(5) td', node => node.textContent.trim());
  await pokemonPage.close();
  await browser.close();
  criarJson({ description, img, species, height, weight });
}


run();
