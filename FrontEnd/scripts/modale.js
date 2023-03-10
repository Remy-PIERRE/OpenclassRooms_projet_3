const module_modale_error = './modale_error.js';
const module_gallery = './gallery.js';



export async function modale_init() {

    /* (if not exists create <modale_gallery> || create <modale_add_works> ) || switch between modales */
    (!document.querySelector('#modale_add_works')) ? 
    (!document.querySelector('#modale_gallery')) ? 
    await modale_create('modale_gallery') : await modale_create('modale_add_works') :
    null;
    
    /* display */
    modale_switch();

    

    /* modale_init() functions */

    async function modale_create(modale_to_create) {
        const url = window.location.href.replace('index.html', `html/${modale_to_create}.html`);

        /* load modale_to_create from modale_to_create.html then append to body */
        try {
            let modale_fetched = await fetch(url);
            modale_fetched = await modale_fetched.text();

            const parser = new DOMParser();
            const modale_html = parser.parseFromString(modale_fetched, 'text/html');

            const modale_to_insert = modale_html.querySelector(`#${modale_to_create}`);
            
            document.body.appendChild(modale_to_insert);

            /* unique treatment for unique modale : 'you're so special !' */
            (modale_to_insert.id === 'modale_gallery') ? modale_gallery_display() : null;
            (modale_to_insert.id === 'modale_add_works') ? modale_add_works_select() : null;
        }
        catch(error) {
            /* delete modale if already created and remplace it with <modale_error> */
            (document.querySelector(`#${modale_to_create}`)) ? document.querySelector(`#${modale_to_create}`).remove() : null;
            (!document.querySelector('#modale_error')) ? await import(module_modale_error).then(__ => __.modale_error_init()) : null;
        }
    }
}

