export const modale_error_init = function() {
    console.log('entrée dans modale_error');
    (!document.querySelector('#modale_error')) ? modale_error_create() : null;
}



function modale_error_create() {
    console.log('create modale_error');
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