const module_modale_error = './modale_error.js';
// const module_modale_listener = './modale_listener.js';



export const update_init = async function() {
    await modale_info_init();
    modale_info_listener();
}


async function modale_info_init() {
    const url = window.location.href.replace('index.html', `html/modale_update.html`);

        /* load modale_update from modale_update.html then append to body */
        try {
            let modale_fetched = await fetch(url);
            modale_fetched = await modale_fetched.text();

            const parser = new DOMParser();
            const modale_html = parser.parseFromString(modale_fetched, 'text/html');

            const modale_to_insert = modale_html.querySelector(`#modale_update`);
            document.body.appendChild(modale_to_insert);
        }
        catch(error) {
            /* under construction => modale_listener.js */
            await import(module_modale_error).then(__ => __.modale_error_init());
            document.querySelector('.modale ').classList.toggle('hidden');
            return;
    }

    modale_info_text('add');
    modale_info_text('delete');

    function modale_info_text(add_or_del) {

        const zone = document.querySelector(`#works_to_${add_or_del}`);
        if(sessionStorage[add_or_del]) {
            const works = sessionStorage[add_or_del].split(' ___ ');
            works.map(work => {
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
}

function modale_info_listener() {
    // const modale = document.querySelector('#modale_update');
    const modale = document.querySelector('.modale ');

    modale.addEventListener('click', (event) => {
        event.preventDefault();

        switch(event.target.id || event.target.classList[0]) {
            case 'modale_update':
            case 'modale_error':
            case 'modale__btn--cross':
            case 'fa-xmark':
                modale.remove();
                break;

            case 'modale_update_cancel':
                sessionStorage.removeItem('delete');
                sessionStorage.removeItem('add');
                delete window.add_works;
                modale.remove();
                break;

            case 'modale_update_confirm':
                (sessionStorage['add']) ? update_fetch_add() : null;
                (sessionStorage['delete']) ? update_fetch_delete() : null;
        }
    })
}


async function update_fetch_add() {
    const url = `http://localhost:5678/api/works`;

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
            console.log('fetch_add', fetched_work);
        }
        catch(error) {
            console.log(error);
        }
    })

    sessionStorage.removeItem('add');
    delete window.add_works;
}



function update_fetch_delete() {

    const works_to_delete = sessionStorage.getItem('delete').split(' ___ ');

    works_to_delete.map(async(work) => {

        work = work.split(' __ ');
        let url = `http://localhost:5678/api/works/${work[2]}`;
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
            console.log('fetch_delete', fetched_work.status);
        }
        catch(error) {
            console.log(error);
        }
    })

    sessionStorage.removeItem('delete');
}