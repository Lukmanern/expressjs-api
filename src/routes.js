const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

const routes = [
  {
    // get all books
    method: 'GET',
    path: '/',
    handler: getAllBooksHandler,
  },
  {
    // get all books
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    // create a book
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    // get single-book detail
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },
  {
    // edit single-book
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler,
  },
  {
    // delete single-book
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
