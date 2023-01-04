const module_filters = './filters.js';
const module_edit_mode = './edit_mode.js';



export const gallery_init = await (async function () {
/* return TRUE / FALSE == filters or edition_mode dunnot need to run without api not responding */

    /* dell showcase */
    const gallery = document.querySelector('.gallery');
    while(gallery.firstElementChild) gallery.firstElementChild.remove();

    /* fetch and check failed */
    const fetch_data = await fetch_works();
    if(fetch_data.name || fetch_data.status) {
        fetch_failed(fetch_data);
        return false;
    }

    /* works display */ 
    fetch_data.map(work => gallery_display(work));
    return true;



    /* gallery_init() FUNCTIONS */

    async function fetch_works() {
    /* return res.json() || res.name == TypeError || res.status != 200 */
        let url = 'http://localhost:5678/api/works';

        try{
            let response = await fetch(url);
            if(response.ok) {
                response = await response.json();
            }
            return response;
        }
        catch(error) {
            return error;
        }
    }

    function fetch_failed(res) {
    /* <p>error msg</p> is display */
        const error_msg = document.createElement('p');
        error_msg.innerText = 'Problème lors du chargement des travaux !';
        error_msg.className = 'msg--error';

        gallery.style.display = 'flex';
        gallery.style.justifyContent = 'center';
        gallery.appendChild(error_msg);

        console.log(res);
    }

    function gallery_display(work) {
    /* each work (<figure> => <img> && <figcaption>) is display in <gallery> */
        const gallery = document.querySelector('.gallery');

        const figure = document.createElement('figure');
        figure.className = 'gallery__figure';
        figure.setAttribute('data-category', (work.category.name).toLowerCase())
        figure.setAttribute('data-category_id', work.categoryId);
        figure.setAttribute('data-id', work.id);
        
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.crossOrigin = 'anonymous';
        img.alt = work.title;
        
        const figcaption = document.createElement('figcaption');
        figcaption.innerText = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }
})()

/* both 2 next conditions require gallery_init == TRUE */
/* filters display require not loged in */
if(gallery_init && !sessionStorage['jwt']) {
    import(module_filters)
}

/* edition_mode require loged in */
if(gallery_init && sessionStorage['jwt']) {
    import(module_edit_mode)
}



