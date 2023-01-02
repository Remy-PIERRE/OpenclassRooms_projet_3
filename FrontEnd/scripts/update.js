export const update_init = function() {

    modale_info_init();
}


async function modale_info_init() {

    const url = window.location.href.replace('index.html', `html/modale_update.html`);

        /* load modale_to_create from modale_to_create.html then append to body */
        try {
            let modale_fetched = await fetch(url);
            modale_fetched = await modale_fetched.text();

            const parser = new DOMParser();
            const modale_html = parser.parseFromString(modale_fetched, 'text/html');

            const modale_to_insert = modale_html.querySelector(`#modale_update`);
            
            document.body.appendChild(modale_to_insert);
        }
        catch(error) {
            console.log('error', error);
    }

    modale_info_delete_works();
    modale_info_add_works();
    modale_info_listener();

}

function modale_info_delete_works() {
/* display 'name (category)' of works to delete */
    const zone = document.querySelector('#works_to_delete');

    if(sessionStorage['delete']) {
        const works_to_delete = sessionStorage['delete'].split(' ___ ');
        works_to_delete.map(work => {
            const text = document.createElement('p');
            text.className = 'modale__update--text';
            zone.appendChild(text);
            work = work.split(' __ ');
            text.innerText = `${work[0]} ( ${work[1]} )`;
        })
        return;
    }

    /* display in case no works_to_delete */
    const text = document.createElement('p');
    text.className = 'modale__update--text';
    zone.appendChild(text);
    text.innerText = `Aucun projet à supprimer !`;
    text.style.color = '#d50000';
}

function modale_info_add_works() {
/* display 'name (category)' of works to delete */
    const zone = document.querySelector('#works_to_add');

    if(sessionStorage['add']) {
        const works_to_add = sessionStorage['add'].split(' ___ ');
        works_to_add.map(work => {
            work = work.split(' __ ');
            const text = document.createElement('p');
            text.className = 'modale__update--text';
            text.innerText = `${work[0]} ( ${work[1]} )`;
            zone.appendChild(text);
        })
        return;
    }
    const text = document.createElement('p');
    text.className = 'modale__update--text';
    text.innerText = `Aucun projet à ajouter !`;
    text.style.color = '#d50000';
    zone.appendChild(text);
}

function modale_info_listener() {
    const modale = document.querySelector('#modale_update');

    modale.addEventListener('click', (event) => {
        event.preventDefault();

        switch(event.target.id) {
            case 'modale_update':
                modale.remove();
                break;

            case 'modale_update_cancel':
                sessionStorage.removeItem('delete');
                sessionStorage.removeItem('add');
                modale.remove();
                break;

            case 'modale_update_confirm':
                (sessionStorage['add_test']) ? update_fetch_add() : null;
                (sessionStorage['delete']) ? update_fetch_delete() : null;
        }
    })
}


async function update_fetch_add() {
    const url = `http://localhost:5678/api/works`;

    console.log('window.add_works', window.add_works);
    window.add_works.map(async (work) => {
        const fetch_options = {
            method: 'POST',
            headers: {
                'Authorization': `bearer ${sessionStorage['jwt']}`,
            },
            body: work
        }
    
        try {
            var fetched_work = await fetch(url, fetch_options);
            console.log('fetch', fetched_work);
        }
        catch(error) {
            console.log(error);
        }
    })
}

function update_fetch_delete() {

    const works_to_delete = sessionStorage.getItem('delete').split(' ___ ');
    let url = 'http://localhost:5678/api/works'

    works_to_delete.map(async(work) => {

        work = work.split(' __ ');
        url = `${url}/${work[2]}`;
        const fetch_options = {
            method: 'DELETE',
            headers: {
                'Authorization': `bearer ${sessionStorage['jwt']}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        try {
            var fetched_work = await fetch(url, fetch_options);
            fetched_work = await fetched_work.json();
            console.log('fetch', fetched_work);
        }
        catch(error) {
            console.log(error);
        }


    })
}