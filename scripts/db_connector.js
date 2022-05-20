const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fiwi_users',
    connectionLimit: 10,
    queueLimit: 0
});
const bcrypt = require('bcrypt');
const saltRounds = 10;

class dbConnection {
    constructor() { }
    async getConnection(username, password) {
        const promisePool = pool.promise();
        const result = await promisePool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (result[0].length > 0 ){
            const encryptedPassword = await bcrypt.compare(password, result[0][0].password);
            if (encryptedPassword) {
                return true;
            }else{
                return false;
            }
        }
        else{
            return false;
        }
    }
    async getID(username) {
        const promisePool = pool.promise();
        const result = await promisePool.query('SELECT ID FROM users WHERE username = ?', [username]);
        return result[0][0].ID;
    }
    async getCards(username) {
        const promisePool = pool.promise();
        let ID = await this.getID(username);
        const result = await promisePool.query('SELECT platform, web_url, poster FROM titles, library, users WHERE library.userID = users.ID AND library.titleID = titles.ID AND library.userID = ?', [ID]);
        return result[0]
    }
    async createUser(data) {
        "Creates an user and returns a confirmation"
        //id is auto incremental
        let user = data.username;
        const promisePool = pool.promise();
        const encrypted = await bcrypt.hash(data.password, saltRounds);
        const check = await promisePool.query('SELECT username FROM users where username = ?', [user]);
        //check if user name is already in database
        if (check[0].length === 0) {
            const result = await promisePool.query('INSERT INTO  users (email,username, password, name) VALUES(?,?,?,?)', [data.email, user, encrypted, data.name]);
            return result[0].affectedRows;
        }
        else{
            return false
        }
    }
    async getTitle(web_url) {
        "This returns the title's id"
        const promisePool = pool.promise();
        const titleID = await promisePool.query('SELECT ID FROM titles WHERE web_url LIKE ?', [web_url])
        if (titleID.length > 0){
            return titleID[0][0].ID;
        }
        else{
            return false;
        }
    }
    async saveCard(username, web_url, poster, platform){
        "get the userID, then checks if that link is already saved in titles or  related to the user, if not it is saved"
        const promisePool = pool.promise();
        let userID = await this.getID(username);
        const checkTitle = await promisePool.query('SELECT web_url FROM titles WHERE web_url = ?', [web_url])
        if (checkTitle[0].length === 0){
            await promisePool.query('INSERT INTO titles ( platform , web_url, poster) VALUES (?,?,?)', [platform, web_url, poster])
        }
        let titleID = await this.getTitle(web_url);

        const checkCard = await promisePool.query('SELECT web_url, poster FROM titles, library, users WHERE library.userID = users.ID AND library.titleID = titles.ID AND library.userID = ? and web_url = ?', [userID, web_url ]);
        if (checkCard[0].length === 0){
            await promisePool.query('INSERT INTO library (userID, titleID) VALUES (?,?)', [userID, titleID]);
            return true;
        }
        else{
            return false;
        }
    }
    async deleteCard(username, web_url) {
        "get the userID, then deletes item that relates user with title"
        const promisePool = pool.promise();
        let userID = await this.getID(username);
        let titleID = await this.getTitle(web_url);
        const deleteCard = await promisePool.query('DELETE FROM `library` WHERE userID = ? and titleID = ?;', [userID, titleID ]);
        if (deleteCard[0].affectedRows > 0){
            return true;
        }
        else{
            return false;
        }
    }
}


module.exports = dbConnection;