function modale_gallery_display() {
/* create a clone of any <figure> in <gallery> then transform then put in <modale_gallery_wrapper> */
    const gallery_figures = [...document.querySelectorAll('.gallery__figure')];
    const gallery_wrapper = document.querySelector('.modale__gallery--wrapper');

    /* gallery empty => stop, modale_gallery not empty => reset then fill modale_gallery */
    if([...gallery_wrapper.querySelectorAll('figure')].length > 0) { modale_gallery_reset() }
    gallery_figures.map(figure => { clone_create(figure) })



    /* modale_gallery_display() functions */

    function clone_create(figure) {
    /* <figcaption> changes, <trash_icon> add */
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

    /* delete all <figures> in modale_gallery */
    function modale_gallery_reset() {
        while(gallery_wrapper.firstChild) { gallery_wrapper.firstChild.remove() }
    }
}

async function modale_add_works_select() {
    /* get all categories then create <options> with thoses */
    const categories = await fetch_categories();

    const modale_select = document.querySelector('#category');
    if(categories) {
        categories.map(category => {
            option_create(category)
        })
    }
    

    function option_create(category) {
        /* create <option> */
        const option = document.createElement('option');
        option.value = category.id;
        option.innerText = category.name;
        option.className = 'modale__select--option';
        modale_select.appendChild(option);
    }

    async function fetch_categories() {
        /* fetch all categories */
        const url = 'http://localhost:5678/api/categories';
        try {
            const fetched_data = await fetch(url);
            if(!fetched_data.ok) { return console.log('fetch categories not ok', fetched_data.status);}
            return await fetched_data.json();
        }
        catch(error) {
            console.log('fetch categories error');
            return
        }
    }
}

function modale_switch() {
    /* display new or (previous if more than 1) modale, works only with max = 2 modales, all modales 'hidden' by default */
    [...document.querySelectorAll('.modale ')].map(modale => modale.classList.toggle('hidden'));

    /* ready to listen */
    modale_listener();
}



function modale_listener() {
    /* query active modale */
    const modale = [...document.querySelectorAll('.modale ')].filter(modale => !modale.classList.value.includes('hidden'))[0];

    /* need callback() to prevent eventListener multiplication */
    modale.addEventListener('click', modale_listener_handler);

    /* cross arrows in modale gallery, display only => to be implemented */
    if(modale.id === 'modale_gallery') {
        [...modale.querySelectorAll('.modale__gallery--figure')].map(figure => {

            const cross_icon_wrapper = document.createElement('div');
            cross_icon_wrapper.className = 'modale-gallery__figure--btn-cross  flex-c-c';
            const cross_icon = document.createElement('i');
            cross_icon.className = 'fa-solid fa-up-down-left-right';
            cross_icon.style.color = '#fff';
            cross_icon.style.fontSize = '12px';
            cross_icon_wrapper.appendChild(cross_icon);

            figure.querySelector('figcaption').addEventListener('click', () => {
                (modale.querySelector('.modale-gallery__figure--btn-cross')) ? 
                modale.querySelector('.modale-gallery__figure--btn-cross').remove() : null;
                figure.appendChild(cross_icon_wrapper);
                cross_icon_wrapper.style.display = 'flex';
            })
        })
    }


    function modale_listener_handler(event) {
    /* works for all modales (modale_gallery, modale_add_works, modale_error */

        const target = event.target;
        /* <input> type='file' dunnot wants preventDefault() */
        (['file_label', 'file_input'].includes(target.id)) ? null : event.preventDefault();

        switch(target.id || target.classList[0]) {
        /* beware <i> needs classes inverted : class='fa-solid  fa-xmark' => class='fa-xmark  fa-solid', switch searching for first class, here 'fa-xmark' */

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
                (modale.id === 'modale_add_works' && modale.querySelector('img')) ? modale_add_works_file_switch(true) : null;

                modale_switch();
                modale.removeEventListener('click', modale_listener_handler);
                break;

            /* go to modale_add_works */
            case 'modale_btn_add':
                modale_init();
                modale.removeEventListener('click', modale_listener_handler);
                break;

            /* delete work from modale_gallery */
            case 'modale__btn--trash':
            case 'fa-trash-can':
                modale_remove_work(target)
                    .then(__ => galleries_update())
                break;
            
            /* delete all works from modale_gallery */
            case 'modale__btn--del-all':
                modale_remove_all_works()
                    .then(__ => galleries_update())
                break;

            /* get and display image loaded */
            case 'file_label':
            case 'file_input':
                modale_add_works_file_get(target);
                break;

            /* check if form is full then fetch (return true / false) */
            case 'modale_submit':
                modale_add_works_submit()
                    .then(is_added => {
                        /* if true update gallery, modale_gallery and return to modale_gallery */
                        if(is_added) {
                            galleries_update();
                            modale_add_works_file_switch(true);
                            modale_switch();
                            modale.removeEventListener('click', modale_listener_handler);
                        } 
                    })

            default:
                break;
        }
    }
}



/* modale_listener() functions */


/* MODALE_GALLERY */

async function modale_remove_all_works() {
/* call modale_remove_work() for all works */
    const modale_gallery = document.querySelector('.modale__gallery--wrapper');
    const figures = [...modale_gallery.querySelectorAll('figure')];

    figures.map(async(figure) => await modale_remove_work(figure))
}

async function modale_remove_work(element) {
    /* element is <i trash> ('click' on <i trash>) or <figure> (delete all works) */
    /* need element === <figure> to works, <i trash> is children of <figure> */
    while(element.tagName.toLowerCase() !== 'figure') {element = element.parentElement}
    const figure = element;

    /* fetch delete, figure.getAttribute('data-id') === work id on api */
    const work_deleted = await fetch_delete_work(figure.getAttribute('data-id'));

    if(!work_deleted) {
        return fetch_failed();
    }
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
        console.log(`R??ussite du fetch delete id: ${work_id}, status : `, fetched_data.status);
        return true;
    }
    catch(error) {
        console.log(`Echec du fetch delete id: ${work_id}, error : `, error);
        return false;
    }
}





/* MODALE_ADD_WORKS */

