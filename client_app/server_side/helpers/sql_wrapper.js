/**
 * this is a sql wrapper so high
 * level sql queries can be invoked
 */

const mysql             = require('mysql2/promise');
const dotenv            = require("dotenv");
const { randomUUID }    = require('crypto');

dotenv.config();

//------------------------------------------------------------------

class MySQLConnector 
{
    // data inside env variables
    host;
    user;
    password;
    // connection to rds instance
    con;
    db;

    constructor(host=null,user=null,password=null,db=null)
    {
        // connect with basic env varibles
        this.host       = host? host :          "dreams-main.ch66csoqs32t.us-east-2.rds.amazonaws.com"
        this.user       = user? user :          "admin"
        this.password   = password? password :  "dreams-pw-rds-1"
        this.db         = db? db :              "dreams_main";
        this.con        = null;
        this._connectionPromise = this._initConnection(db);
    }

    async _initConnection(db) {
        const config = {
            host: this.host,
            user: this.user,
            password: this.password
        };
    
        if (db) {
            config.database = db;
        }
        this.con = await mysql.createConnection(config);
        return this.con;
    }

    async _ensureConnection() {
        if (!this.con) {
            await this._connectionPromise;
        }
        return this.con;
    }    

    async testConnection()
    {
        try {
            const con = await this._ensureConnection();
            await con.query('SELECT 1');
            console.log("Connected!");
        } catch (err) {
            console.error("Unable to connect to mysql:", err);
            throw err;
        }
    }

    async selectDatabase(db)
    {
        if (!db)
            return;

        const con = await this._ensureConnection();
        await con.changeUser({ database: db });
        console.log("New Database selected:", db);
    }

    async createTable(table, columns) 
    {
        // columns = { name: "VARCHAR(255)", age: "INT", created_at: "TIMESTAMP" }
        const defs = Object.entries(columns)
            .map(([col, type]) => `${col} ${type}`)
            .join(", ");
    
        const sql       = `CREATE TABLE IF NOT EXISTS ${table} (${defs})`;
        const con       = await this._ensureConnection();
        const [result]  = await con.query(sql);
        console.log(`Table '${table}' created`);
        return result;
    }

    async dropTable(table=null)
    {
        if (!table)
            return false;

        const sql       = `DROP TABLE ${table}`;
        const con       = await this._ensureConnection();
        const [result]  = await con.query(sql);
        console.log(result);
        return result;
    }

    async invokeSQL(queries=null)
    {
        // no sql code given
        if (!queries)
            return null;

        // invoke the sql commands
        const con       = await this._ensureConnection();
        const [result]  = await con.query(queries);
        console.log("Results:", result);
        return result;
    }

    async insertIntoTable(table, columns=null, values=[]) 
    {
        let sql;
    
        if (Array.isArray(columns) && columns.length > 0) {
            const colList = columns.join(", ");
            sql = `INSERT INTO ${table} (${colList}) VALUES ?`;
        } else {
            // no columns → insert into all columns (must match table structure)
            sql = `INSERT INTO ${table} VALUES ?`;
        }
    
        const con       = await this._ensureConnection();
        const [result]  = await con.query(sql, [values]);
        console.log("Rows inserted: " + result.affectedRows);
        return result;
    }

    async selectAllRows(table)
    {
        if (!table)
        {
            console.log("INVALID TABLE:", table)
            return [];
        }

        const sql           = `SELECT * FROM ${table} WHERE active = 1`;
        const con           = await this._ensureConnection();
        const [result]      = await con.query(sql);
        return result;
    }

    async clearTable(table)
    {
        const sql       = `DELETE FROM ${table}`;
        const con       = await this._ensureConnection();
        const [result]  = await con.query(sql);
        console.log(result);
        return result;
    }
    
}

//--------------------------------- TESTING ---------------------------------------------------
module.exports = { MySQLConnector }
