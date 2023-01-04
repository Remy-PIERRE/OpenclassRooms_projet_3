const module_header = './header.js';

export const login_listener = (async function () {

    const form = document.querySelector('#login_form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        /*test with regex user_id and password => return true / false */
        const values_test_result = values_test();
        console.log('values_test_result', values_test_result)
        if(!values_test_result) {
            return auth_failed({ msg: 'Erreur de saisie !' });
        }

        /* fetch user / pass => return response / false */
        let response = await fetch_auth();
        if(response) {
            sessionStorage.setItem('jwt', response.token);
            window.location.href = "http://127.0.0.1:5000/FrontEnd/index.html";
        }
    })



    function values_test() {

        const email = document.getElementById('email').value;
        const email_pattern = new RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
        const email_tested = email_pattern.test(email);

        const password = document.getElementById('password');
        /* under construction */
        const password_pattern = new RegExp('(?=.*[a-z])(?=.*[A-Z])');
        const password_tested = password_pattern.test(password);

        console.log(email_tested, password_tested)
        return (email_tested && password_tested) ? true : false;
    }



    async function fetch_auth() {

        /* fetch args */
        const fetch_url = "http://localhost:5678/api/users/login"
        const fetch_options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            })
        }

        try{
            let response = await fetch(fetch_url, fetch_options);
            response = await response.json();

            if(response.message || response.error) { return auth_failed({ msg: "Erreur dans l’identifiant ou le mot de passe !" }) }
            sessionStorage.setItem('jwt', response.token);
            const redirection_url = window.location.href.replace('#contact', '');
            window.location.href = redirection_url.replace('html/login', 'index');
        }
        catch(error) {
            auth_failed({ msg: 'Probleme de connection au serveur !', data: error });
        }
    }



    function auth_failed(response_failed) {

        const main = document.querySelector('.login__main');
        const msg_error = document.createElement('div');
        msg_error.className = 'msg--error  font--lighter';
        msg_error.style.top = '40px';
        msg_error.innerText = response_failed.msg;
        main.appendChild(msg_error);

        (response_failed.data) ? console.log('data-error : ', response_failed.data) : null;
        form.reset();

        setTimeout(() => {
            msg_error.remove();
        }, 3000)

        return false;
    }
})()



