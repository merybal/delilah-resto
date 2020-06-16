//const sequelize = require('../data-base/sequelize.js')

class Users {
    constructor (sequelize) {
        this.sequelize = sequelize;
    };

    //Creates new user
    create(username, full_name, email, phone_number, adress, password) {
        const newUser = this.sequelize.query(
            `INSERT INTO users (username, full_name, email, phone_number, adress, password)
             VALUES (:username, :full_name, :email, :phone_number, :adress, :password)`,
                { replacements: {
                    username,
                    full_name,
                    email,
                    phone_number,
                    adress,
                    password
                    }
                }
        );
        return newUser;
    };

    //Returns full user list
    read() {
        const userList = this.sequelize.query(
            `SELECT * FROM users`,
                { type: this.sequelize.QueryTypes.SELECT }
        );
        return userList;
    };

    //Returns user with specified ID
    readId(id_user) {
        const user = this.sequelize.query(
            `SELECT * FROM users WHERE id_user = :id_user`,
                { replacements: {
                    id_user: [id_user]
                    },
                type: this.sequelize.QueryTypes.SELECT
                }
        );
        return user;
    };

    updateAdminPrivileges(id_user) {
        const adminUser = this.sequelize.query(
            `UPDATE users
             SET admin = :admin
             WHERE id_user = :id_user`,
                { replacements: {
                    id_user,
                    admin: 1
                    }
                }
        );
        return adminUser;
    };

};


module.exports = { Users };