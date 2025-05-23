const fetch = require('node-fetch');
const fs = require('fs');

const API_KEY = '6ab77870d8ea9e9be0c6e259c2c5405f';
const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`;

fetch(URL)
  .then(res => res.json())
  .then(data => {
    const filmes = data.results.slice(0, 10);
    let filmesHtml = '';
    
    filmes.forEach(filme => {
      const dataLancamento = new Date(filme.release_date).toLocaleDateString('pt-BR');
      const descricao = filme.overview ? 
        (filme.overview.length > 300 ? filme.overview.substring(0, 300) + '...' : filme.overview) : 
        'Descrição não disponível';
      
      filmesHtml += `
        <li>
          <article class="filme">
            <figure>
              <img src="https://image.tmdb.org/t/p/w300${filme.poster_path}" alt="${filme.title}">
              <figcaption>${filme.title} Poster</figcaption>
            </figure>
            <div class="filme-conteudo">
              <h2>${filme.title}</h2>
              <p class="filme-descricao">${descricao}</p>
              <div class="filme-footer">
                <p>${dataLancamento}</p>
                <p>Nota: ${filme.vote_average.toFixed(1)}</p>
                <a href="https://www.themoviedb.org/movie/${filme.id}">ver no TMDB.com</a>
              </div>
            </div>
          </article>
        </li>
      `;
    });

    let html = fs.readFileSync('listas.html', 'utf8');
    
    const inicioLista = html.indexOf('<ul>', html.indexOf('id="listas"'));
    const fimLista = html.indexOf('</ul>', inicioLista) + 5;
    
    const novoHtml = html.substring(0, inicioLista) + 
                     '<ul>\n' + filmesHtml + '\n</ul>' + 
                     html.substring(fimLista);
    
    fs.writeFileSync('listas.html', novoHtml, 'utf8');
    console.log('Filmes atualizados em listas.html!');
  })
  .catch(err => console.error('Erro ao buscar filmes:', err));