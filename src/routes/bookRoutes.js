const express = require('express');
//const pg = require('pg');
const bookRouter = express.Router();
const bookController = require('../controllers/bookController');
const bookService = require('../services/goodreadsService');

function router(nav_data, config) {

    async function getBooks(query, pageToRender, res) {
        const pool = new pg.Pool(config);
        try {
            await pool.connect((err, client, done) => {
                if (err) {
                    console.log('Can not connect to the DB' + err);
                }
                client.query(query, (err, result) => {
                    done();
                    if (err) {
                        return next(err)
                    }
                    resultData = result.rows;
                    res.render(pageToRender, {
                        nav_data,
                        resultData
                    });
                });
            });
        } finally {
            pool.end()
        }
    }

    const { getIndex, getById, middleware } = bookController(bookService, nav_data);

    bookRouter.use(middleware);

    bookRouter.route('/')
        .get(getIndex);

    bookRouter.route('/:id')
        .get(getById);
        
    return bookRouter;
}

module.exports = router;