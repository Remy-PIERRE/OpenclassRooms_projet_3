/* async modules */
const module_header = "./header.js";
const module_gallery = "./gallery.js";
const module_login = "./login.js";

/* actually only '../index.html' and '../html/login.html' exists */
const url = window.location.href;

/* index.html only ! */
if(url.includes('index.html')) {
    import(module_gallery)
    import(module_header)
}

/* login.html only ! */
if(url.includes('login.html')) {
    import(module_login)
    import(module_header)
}