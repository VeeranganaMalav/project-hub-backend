module.exports.isAdminAndProjectManager = async (req, res, next) => {
    try {
        const user = req.user;

        if(user.role == "Project Manager" || user.role == "Admin"){
            next();
        }
        else{
            res.status(403).send({ message: "You are not authorized for this functionality." });
            return;
        }
    }
    catch (err) {
        console.log(err);
    }
};