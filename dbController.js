const establishSSHConnection = require('./dbService');

console.log("inside dbcontroller")

const displayuser = async (req, res) => {
    console.log('Handling login authentication request...'); // Added console log here
    try {
        const connection = await establishSSHConnection();
        connection.query('SELECT username FROM loginauth where roles = "HR manager"', (error, results, fields) => {
            if (error) {
                console.error('Error executing query:', error);
                res.status(500).json({ error: 'Error executing query' });
            } else {
                console.log('Query executed successfully.');
                res.json(results);
            }
            connection.end();
        });
    } catch (error) {
        console.error('Error establishing MySQL connection:', error);
        res.status(500).json({ error: 'Error establishing MySQL connection' });
    }
};

const loginauth = async (req, res) => {
    console.log('Handling login authentication request...');
    console.log('Request body:', req.body);
    const { username, password } = req.body; // Extract username and password from request body
    
    if (!username || !password) {
        console.log('Username or password is missing.');
        return res.status(400).json({ error: 'Username or password is missing' });
    }

    try {
        const connection = await establishSSHConnection();
        const [rows, fields] = await connection.execute('SELECT * FROM loginauth WHERE username = ? AND password = ?', [username, password]);
        
        if (rows.length === 1) {
            console.log('User authenticated successfully.');
            res.status(200).json({ message: 'Authentication successful' });
        } else {
            console.log('Invalid username or password.');
            res.status(401).json({ error: 'Invalid username or password' });
        }
        
        connection.end();
    } catch (error) {
        console.error('Error in login authentication:', error);
        res.status(500).json({ error: 'Error in login authentication' });
    }
};

const insertData = async (req, res) => {
    console.log('Inserting data into loginauth table...');
    const { roles, username, password, remember } = req.body; // Extract data from request body
    console.log(req.b)

    try {
        // Establish SSH connection
        const connection = await establishSSHConnection();

        // Execute the INSERT query
        connection.query(
            'INSERT INTO loginauth (roles, username, password, remember) VALUES (?, ?, ?, ?)',
            [roles, username, password, remember],
            (error, results, fields) => {
                if (error) {
                    console.error('Error executing INSERT query:', error);
                    res.status(500).json({ error: 'Error executing INSERT query' });
                } else {
                    console.log('Data inserted successfully.');
                    res.status(200).json({ message: 'Data inserted successfully' });
                }
                connection.end(); // Close the connection
            }
        );
    } catch (error) {
        console.error('Error establishing MySQL connection:', error);
        res.status(500).json({ error: 'Error establishing MySQL connection' });
    }
};



module.exports = { displayuser, loginauth , insertData};