function modale_add_works_file_get(target) {

    /* callback() => no listener multiplication */
    target.addEventListener('change', modale_file_listener_handler)
    
    function modale_file_listener_handler() {
        /* opening file_selection_modale throw useless error, just handling it */
        if(!target.files) { return }

        const wrapper = document.querySelector('.modale__add-works--photo-wrapper');
        const image_on_screen = document.createElement('img');
        const image_to_load = target.files[0];

        image_on_screen.className = 'modale__img--loaded  hidden';
        image_on_screen.src = URL.createObjectURL(image_to_load);

        wrapper.appendChild(image_on_screen);

        /* display */
        modale_add_works_file_switch();
        target.removeEventListener('change', modale_file_listener_handler);
    }
}

function modale_add_works_file_switch(reset = false) {
/* reset = TRUE when going to previous modale : dunnot need to keed <img> and file.value */
    const wrapper = document.querySelector('.modale__add-works--photo-wrapper');
    if(reset) {
        [...wrapper.children].find(child => child.tagName.toLowerCase() === 'img').remove();
        document.querySelector('#file_input').value = '';
    }
    /* switch between <img> or <imput type='file'> */
    [...wrapper.children].map(child => child.classList.toggle('hidden'));
}



async function modale_add_works_submit() {
    const file = document.querySelector('#file_input').files[0];
    const title = document.querySelector('#title').value;
    const category = document.querySelector('#category').value;

    /* all fields need value */
    if(!(file && title && category)) {
        return await modale_add_works_failed();
    }

    /* fetch will need file in body => formData will handle it */
    const formData = new FormData();
    formData.append('image', file, file.name);
    formData.append('title', title);
    formData.append('category', category);

    return await modale_add_works_add(formData);
}

async function modale_add_works_failed() {
    /* 2s <error_msg> display */
    const error_msg = document.createElement('p');
    error_msg.className = 'msg--error';
    error_msg.innerText = 'Tous les champs doivent ??tre remplis !';
    const title = document.querySelector('#modale_add_works').querySelector('.modale__wrapper');

    title.appendChild(error_msg);

    setTimeout(() => {
        error_msg.remove()
        return false;
    }, 2000)
}

async function modale_add_works_add(formData) {
     const work_added = await fetch_add_work(formData);

     if(!work_added) {
         return fetch_failed();
     }
     return work_added;
}

async function fetch_add_work(formData) {
    const url = `http://localhost:5678/api/works`;
    const fetch_options = {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${sessionStorage['jwt']}`,
        },
        body: formData
    }
    
        try {
            const fetched_data = await fetch(url, fetch_options);
            if(!fetched_data.ok) {
                console.log(`Echec du fetch add: ${formData.get('title')}, status : `, fetched_data.status);
                return false;
            }
            console.log(`R??ussite du fetch add: ${formData.get('title')}, status : `, fetched_data.status);
                return true;
        }
        catch(error) {
            console.log(`Echec du fetch add: ${formData.get('title')}, error : `, error);
            return false;
        }
}


/* ALL MODALES */

function modale_close() {
    /* clear all modales */
    document.querySelectorAll('.modale').forEach(modale => { modale.remove() })
}

async function galleries_update() {
    /* update gallery then gallery_modale after succefull fetch (add or delete) */
    import(module_gallery)
        .then(__ => __.gallery_display())
        .then(__ => modale_gallery_display())
}

function fetch_failed() {
    /* display error_msg after a failed fetch (add or delete) */
    const modale = [...document.querySelectorAll('.modale ')].filter(modale => !modale.classList.value.includes('hidden'))[0];
    const error_msg = document.createElement('p');
    error_msg.className = 'msg--error';
    modale.querySelector('.modale__wrapper').appendChild(error_msg);

    if(modale.id === 'modale_add_works') {
        error_msg.innerText = "Echec lors de l'ajout du projet !";
        Object.assign(error_msg.style, {'top': '300px', 'left': '0', 'width': '100%'});
    }
    if(modale.id === 'modale_gallery') {
        error_msg.innerText = "Echec lors de la suppression du projet !";
        Object.assign(error_msg.style, {'top': '90px', 'left': '0', 'width': '100%'});
    }
    
    setTimeout(() => {
        error_msg.remove()
    }, 2000)
}
