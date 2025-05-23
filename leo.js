const fetch = require('node-fetch');
const fs = require('fs');

const API_KEY = '6ab77870d8ea9e9be0c6e259c2c5405f';
const URL = `https://api.themoviedb.org/3/movie/popular?api_key=6ab77870d8ea9e9be0c6e259c2c5405f&language=pt-BR&page=1`;

fetch(URL)
  .then(res => res.json())
  .then(data => {
    const filmes = data.results.slice(0, 10); // Pega 10 filmes
    let filmesHtml = '';
    filmes.forEach(filme => {
      filmesHtml += `
        <li class="caixa-filme">
          <article class="filme">
            <img src="https://image.tmdb.org/t/p/w200${filme.poster_path}" alt="${filme.title}">
            <h2>${filme.title}</h2>
          </article>
        </li>
      `;
    });

    // Lê o leo.html
    let html = fs.readFileSync('leo.html', 'utf8');
    // Substitui o conteúdo da lista de filmes
    html = html.replace(
      /<ul id="filmes-lista">[\s\S]*?<\/ul>/,
      `<ul id="filmes-lista">\n${filmesHtml}\n</ul>`
    );
    // Salva o novo HTML
    fs.writeFileSync('leo.html', html, 'utf8');
    console.log('Filmes atualizados em leo.html!');
  })
  .catch(err => console.error(err));