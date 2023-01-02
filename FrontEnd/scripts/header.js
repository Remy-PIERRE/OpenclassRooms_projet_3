export const header_init = (function () {
    /* transform html <header> to get <a> inside <nav> and allow navigate between 'index' and 'login' / '#contact' */
    let listes = [...(document.getElementsByTagName('li'))].filter(liste => liste.innerText !== '' && liste.innerText !== 'Mentions Légales');

    /* <li>text</li> => <li><a href="">text</a><li> */
    const links = listes.map(liste => {
        const link = document.createElement('a');
        link.className = 'links';
        link.innerText = liste.innerText;
        liste.innerText = '';
        liste.appendChild(link);
        return link;
    })

    /* corrections */
    const url = window.location.href.replace('#contact', '');
    listes[0].parentElement.style.gap = '50px';

    /* href and style assignment */
    links.map(link => {
        (link.innerText === 'contact') ? link.setAttribute('href', '#contact') : null;
        
        /* href='#' when the link send you to your actual page */
        if(url.includes('index.html')) {
            switch(link.innerText) {
                case 'projets':
                    link.setAttribute('href', '#');
                    link.style.fontWeight = '700';
                    break;

                case 'login':
                    if(!sessionStorage['jwt']) {
                        link.setAttribute('href', `${url.replace('index.html', 'html/login.html')}`);
                        link.style.fontWeight = '300';
                        break;
                    }
                    /* if loged in 'login' become 'logout' then 'click' => logout() and refresh */
                    link.innerText = 'lougout';
                    link.addEventListener('click', () => {
                        sessionStorage.clear();
                        window.location.href = url;
                    })
                    break;
                default:
                    break;
            }
        }

        if(url.includes('login.html')) {
            switch(link.innerText) {
                case 'projets':
                    link.setAttribute('href', `${url.replace('html/login', 'index')}`);
                    link.style.fontWeight = '300';
                    break;

                case 'login':
                    link.setAttribute('href', `#`);
                    link.style.fontWeight = '700';
                    break;
                default:
                    break;
            }
        }
    })
})()