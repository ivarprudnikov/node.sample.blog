module.exports = exports = {
    successRedirect : "/"
    , errorRedirect : "/login"
    , logoutRedirect : "/"
    , errorNoRole : "Resource requires you to have higher role"
    , errorNoAuthentication : "You have to be authenticated to access this resource"
    , ROLES : ['ROLE_USER','ROLE_ADMIN','ROLE_SUPERADMIN']
};