const Role = require('../models/role');
const User = require('../models/user');


const isRoleValid = async(role = 'USER_ROLE') => {

    try {

        const roleExists = await Role.findOne({ role });
        
        if (!roleExists) {
            throw new Error(`The role ${role}, is not registered in the database.`);
        }
        
    } catch (error) {
        console.log(error);
    }


};

const emailExists = async(email = '') => {

    const emailConflict = await User.findOne({ email });

    if (emailConflict) {
        throw new Error(`The email '${email}' is already registered.`);
    };
};

const userByIdExists = async(id = '') => {

    const userExists = await User.findById( id );
    
    if ( !userExists ) {
        throw new Error(`The id '${id}' does not exist.`);
    };
};




module.exports = {
    isRoleValid,
    emailExists,
    userByIdExists
}