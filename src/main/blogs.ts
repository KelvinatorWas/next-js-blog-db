import express from "express";
import { Connection, OkPacket, RowDataPacket } from "mysql2";

export const getBlogs = (app: express.Express, connection: Connection) => {
  app.get("/blogs", async (req, res) => {
    // Execute the query to get all users
    connection.query("SELECT * FROM blogs", (error, results) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // Send the users as a JSON response
      res.json(results);
    });
  });
};

export const getBlogByName = (app: express.Express, connection: Connection) => {
  app.get("/blogs/:name", async (req, res) => {
    // Execute the query to get all users
    const { name } = req.params;

    const fixedName = name.replace("_", " ");

    connection.query(
      "SELECT * FROM blogs WHERE title = ?",
      fixedName,
      (error, results: RowDataPacket[]) => {
        if (error) {
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        // Send the users as a JSON response
        res.json(results[0]);
      }
    );
  });
};

export const getRecentBlogs = (app: express.Express, connection: Connection) => {
  app.get("/blogs/recent/:amount?", async (req, res) => {
    const amount = req.params.amount || 3;
    const newAmount = +amount;
    if (isNaN(newAmount)) {
      res.status(400).json({error: `Invalid syntax 'amount' should be a number not '${amount}'!`});
      console.log("Hello");

      return;
    }

    connection.query("SELECT post_id, title, description FROM blogs ORDER BY createdAt DESC LIMIT ?",[newAmount], (error, results) => {
      if (error) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // Sends recent blogs as a JSON response
      res.json(results);
    });
  });
};

export const getBlogByTag = (app: express.Express, connection: Connection) => {
  app.get("/blogs/tag/:tag_id", async (req, res) => {
    // Extract the tag_id parameter from the request params
    const { tag_id } = req.params;

    connection.query(
      "SELECT * FROM blogs JOIN post_tags ON blogs.post_id = post_tags.post_id WHERE post_tags.tag_id = ?",
      [tag_id],
      (error, results: RowDataPacket[]) => {
        if (error) {
          res
            .status(500)
            .json({ error: "Internal Server Error", msg: error.message });
          return;
        }

        // Send the blogs as a JSON response
        res.json(results);
      }
    );
  });
};

export const getBlogNameById = (
  app: express.Express,
  connection: Connection
) => {
  app.get("/blogs/name/:id", async (req, res) => {
    // Execute the query to get all users
    const { id } = req.params;

    connection.query(
      "SELECT title FROM blogs WHERE post_id = ?",
      id,
      (error, results: RowDataPacket[]) => {
        if (error) {
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        // Send the users as a JSON response
        res.json(results[0]);
      }
    );
  });
};

export const createNewBlog = (app: express.Express, connection: Connection) => {
  app.post(`/blogs`, async (req, res) => {
    console.log("Before");
    const {title, content, description, createdAt } = req.body;

    console.log(req.body);

    connection.query(
      `INSERT INTO blogs (title, content, description, createdAt) VALUES (?, ?, ?, ?)`,
      [title, content, description, createdAt],
      (error, results: OkPacket) => {
        if (error) {
          res.status(500).json({ error: "Internal Server Error", msg: error });
          return;
        }

        if (results.affectedRows === 0) {
          res.status(404).json({ error: "Item not found" });
        } else {
          res.status(204).end();
        }
      }
    );
  });
};

export const deleteBlog = (app: express.Express, connection: Connection) => {
  app.delete("/blogs/:id", async (req, res) => {
    const id = req.params.id;
    // Execute the query to get all users
    connection.query(
      "DELETE FROM blogs WHERE post_id=?",
      id,
      (error, results: OkPacket) => {
        if (error) {
          res.status(500).json({ error: "Internal Server Error", msg: error });
          return;
        }

        if (results.affectedRows === 0) {
          res.status(404).json({ error: "Item not found" });
        } else {
          res.status(204).end();
        }
      }
    );
  });
};

export const updateBlog = (app: express.Express, connection: Connection) => {
  app.put(`/blogs/:id`, async (req, res) => {
    const updateById = req.params.id;
    const data = req.body;

    connection.query(
      `UPDATE blogs SET ? WHERE post_id=?`,
      [data, updateById],
      (error, results: OkPacket) => {
        if (error) {
          res.status(500).json({ error: "Internal Server Error", msg: error });
          return;
        }

        if (results.affectedRows === 0) {
          res.status(404).json({ error: "Item not found" });
        } else {
          res.status(204).end();
        }
      }
    );
  });
};
