import { modales_listener } from "./modales_listener.js";
const module_modale_error = './modale_error.js';

export async function modale() {
    /* get modale from .html */
    await modale_fetch();
    /* all modales hidden by default => last one go to display = fixed, previous go to hidden, works only with nbr_max_modales = 2 */
    modale_switch();
    /* optional treatment for modales */
    modale_options();
    /* modale listener */
    modales_listener();
}

async function modale_fetch() {
    /* check which modale is already create */
    const modale_to_create = (!document.querySelector('#modale_gallery')) ? 'modale_gallery' : 'modale_add_works';

    /* url need modification if .html are moved */
    const url = window.location.href.replace('index.html', `html/${modale_to_create}.html`);

    try {
        /* fetch and parse to text */
        let modale_fetched = await fetch(url);
        modale_fetched = await modale_fetched.text();
        /* parse to html */
        const parser = new DOMParser();
        modale_fetched = parser.parseFromString(modale_fetched, 'text/html');
        /* get modale and adopted by body */
        const modale_to_insert = modale_fetched.querySelector(`#${modale_to_create}`);
        document.body.appendChild(modale_to_insert);
    }
    catch(error) {
        /* if already created, delete modale */
        if(document.querySelector(`#${modale_to_create}`)) { document.querySelector(`#${modale_to_create}`).remove() }
        /* create and display modale_error */
        if(!document.querySelector('#modale_error')) {
            await import(module_modale_error)
                .then(__ => __.modale_error_init())
        }
    }
}

export function modale_switch() {
    /* if hidden => display = fixed, else display = hidden */
    [...document.querySelectorAll('.modale ')].map(modale => {
        modale.classList.toggle('hidden')
    })

}

function modale_options() {
    /* get modales */
    const modales = [...document.querySelectorAll('.modale ')];
    /* check which modale needs treatment */
    if(modales.map(modale => modale.id).includes('modale_error')) { return }
    if(modales.map(modale => modale.id).includes('modale_add_works')) { return modale_add_works_select() }
    modale_gallery_display();
}

export function modale_gallery_display() {
    /* get gallery <figures> and modale_gallery_wrapper */
    const gallery_figures = [...document.querySelectorAll('.gallery__figure')];
    const gallery_wrapper = document.querySelector('.modale__gallery--wrapper');

    /* check if gallery is empty => dunnot need to create any work in modale */
    if(gallery_figures.length === 0) { return } /* under construction */

    /* reset modale_gallery => dunnot need multiplication after multiple calls */
    if([...gallery_wrapper.querySelectorAll('figure')].length > 0) { modale_gallery_reset() }

    /* create modale_gallery <figures> */
    gallery_figures.map(figure => gallery_figure_clone(figure));


    function gallery_figure_clone(figure) {
    /* clone gellery <figure>, <figcaption> changes, <trash_icon> add */
        const clone = figure.cloneNode(true);
        const figcaption = clone.querySelector('figcaption');
        const btn_trash = document.createElement('div');
        const icon_trash = document.createElement('i');
        
        /* children assign */
        btn_trash.appendChild(icon_trash);
        clone.appendChild(btn_trash);
        gallery_wrapper.appendChild(clone);

        /* id / clases / style */
        clone.className = 'modale__gallery--figure';
        figcaption.innerText = 'editer';
        figcaption.style.fontSize = '12px';
        figcaption.style.lineHeight = '14px';
        figcaption.style.cursor = 'pointer';
        btn_trash.className = 'modale__btn--trash  flex-c-c';
        icon_trash.className = 'fa-trash-can  fa-solid';
    }

    function modale_gallery_reset() {
        while(gallery_wrapper.firstChild) { gallery_wrapper.firstChild.remove() }
    }
}

async function modale_add_works_select() {
    const modale_select = document.querySelector('#category');
    /* get categories */
    const categories = await fetch_categories();
    /* msg if fetch categories failed */
    if(!categories) { return console.log('Erreur lors du chargement des categories !') } /* need test */
    /* create options <select> */
    categories.map(category => {
        option_create(category)
    })

    function option_create(category) {
        const option = document.createElement('option');
        option.value = category.id;
        option.innerText = category.name;
        option.className = 'modale__select--option';
        modale_select.appendChild(option);
    }

    async function fetch_categories() {
        const url = 'http://localhost:5678/api/categories';
        try {
            let fetched_categories = await fetch(url);
            if(!fetched_categories.ok) { return }
            return await fetched_categories.json()
        }
        catch(error) {
            return;
        }
    }
}