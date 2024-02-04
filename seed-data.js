const mysql = require('mysql2');
const fs = require('fs');
const DB_NAME = 'blog_data_base'

const blog_post = {
  tableName: "blogs",
  sqlTableData: {
    post_id: "INT AUTO_INCREMENT NOT NULL",
    title: "VARCHAR(255) NOT NULL",
    description: "TEXT NOT NULL",
    content: "TEXT NOT NULL",
    createdAt: "TIMESTAMP",
    updatedAt: "TIMESTAMP",
    PRIMARY: "KEY (post_id)"
  },
  link:[]
};

const comments = {
  tableName: "comments",
  sqlTableData: {
    comment_id: "INT AUTO_INCREMENT PRIMARY KEY",
    post_id: "INT NOT NULL",
    user_id: "INT NOT NULL",
    content: "TEXT NOT NULL",
    createdAt: "TIMESTAMP",
    updatedAt: "TIMESTAMP",
  },
  link: [
    "KEY `post_id` (`post_id`)",
    "FOREIGN KEY (`post_id`) REFERENCES `blogs` (`post_id`)",
  ]
};

const tags = {
  tableName: "tags",
  sqlTableData: {
    tag_id: "INT AUTO_INCREMENT NOT NULL",
    name: "VARCHAR(255) NOT NULL",
    PRIMARY: "KEY (tag_id)"
  },
  link:[]
};

const post_tags = {
  tableName: "post_tags",
  sqlTableData: {
    post_tag_id: "INT AUTO_INCREMENT PRIMARY KEY",
    post_id: "INT NOT NULL",
    tag_id: "INT NOT NULL",
  },
  link:[
    "KEY `post_id` (`post_id`)",
    "KEY `tag_id` (`tag_id`)",
    "FOREIGN KEY (`post_id`) REFERENCES `blogs` (`post_id`)",
    "FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`)",
  ]
};

const admins = {
  tableName: "admins",
  sqlTableData: {
    username: "VARCHAR(255) NOT NULL",
    password: "VARCHAR(255) NOT NULL",
  },
  link:[]
};

const images = {
  tableName: "images",
  sqlTableData: {
    image_id: "INT AUTO_INCREMENT NOT NULL",
    image_name: "VARCHAR(255)",
    post_id: "INT NOT NULL",
    image_data: "LONGBLOB NOT NULL",
    PRIMARY: "KEY (image_id)"
  },
  link: [
    "KEY `post_id` (`post_id`)",
    "FOREIGN KEY (`post_id`) REFERENCES `blogs` (`post_id`)",
  ]
};

const dataTables = {
  blog_post,
  comments,
  tags,
  post_tags,
  admins,
  images
};

const keys = Object.keys(dataTables);

const SqlDBTables = () => {
  let Tables = [];
  
  for (const key of keys) {
    const { tableName, sqlTableData, link } = dataTables[key];
    const datalink = [...link];

    let tableData = Object.entries(sqlTableData)
      .map(([column, definition]) => `${column} ${definition}`)
      .join(",\n \t");
    
    console.log(datalink.length)
    if (datalink.length) {
      console.log("SHOULD HAVE A LINK");
      const links = datalink.join(",\n \t");
      tableData += ", \n \t" + links; 
    }
  
    const dataTable = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
          ${tableData}
      )
    `;
    
    console.log(dataTable);

    Tables.push({name:tableName, data:dataTable})
  }

  return Tables
}


const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'example',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }

  console.log('Connected to MySQL server');

  // Create the database if it doesn't exist
  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;
  connection.query(createDatabaseQuery, (createDatabaseError, createDatabaseResults) => {
    if (createDatabaseError) {
      console.error('Error creating database:', createDatabaseError);
      connection.end();
      return;
    }

    console.log(`Database "${DB_NAME}" created or already exists`);

    // Switch to the created database
    connection.changeUser({ database: DB_NAME }, (changeUserError) => {
      if (changeUserError) {
        console.error('Error switching to database:', changeUserError);
        connection.end();
        return;
      }

      console.log(`Switched to database "${DB_NAME}"`);

      // Define the SQL query to create a table if not exists

      const TABLES = SqlDBTables();
      
      for (const tableQuery of TABLES ) {

        connection.query(tableQuery.data, (createTableError, createTableResults) => {
          if (createTableError) {
            console.error('Error creating table:', createTableError);
            connection.end();
            return;
          }
  
          console.log(`Table ${tableQuery.name} created or already exists`);
        });

        // if (tableQuery.name == "images") {
        //   console.log('\n INSERTING IMAGE INTO TABLE \n')
        //   const insertDataQuery = `
        //     INSERT INTO ${images.tableName} (image_name, post_id, image_data) VALUES
        //       ('sunset', 1, ?)
        //   `;

        //   const image = fs.readFileSync('./images/sunset.jpg')
            
        //   // Execute the query to insert data
        //   connection.query(insertDataQuery, image, (insertDataError, insertDataResults) => {
        //     if (insertDataError) {
        //       console.error('Error inserting data:', insertDataError);
        //     } else {
        //       console.log('Data inserted or already exists');
        //     }
            
        //     // Close the connection
        //     connection.end();
        //   });
        // }

      }
      connection.end()

      // const createTableQuery = `
      //   CREATE TABLE IF NOT EXISTS users (
      //     id INT AUTO_INCREMENT PRIMARY KEY,
      //     name VARCHAR(255) NOT NULL,
      //     email VARCHAR(255) NOT NULL
      //   )
      // `;

      // Execute the query to create the table
      // connection.query(createTableQuery, (createTableError, createTableResults) => {
      //   if (createTableError) {
      //     console.error('Error creating table:', createTableError);
      //     connection.end();
      //     return;
      //   }

      //   console.log('Table "users" created or already exists');

      //   // Define the SQL query to insert data into the table
      //   const insertDataQuery = `
      //     INSERT INTO users (name, email) VALUES
      //       ('John Doe', 'john@example.com'),
      //       ('Jane Doe', 'jane@example.com'),
      //       ('Bob Smith', 'bob@example.com')
      //   `;

      //   // Execute the query to insert data
      //   connection.query(insertDataQuery, (insertDataError, insertDataResults) => {
      //     if (insertDataError) {
      //       console.error('Error inserting data:', insertDataError);
      //     } else {
      //       console.log('Data inserted or already exists');
      //     }

      //     // Close the connection
      //     connection.end();
      //   });
      // });
    });
  });
});
