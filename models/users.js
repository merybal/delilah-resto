class Users {
    constructor (sequelize) {
        this.sequelize = sequelize;
    }

    create(username, full_name, email, phone_number, adress, password) {
        const newUser = this.sequelize.query(
            `INSERT INTO users (username, full_name, email, phone_number, adress, password, admin, enabled)
             VALUES (:username, :full_name, :email, :phone_number, :adress, :password, :admin, :enabled)`,
            { replacements: {
                username,
                full_name,
                email,
                phone_number,
                adress,
                password,
                admin: false,
                enabled: true
                }
            }
        );
        return newUser;
    };

    readId(id_user) {
        console.log(id_user);
        const user = this.sequelize.query(
            `SELECT * FROM users WHERE id_user = :id_user`,
            { replacements: {
                id_user: [id_user]
                },
            type: this.sequelize.QueryTypes.SELECT
            }
        )
        return user;
    };
    
};


module.exports = { Users };