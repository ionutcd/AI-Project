const User = require("../../../models/UserSchema");

const DelUser = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).send('Invalid payload');
    }
    try {
        const allusers = await User.findByIdAndDelete(id);
        if (!allusers) {
            return res.status(400).send("No record found");
        }
        res.status(200).json(allusers);
    }

    catch (error) {
        res.status(501).json(error)

    }

}


module.exports = DelUser; 

