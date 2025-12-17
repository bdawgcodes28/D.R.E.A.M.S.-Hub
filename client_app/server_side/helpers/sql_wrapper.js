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
            password: this.password,
            enableKeepAlive: true,
            keepAliveInitialDelay: 10000
        };
    
        if (db) {
            config.database = db;
        }
        
        const connection = await mysql.createConnection(config);
        
        // Handle connection errors and auto-reconnect
        connection.on('error', (err) => {
            console.error('MySQL connection error:', err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
                console.log('Connection lost, will reconnect on next query');
                this.con = null; // Mark connection as dead
            }
        });
        
        // Handle connection end
        connection.on('end', () => {
            console.log('MySQL connection ended');
            this.con = null;
        });
        
        this.con = connection;
        return connection;
    }

    async _ensureConnection() {
        // Check if connection exists and is still alive
        if (!this.con) {
            // No connection, create new one
            this._connectionPromise = this._initConnection(this.db);
            this.con = await this._connectionPromise;
        } else {
            // Connection exists, but check if it's still alive
            try {
                // Try a simple query to check if connection is alive
                await this.con.query('SELECT 1');
            } catch (err) {
                // Connection is dead, recreate it
                console.log('Connection is dead, recreating...');
                try {
                    await this.con.end(); // Clean up old connection
                } catch (e) {
                    // Ignore errors when closing dead connection
                }
                this.con = null;
                this._connectionPromise = this._initConnection(this.db);
                this.con = await this._connectionPromise;
            }
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

    async invokeSQL(queries=null, params=null)
    {
        // no sql code given
        if (!queries)
            return null;

        try {
            // invoke the sql commands
            const con       = await this._ensureConnection();
            // Support parameterized queries if params are provided
            const [result]  = params ? await con.query(queries, params) : await con.query(queries);
            //console.log("Results:", result);
            return result;
        } catch (err) {
            // If connection error, try to reconnect once
            if (err.code === 'PROTOCOL_CONNECTION_LOST' || 
                err.code === 'ECONNRESET' || 
                err.message && err.message.includes('closed state')) {
                console.log('Connection lost during query, reconnecting and retrying...');
                this.con = null; // Mark connection as dead
                const con = await this._ensureConnection();
                // Retry the query once
                const [result] = params ? await con.query(queries, params) : await con.query(queries);
                return result;
            }
            // Re-throw other errors
            throw err;
        }
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
    
        try {
            const con       = await this._ensureConnection();
            const [result]  = await con.query(sql, [values]);
            console.log("Rows inserted: " + result.affectedRows);
            return result;
        } catch (err) {
            // If connection error, try to reconnect once
            if (err.code === 'PROTOCOL_CONNECTION_LOST' || 
                err.code === 'ECONNRESET' || 
                err.message && err.message.includes('closed state')) {
                console.log('Connection lost during insertIntoTable, reconnecting and retrying...');
                this.con = null;
                const con = await this._ensureConnection();
                const [result] = await con.query(sql, [values]);
                console.log("Rows inserted: " + result.affectedRows);
                return result;
            }
            throw err;
        }
    }

    async selectAllRows(table)
    {
        if (!table)
        {
            console.log("INVALID TABLE:", table)
            return [];
        }

        try {
            const sql           = `SELECT * FROM ${table}`;
            const con           = await this._ensureConnection();
            const [result]      = await con.query(sql);
            return result;
        } catch (err) {
            // If connection error, try to reconnect once
            if (err.code === 'PROTOCOL_CONNECTION_LOST' || 
                err.code === 'ECONNRESET' || 
                err.message && err.message.includes('closed state')) {
                console.log('Connection lost during selectAllRows, reconnecting and retrying...');
                this.con = null;
                const con = await this._ensureConnection();
                const [result] = await con.query(`SELECT * FROM ${table}`);
                return result;
            }
            throw err;
        }
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
