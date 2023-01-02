export const filters_init = (() => {

    /* get from gallery's works all 'data-category' */
    const gallery = document.querySelector('.gallery');
    /* figures use in filter_listener() */
    let figures = [...gallery.children];

    const categories = [...new Set(figures.map(figure => figure.getAttribute('data-category')))];
    categories.unshift('tous');

    /* create <filters_wrapper> */
    const portfolio = document.querySelector('#portfolio');
    const filters_wrapper = document.createElement('section');
    filters_wrapper.className = 'filters__wrapper';
    portfolio.insertBefore(filters_wrapper, gallery);

    /* create filters_btns */
    const filters_btns = categories.map(category => filter_init(category))

    /* listen 'click' */
    filters_btns.map(filter => filter_listener(filter))



    /* filters_init() FUNCTIONS */

    function filter_init(category) {
        const filter = document.createElement('button');
        filter.innerText = `${category[0].toUpperCase()}${category.slice(1)}`;
        filter.setAttribute('data-category', category);
        filter.className = 'btn  filters__btn  green-theme';
        filters_wrapper.appendChild(filter);

        /* <filter data-category='tous'> is activated by default */
        (category === 'tous') ? filter.classList.add('green-theme--activated') : null;
        return filter;
    }

    function filter_listener(filter) {
        filter.addEventListener('click', () => {
            /* click on already activated filter reset gallery and filters_btns to 'tous' */
            const is_activated = (filter.classList.value.includes('green-theme--activated')) ? true : false;

            /* reset filters_btns then target / 'tous' => green-theme-activated */
            filters_btns.map(filter => {
                (filter.classList.value.includes('green-theme--activated')) ? filter.classList.toggle('green-theme--activated') : null;
            });
            (is_activated) ? filters_btns.find(filter => filter.getAttribute('data-category') == 'tous').classList.toggle('green-theme--activated') : filter.classList.toggle('green-theme--activated');

            /* reset figures then (not same category) ? display: none */
            figures.map(figure => figure.style.display = 'block')
            if(filter.getAttribute('data-category') !== 'tous' && !is_activated) {
                figures.map(figure => {
                    (figure.getAttribute('data-category') !== filter.getAttribute('data-category')) ? figure.style.display = 'none' : null;
                })
            }
        })
    }
})()