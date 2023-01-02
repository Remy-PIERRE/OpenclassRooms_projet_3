export const modale = async function() {

    modale_init();
}




async function modale_init() {

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
            (document.querySelector(`#${modale_to_create}`)) ? document.querySelector(`#${modale_to_create}`).remove() : null;
            (!document.querySelector('#modale_error')) ? modale_error_display() : null }
    }

    function modale_error_display() {
        /* create error_modale then switch() to display it */
        const modale_error = document.createElement('aside');
        const modale_error_wrapper = document.createElement('div');
        const modale_error_text = document.createElement('p');
        const btn_cross = document.createElement('button');
        const icon_cross = document.createElement('i');

        /* create <btn_arrow> if already modale to go back to previous one */
        if(document.querySelector('.modale ')) {
            const btn_arrow = document.createElement('button');
            const icon_arrow = document.createElement('i');

            btn_arrow.className = 'modale__btn--arrow  modale__btn--absolute   flex-c-c';
            icon_arrow.className = 'fa-arrow-left  fa-solid';

            btn_arrow.appendChild(icon_arrow);
            modale_error_wrapper.appendChild(btn_arrow);
        }

        /* id / clases / style */
        btn_cross.className = 'modale__btn--cross  modale__btn--absolute  flex-c-c';
        icon_cross.className = 'fa-xmark  fa-solid';
        modale_error.className = 'modale  flex-c-c  hidden';
        modale_error.id = 'modale_error';
        modale_error_wrapper.className = 'modale__wrapper  flex-c-c';
        modale_error_wrapper.style.height = '200px';
        modale_error_wrapper.style.width = '300px';
        modale_error_text.className = 'msg--error';
        modale_error_text.innerText = 'Erreur lors du chargement de la modale !';

        /* childrens assign */
        btn_cross.appendChild(icon_cross);
        modale_error_wrapper.appendChild(btn_cross);
        modale_error_wrapper.appendChild(modale_error_text);
        modale_error.appendChild(modale_error_wrapper);
        document.body.appendChild(modale_error);
    }
}

function modale_gallery_display() {
/* create a clone of any <figure> in <gallery> then transform then put in <modale_gallery_wrapper> */
    const gallery_figures = [...document.querySelectorAll('.gallery__figure')];
    const gallery_wrapper = document.querySelector('.modale__gallery--wrapper');
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

        btn_trash.className = 'modale__btn--trash  flex-c-c';
        icon_trash.className = 'fa-trash-can  fa-solid';
    }
}

function modale_add_works_select() {
    const modale_select = document.querySelector('#category');
    const option_categories = [...new Set([...document.querySelectorAll('.gallery__figure')].map(figure => figure.getAttribute('data-category')))];
    const option_categories_id = [...new Set([...document.querySelectorAll('.gallery__figure')].map(figure => figure.getAttribute('data-category_id')))];
    for(let i = 0; i < option_categories.length; i++) {
        option_create(option_categories[i], option_categories_id[i]);
    }


    function option_create(category, category_id) {
        const option = document.createElement('option');
        option.value = `${category}_${category_id}`;
        option.innerText = category;
        option.className = 'modale__select--option';
        modale_select.appendChild(option);
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


    function modale_listener_handler(event) {
    /* works for all modales */

        const target = event.target;
        /* <input> type='file' dunnot wants preventDefault() */
        (['file_label', 'file_input'].includes(target.id)) ? null : event.preventDefault();

        switch(target.id || target.classList[0]) {
        /* beware <i> needs classes inverted : class='fa-solid  fa-xmark' => class='fa-xmark  fa-solid', switch searching for first class */

            /* close all modales */
            case 'modale_gallery':
            case 'modale_add_works':
            case 'modale_error':
            case 'modale__btn--cross':
            case 'fa-xmark':
            case 'modale':
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
                modale_remove_work(target);
                break;
            
            /* delete all works from modale_gallery */
            case 'modale__btn--del-all':
                modale_remove_all_works();
                break;

            /* get and display image loaded */
            case 'file_label':
            case 'file_input':
                modale_add_works_file_get(target);
                break;

            /* check if form is full then file go in global var => use in './update.js' */
            case 'modale_submit':
                const submit = modale_add_works_submit();
                (submit) ? modale.removeEventListener('click', modale_listener_handler) : null;

            default:
                break;
        }
    }
}



/* modale_listener() functions */


/* modale_gallery */

function modale_remove_all_works() {
/* call modale_remove_work() for all works */
    const modale_gallery = document.querySelector('.modale__gallery--wrapper');
    const figures = [...modale_gallery.querySelectorAll('figure')];

    figures.map(figure => modale_remove_work(figure))
}

function modale_remove_work(element) {
    /* to be sure to get <figure> to works */
    /* <i trash> need to be children of <figure> */
    while(element.tagName.toLowerCase() !== 'figure') {element = element.parentElement}
    const figure = element;

    /* remove() <figure> clone from <gallery> then <figure> itself */
    const work_name = figure.querySelector('img').alt;
    const work_category = figure.getAttribute('data-category');
    const work_id = figure.getAttribute('data-id');
    [...document.querySelector('.gallery').querySelectorAll('figure')].map(figure => {
        (figure.querySelector('img').alt === work_name) ? figure.remove() : null
    })
    figure.remove();

    /* don't loose your modifications */
    /* ' __ ' is séparator here to prevent errors, ', ' use in work_name */
    storage_modifications('delete', `${work_name} __ ${work_category} __ ${work_id}`);
}



/* modale_add_works */

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
    [...wrapper.children].map(child => child.classList.toggle('hidden'));
}

async function modale_add_works_submit() {
    const file = document.querySelector('#file_input').files[0];
    const title = document.querySelector('#title').value;
    const category = document.querySelector('#category').value;

    /* all fields need value */
    if(!(file && title && category)) {
        return modale_add_works_failed();
    }

    /* fetch will need file in body => formData will handle it */
    const formData = new FormData();
    formData.append('image', file, file.name);
    formData.append('title', title);
    formData.append('category', category.split('_')[1]);

    /* formData in global variable because use it in './update.js' and sessionStorage => JSON.stringify(formData) dunnot works */
    console.log('window ? ', (window.add_works) ? true : false);
    (window.add_works) ? window.add_works.push(formData) : window.add_works = [formData];
    console.log('window_add_works', window.add_works);

    /* keep info for modale_info at './update.js' */
    storage_modifications('add', `${title} __ ${category.split('_')[0]}`);

    /* go back to previous modale, reset modale_add_works, ready to get another submit, return TRUE => kill eventListener */
    modale_add_works_file_switch(true);
    modale_switch();
    return true;



    function modale_add_works_failed() {
    /* 2s >error_msg> display */
        const error_msg = document.createElement('p');
        error_msg.className = 'msg--error';
        error_msg.innerText = 'Tous les champs doivent être remplis !';
        const title = document.querySelector('#modale_add_works').querySelector('.modale__wrapper');

        title.appendChild(error_msg);

        setTimeout(() => {
            error_msg.remove()
        }, 2000)
    }
}



/* all modales */

function modale_close() {
    document.querySelectorAll('.modale').forEach(modale => { modale.remove() })
}

function storage_modifications(category, value) {
/* store delete / add works in sessionStorage => use in './update.js' */
    if(!sessionStorage[category]) {
        return sessionStorage.setItem(category, value);
    }
    sessionStorage[category] += (` ___ ${value}`);
}