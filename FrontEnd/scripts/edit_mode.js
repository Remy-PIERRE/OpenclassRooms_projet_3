const module_modale = './modale.js';
const module_update = './update.js';

export const edit_mode_init = (function() {
    banner_init();
    btns_modifier_init();

    /* delete and add works reset on window.unload */
    window.addEventListener('beforeunload', () => {
        (sessionStorage['delete']) ? sessionStorage.removeItem('delete') : null;
        (sessionStorage['add']) ? sessionStorage.removeItem('add') : null;
        (window.add_works) ? delete window.add_works : null;
    })
})()



/* create banner, got <btn_publier> == update (apply modales changes with fetch) */
function banner_init() {

    /* create all elements in <banner> */
    const banner = document.createElement('div');
    const text_wrapper = document.createElement('div');
    const icon = document.createElement('i');
    const text = document.createElement('p');
    const btn_publier = document.createElement('button');

    /* children assignment */
    text_wrapper.appendChild(icon);
    text_wrapper.appendChild(text);
    banner.appendChild(text_wrapper);
    banner.appendChild(btn_publier);
    document.body.appendChild(banner);

    /* class / id / attributes for each element */
    banner.className = 'edit__banner  flex-c-c';
    document.body.style.marginTop = '100px';

    text.innerText = 'Mode edition';
    text.style.color = '#fff';

    icon.className = 'fa-regular fa-pen-to-square';
    icon.style.color = '#fff';

    text_wrapper.className = 'flex-c-c';
    text_wrapper.style.gap = '10px';

    btn_publier.className = 'btn';
    btn_publier.id = 'banner_publier';
    btn_publier.innerText = 'Publier les changements';
    btn_publier.style.padding = '0 20px';

    /* start listening client actions */
    banner_listener();
}

async function banner_listener() {
    document.querySelector('#banner_publier').addEventListener('click', () => { import(module_update).then(__ => __.update_init()) })
}



function btns_modifier_init() {
/* for new <btn_modifier>, add corresponding data in the 3 next parts */

    /* 1 : put new target (= sibbling of <bnt_modifier>) to get new <bnt_modifier> */
    const targets = [document.querySelector('#introduction figure'), document.querySelector('#introduction h2'), document.querySelector('#portfolio h2')];
    const btns_modifier = targets.map(target => btn_modifier_create(target));

    /* 2 : put new id to get <btn_modifier> id (same order than in targets) */
    const id_liste = ['intro_figure', 'intro_title', 'portfolio_title'];
    for(let i = 0; i < btns_modifier.length; i++) {
        btns_modifier[i].id = id_liste[i];
    }

    /* 3 : position of <btns_modifier> inside their <parent> */
    Object.assign(document.querySelector('#intro_figure').style, {'bottom': '-30px', 'left': '60px'});
    Object.assign(document.querySelector('#intro_title').style, {'top': '-30px', 'left': '0'});
    Object.assign(document.querySelector('#portfolio_title').style, {'top': '10px', 'left': '60%'});



    /* btns_modifier_init functions */
    function btn_modifier_create(target) {

        /* create all elements in <btn_modifier> */
        const wrapper = document.createElement('div');
        const icon = document.createElement('i');
        const text = document.createElement('p');

        /* class / id / attributes for each element */
        const parent = target.parentElement;
        parent.style.position = 'relative';

        wrapper.className = 'edit__bnt-modifier--wrapper  flex-c-c';
        wrapper.style.gap = '10px';
        wrapper.style.position = 'absolute';
        wrapper.style.cursor = 'pointer';

        icon.className = 'fa-regular fa-pen-to-square';

        text.innerText = 'modifier';
        text.style.margin ='0';

        /* children assignment */
        wrapper.appendChild(icon);
        wrapper.appendChild(text);
        parent.appendChild(wrapper);

        return wrapper;
    }

    /* start listening client actions */
    bnts_modifier_listener();
}

async function bnts_modifier_listener() {

    [...document.querySelectorAll('.edit__bnt-modifier--wrapper')].map(btn => {
        btn.addEventListener('click', () => {

            if(btn.id === 'intro_figure') { null } /* to be implemented */
            if(btn.id === 'intro_title') { null } /* to be implemented */
            if(btn.id === 'portfolio_title') {
                /* import once but use it each 'click' */
                import(module_modale)
                    .then(__ => __.modale())
            }
        })
    })
}