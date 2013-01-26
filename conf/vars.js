module.exports = exports = {
    successRedirect : "/"
    , errorRedirect : "/login"
    , logoutRedirect : "/"
    , errorNoRole : "Not authorised to access this resource"
    , errorNoAuthentication : "Authentication required"
    , ROLES : ['ROLE_USER','ROLE_ADMIN','ROLE_SUPERADMIN']
};