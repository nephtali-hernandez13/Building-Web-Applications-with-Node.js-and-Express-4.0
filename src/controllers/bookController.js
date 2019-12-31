const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookController');

function bookController(bookService, nav_data) {
    function getIndex(req, res) {
        const url = 'mongodb://localhost:27017';
        const dbName = 'library';
        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url);
                debug('Connected correctly to server');
                const db = client.db(dbName);
                const col = await db.collection('books')
                const books = await col.find().toArray();
                res.render('books', {
                    nav_data,
                    books
                });
            } catch (err) {
                debug(err.stack);
            }
            client.close();
        }());
        /*const query = 'SELECT * FROM book';                
        const pageToRender = 'books';            
        return getBooks( query, pageToRender, res );*/
    };

    function getById(req, res) {
        const { id } = req.params;
        const url = 'mongodb://localhost:27017';
        const dbName = 'library';

        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url);
                debug('Connected correctly to server');

                const db = client.db(dbName);
                const col = await db.collection('books');
                const book = await col.findOne({ _id: new ObjectID(id) });
                debug(book);
                book.details = await bookService.getBookById(book.bookId);
                res.render('book', {
                    nav_data,
                    book
                });
            } catch (err) {
                debug(err.stack);
            }
            client.close();
        }());
        /*const query = 'SELECT * FROM book WHERE id = @id';                
        const pageToRender = 'book';            
        return getBooks( query, pageToRender, res );*/
    }

    function middleware(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect('/');
        }
    }

    return { getIndex, getById, middleware };
}

module.exports = bookController;