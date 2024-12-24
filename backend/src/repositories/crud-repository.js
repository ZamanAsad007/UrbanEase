const dbConnection = require('../config'); // Assuming you have a 'db.js' file for MySQL2 connection

class CrudRepository {
    constructor(dbConnection, tableName) {
        // Validate the passed connection object
        if (!dbConnection || !dbConnection.execute) {
            throw new Error('Invalid database connection passed to CrudRepository.');
        }
        this.connection = dbConnection; // MySQL2 connection object
        this.tableName = tableName; // Name of the table
    }

    // CREATE method: Inserts a new record into the specified table
    async create(data) {
        try {
            const query = `INSERT INTO ${this.tableName} SET ?`;
            const [result] = await this.connection.execute(query, [data]);
            return result; // Returns the result of the query (inserted data)
        } catch (error) {
            throw new Error(`Error creating resource: ${error.message}`);
        }
    }

    // DESTROY method: Deletes a record by ID
    async destroy(id) {
        try {
            const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
            const [result] = await this.connection.execute(query, [id]);
            if (result.affectedRows === 0) {
                throw new Error(`Resource not found with id: ${id}`);
            }
            return result; // Returns the result of the delete operation
        } catch (error) {
            throw new Error(`Error deleting resource: ${error.message}`);
        }
    }

    // GET method: Fetches a record by ID
    async get(id) {
        try {
            const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
            const [rows] = await this.connection.execute(query, [id]);
            if (rows.length === 0) {
                throw new Error(`Resource not found with id: ${id}`);
            }
            return rows[0]; // Returns the first row matching the ID
        } catch (error) {
            throw new Error(`Error fetching resource: ${error.message}`);
        }
    }

    // GET ALL method: Fetches all records from the table
    async getAll() {
        try {
            const query = `SELECT * FROM ${this.tableName}`;
            const [rows] = await this.connection.execute(query);
            return rows; // Returns all rows from the table
        } catch (error) {
            throw new Error(`Error fetching resources: ${error.message}`);
        }
    }

    // UPDATE method: Updates a record by ID
    async update(id, data) {
        try {
            const query = `UPDATE ${this.tableName} SET ? WHERE id = ?`;
            const [result] = await this.connection.execute(query, [data, id]);
            if (result.affectedRows === 0) {
                throw new Error(`Resource not found with id: ${id}`);
            }
            return result; // Returns the result of the update operation
        } catch (error) {
            throw new Error(`Error updating resource: ${error.message}`);
        }
    }
}


module.exports = CrudRepository;
