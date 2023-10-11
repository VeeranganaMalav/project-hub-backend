module.exports.isResourceAccessible = async (req, res, next) => {
    try {
        const user = req.user;
        const resourceId = req.params.id; // ID from the request's parameters

        if(user.projects.includes(resourceId) || user.tasks.includes(resourceId) || user.teams.includes(resourceId)){
            // The user is authorized to access this resource
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