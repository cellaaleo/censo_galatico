// retorna o link da próxima página
async function getNextLink(link) {
    let result = await fetch(link);
    let page = await result.json();
    return page.next; 
}


// retona um array de sequência de links
async function getLinks(link) {
    let arr = [link];
    let newLink = await getNextLink(link);

    while (newLink != null) {
        arr.push(newLink);
        newLink = await getNextLink(newLink);
    }
    return arr;
}

let planets_list = document.getElementById("planets_list");
let searchInput = document.getElementById('search-input');
let result = document.getElementById('result');


// recebe um array de links dos residentes e cria linhas da tabela Habitantes com info de cada um
async function getNames(arr) {
    let table = document.getElementById("residents");

    for(let i = 0; i < arr.length; i++) {
        let result = await fetch(`${arr[i]}?format=json`);
        let resident = await result.json();

        let tr = document.createElement('tr');
        tr.innerHTML = `<td>${resident.name}</td>
                        <td>${resident.birth_year}</td>`;
        table.appendChild(tr);
    }

    table.classList.remove('hidden');
}


// traz a informação do planeta ao clicar no nome ou ao digitar o nome no campo de busca
async function getData(planet) {
    let div = document.createElement('div');
    div.setAttribute("class", "change");
    div.innerHTML = `<p><strong>Planeta:</strong> ${planet.name}</p>
                    <p><strong>Clima:</strong> ${planet.climate}</p>
                    <p><strong>População:</strong> ${planet.population}</p>
                    <p><strong>Terreno:</strong> ${planet.terrain}</p>
                    <table id="residents" class="hidden">
                        <tr>
                            <th colspan="2" id="table-title">Habitantes</th>
                        </tr>
                        <tr>
                            <th>Nome</th>
                            <th>Ano de Nascimento</th>
                        </tr>
                    </table>`;

    if (result.childElementCount < 1) {
        result.appendChild(div);
    } else {
        let change = document.querySelector(".change");
        result.replaceChild(div, change);
    }

    getNames(planet.residents);
    result.classList.remove('hidden');
}


// cria lista de botões com os nomes dos planetas e passa os eventos de pesquisa
async function showPlanets(link){
    let result = await fetch(link);
    let object = await result.json();
    let planets = object.results;

    planets.forEach((planet) => {
        let button = document.createElement('button');
        button.setAttribute('class', 'button')
        button.innerHTML = planet.name;
        planets_list.appendChild(button);

        click(button, planet);
        search(button, planet);
    });   
}


function click(button, planet) {
    button.addEventListener("click", function() {
        getData(planet);

        searchInput.value = "";

        const allButtons = document.querySelectorAll(".button");
        allButtons.forEach((b) => b.style.cssText = '');
    });
}

function search(button, planet) {
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        let name = planet.name.toLowerCase();

        if (searchTerm == name) {
            getData(planet);
        } else if (name.startsWith(searchTerm)) {
            button.style.cssText = '';
            result.classList.add('hidden');
        } else {
            button.style.cssText = 'color: black; background: black;';
        }
    });
}


// dado o primeiro link, usa a função getLinks e traz a lista de todas as páginas com a função showPlanets
async function planetsList() {
    let links = await getLinks("https://swapi.dev/api/planets/?format=json");
    links.forEach((link) => showPlanets(link));
    
}
planetsList();
