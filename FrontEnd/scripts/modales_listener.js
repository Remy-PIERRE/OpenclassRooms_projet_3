import { modale_switch, modale, modale_gallery_display } from "./modales_refact.js";
const module_gallery = './gallery.js';

export const modales_listener = async function() {
    /* query active modale */
    const modale = [...document.querySelectorAll('.modale ')].filter(modale => !modale.classList.value.includes('hidden'))[0];

    /* need callback() to prevent eventListener multiplication */
    /* works for all modales */
    modale.addEventListener('click', modales_listener_handler);
}

function modales_listener_handler(event) {
    const target = event.target;

    /* <input> type='file' dunnot wants preventDefault() */
    (['file_label', 'file_input'].includes(target.id)) ? null : event.preventDefault();

    /* beware <i> needs classes inverted : class='fa-solid  fa-xmark' => class='fa-xmark  fa-solid', switch searching for id or first class */ 
    switch(target.id || target.classList[0]) {
        
        /* close all modales */
        case 'modale_gallery':
        case 'modale_add_works':
        case 'modale_error':
        case 'modale__btn--cross':
        case 'fa-xmark':
            modale_close();
            break;

        /* go back to previous modale */
        case 'modale__btn--arrow':
        case 'fa-arrow-left':
            /* delete <img> loaded when in modale_add_works && going to previous modale && <img> loaded */
            (this.id === 'modale_add_works' && this.querySelector('img')) ? modale_add_works_file_switch(true) : null;

            /* open listener for next modale, close actual */
            modale_switch();
            modales_listener();
            this.removeEventListener('click', modales_listener_handler);
            break;

        /* go to modale_add_works */
        case 'modale_btn_add':
            if(document.querySelector('#modale_add_works')) {
                /* open listener for next modale, close actual */
                modale_switch();
                modales_listener();
                this.removeEventListener('click', modales_listener_handler);
                break;
            }
            /* if not exist => create it */
            modale();
            this.removeEventListener('click', modales_listener_handler);
            break;

        /* delete work from modale_gallery */
        case 'modale__btn--trash':
        case 'fa-trash-can':
            /* fetch delete work then display result */
            modale_remove_work(target)
                .then(result => (result) ? galleries_update() : null)
            break;

        /* delete all works from modale_gallery */
        case 'modale__btn--del-all':
            modale_remove_all_works()
                .then(result => (result) ? galleries_update() : null)
            break;

        /* get and display image loaded */
        case 'file_label':
        case 'file_input':
            modale_add_works_file_get(target);
            break;

    }
}

/* ALL MODALES */

function modale_close() {
    document.querySelectorAll('.modale').forEach(modale => { modale.remove() })
}

async function galleries_update() {
    import(module_gallery)
        .then(async __ => {
            await __.gallery_display();
            console.log('modale_gallery display');
            modale_gallery_display();
        })
}


/* MODALE_GALLERY */

/* call modale_remove_work() for all works */
async function modale_remove_all_works() {
        const figures = [...document.querySelector('.modale__gallery--wrapper').querySelectorAll('figure')]

        const works_deleted = await Promise.all(figures.map(async(figure) => await modale_remove_work(figure)))
        /* true => gallery_update() */
        if(works_deleted.includes(true)) { return true }
}

async function modale_remove_work(element) {
    /* need element === <figure> to works, element can be <i trash> or <figure> */
    while(element.tagName.toLowerCase() !== 'figure') {element = element.parentElement}
    const figure = element;

    /* fetch delete, figure.getAttribute('data-id') === work id on api */
    const work_deleted = await fetch_delete_work(figure.getAttribute('data-id'));

    /* true => gallery_update() */
    return (work_deleted) ? true : false;
}

async function fetch_delete_work(work_id) {
    const url = `http://localhost:5678/api/works/${work_id}`;
    const fetch_options = {
        method: 'DELETE',
        headers: {
            'Authorization': `bearer ${sessionStorage['jwt']}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }

    try {
        const fetched_data = await fetch(url, fetch_options);
        if(!fetched_data.ok) { 
            console.log(`Echec du fetch delete id: ${work_id}, status : `, fetched_data.status);
            return false;
        }
        console.log(`Réussite du fetch delete id: ${work_id}, status : `, fetched_data.status);
        return true;
    }
    catch(error) {
        console.log(`Echec du fetch delete id: ${work_id}, error : `, error);
        return false;
    }
}

/* MODALE_ADD_WORK */

function modale_add_works_file_get(target) {

    /* callback() => no listener multiplication */
    target.addEventListener('change', modale_file_listener_handler)
    
    function modale_file_listener_handler() {
        /* opening file_selection_modale throw useless error */
        if(!target.files) { return }

        const wrapper = document.querySelector('.modale__add-works--photo-wrapper');
        const image_on_screen = document.createElement('img');
        const image_to_load = target.files[0];

        image_on_screen.className = 'modale__img--loaded  hidden';
        image_on_screen.src = URL.createObjectURL(image_to_load);

        wrapper.appendChild(image_on_screen);

        /* display */
        modale_add_works_file_switch();
        this.removeEventListener('change', modale_file_listener_handler);
    }
}

function modale_add_works_file_switch(reset = false) {
/* reset = TRUE when going to previous modale : dunnot need to keep <img> and file.value */
    const wrapper = document.querySelector('.modale__add-works--photo-wrapper');
    if(reset) {
        /* remove <image> */
        [...wrapper.children].find(child => child.tagName.toLowerCase() === 'img').remove();
        document.querySelector('#file_input').value = '';
    }
    [...wrapper.children].map(child => child.classList.toggle('hidden'));
}