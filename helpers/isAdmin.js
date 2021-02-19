/*jshint esversion: 6 */
module.exports = {
    isAdmin : (req, res, next) => {
        if(req.isAuthenticated() && req.user.isAdmin){
            return next();
        }
        req.flash('error_msg', 'Voce precisa ser admin!');
        res.redirect('/');
    }
};