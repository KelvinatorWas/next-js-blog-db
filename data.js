const blog_post = {
  tableName: "blogs",
  sqlTableData: {
    post_id: "INT AUTO_INCREMENT PRIMARY KEY",
    title: "VARCHAR(255) NOT NULL",
    content: "TEXT NOT NULL",
    createdAt: "TIMESTAMP",
    updatedAt: "TIMESTAMP",
  }
};

const comments = {
  tableName: "comments",
  sqlTableData: {
    comment_id: "INT AUTO_INCREMENT PRIMARY KEY",
    post_id: "VARCHAR(255) NOT NULL",
    user_id: "VARCHAR(255) NOT NULL",
    content: "TEXT NOT NULL",
    createdAt: "TIMESTAMP",
    updatedAt: "TIMESTAMP",
  }
};

const tags = {
  tableName: "tags",
  sqlTableData: {
    tag_id: "INT AUTO_INCREMENT PRIMARY KEY",
    name: "VARCHAR(255) NOT NULL",
  }
};

const postTags = {
  tableName: "post_tags",
  sqlTableData: {
    post_id: "INT NOT NULL",
    tag_id: "INT NOT NULL",
  }
};

const admins = {
  tableName: "admins",
  sqlTableData: {
    username: "VARCHAR(255) NOT NULL",
    password: "VARCHAR(255) NOT NULL",
  }
};

const dataTables = {
  blog_post,
  comments,
  tags,
  postTags,
  admins,
};

const keys = Object.keys(dataTables);

const SqlDBTables = () => {
  let Tables = [];
  
  for (const key of keys) {
    const { tableName, sqlTableData } = dataTables[key];
    const tableData = Object.entries(sqlTableData)
      .map(([column, definition]) => `${column} ${definition}`)
      .join(",\n \t");
  
    const dataTable = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
          ${tableData}
      )
    `;
    Tables.push({name:tableName, data:dataTable})
  }

  return Tables
}

export {SqlDBTables}