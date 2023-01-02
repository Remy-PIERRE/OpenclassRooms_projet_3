export const modale = async function() {

    await modale_gallery_init();
    modale_gallery_display();
    modale_listener();

}



async function modale_gallery_init() {

    const url_modale = window.location.href.replace('index.html', 'html/modale_gallery_delete.html');

    let modale_fetched = await fetch(url_modale);
    modale_fetched = await modale_fetched.text();
    const parser = new DOMParser();
    const modale_html = parser.parseFromString(modale_fetched, 'text/html');

    const modale = modale_html.querySelector('#modale_gallery');
    document.body.appendChild(modale);
}

async function modale_add_works_init() {

    if(!document.querySelector('#modale_add_works')) {
        const url_modale = window.location.href.replace('index.html', 'html/modale_add_works.html');

        let modale_fetched = await fetch(url_modale);
        modale_fetched = await modale_fetched.text();
        const parser = new DOMParser();
        const modale_html = parser.parseFromString(modale_fetched, 'text/html');

        const modale = modale_html.querySelector('#modale_add_works');
        document.body.appendChild(modale);

        const modale_select = modale.querySelector('#category');
        const option_categories = [...new Set([...document.querySelectorAll('.gallery__figure')].map(figure => figure.getAttribute('data-category')))];
        option_categories.map(category => option_create(category));

        function option_create(category) {
            const option = document.createElement('option');
            option.value = category;
            option.innerText = category;
            option.className = 'modale__select--option';
            modale_select.appendChild(option);
        }
    }

    modale_switch();
}



function modale_switch() {
    [...document.querySelectorAll('.modale ')].map(modale => modale.classList.toggle('hidden'));

    modale_listener();
}


function modale_gallery_display() {

    let gallery_figures = [...document.getElementsByClassName('gallery__figure')];
    const gallery_wrapper = document.getElementById('modale_gallery_wrapper');

    gallery_figures.map(figure => {

        const clone = figure.cloneNode(true);
        const figcaption = clone.querySelector('figcaption');
        const btn_trash = document.createElement('div');
        const icon_trash = document.createElement('i');
        
        btn_trash.appendChild(icon_trash);
        clone.appendChild(btn_trash);
        gallery_wrapper.appendChild(clone);

        clone.className = 'modale__gallery--figure';

        figcaption.innerText = 'editer';
        figcaption.style.fontSize = '12px';
        figcaption.style.lineHeight = '14px';

        btn_trash.className = 'modale__btn--trash  flex-c-c';
        icon_trash.className = 'fa-solid fa-trash-can';
    })
}



function modale_listener() {

    const modale = document.querySelector('#modale_add_works') ||
    document.querySelector('#modale_gallery');
    modale.addEventListener('click', async(event) => {
        const element = event.target;

        if(!['file_label', 'file_input'].includes(element.id)) {
            event.preventDefault();
        }
        
        if(['modale_gallery', 'modale_add_works', 'modale_cross_wrapper', 'modale_cross'].includes(element.id)) {
            modales_close();
        }
    
        if(element.className.includes('fa-trash-can')) {
            modale_gallery_delete_one(element);
        }

        if(element.className.includes('modale__btn--del-all')) {
            modale_gallery_delete_all();
        }

        if(element.id === 'modale_btn_add') {
            await modale_add_works_init();
        }

        if(['modale_arrow', 'modale_arrow_wrapper'].includes(element.id)) {
            modale_switch();
        }
    })

    if(document.querySelector('#modale_form')) {
        
    }

    if(document.querySelector('#file_input')) {

        var image;

        document.querySelector('#file_input').addEventListener('change', (event) => {
            image = event.target.files[0];
            const image_on_screen = document.createElement('img');
            image_on_screen.className = 'modale__img--loaded';
            image_on_screen.src = URL.createObjectURL(image);
            const wrapper = document.querySelector('.modale__add-works--photo-wrapper');
            [...wrapper.children].map(child => child.classList.toggle('hidden'));
            const img_wrapper = document.createElement('div');
            img_wrapper.style.height = '100%'

            img_wrapper.appendChild(image_on_screen);
            wrapper.appendChild(img_wrapper);
        })

        document.querySelector('#modale_submit').addEventListener('click', (event) => {

            const title = document.querySelector('#title').value;
            const category = document.querySelector('#category').value;

            if(image && title && category) {
                sessionStorage['add_work'] = {
                    file: image,
                    title,
                    category
                }
            }

            if(sessionStorage['add_work']) { console.log(sessionStorage) }

            modales_close();

            
        })

    }
}




function modales_close() {
    document.querySelectorAll('.modale').forEach(modale => {
        modale.remove()
    });
}

function modale_gallery_delete_one(element) {
    const gallery = document.querySelector('.gallery');
    const img = element.parentElement.parentElement.querySelector('img');
    const img_name = img.alt;

    [...gallery.querySelectorAll('img')].map(gallery_img => {
        (gallery_img.alt === img_name) ? gallery_img.parentElement.remove() : null;
    })
    img.parentElement.remove();

    storage_modifications('delete', img_name);
}

function modale_gallery_delete_all() {

    const modale_gallery = document.querySelector('.modale__gallery--wrapper');
    const figures = [...modale_gallery.querySelectorAll('img')];

    figures.map(figure => modale_gallery_delete_one(figure))
}






function storage_modifications(category, value) {

    if(!sessionStorage[category]) {
        return sessionStorage.setItem(category, value);
    }
    sessionStorage[category] += (`, ${value}`);
}