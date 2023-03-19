const { nanoid } = require('nanoid');
const books = require('./books');

/**
 * Handler to add new book
 * @param {*} request
 * @param {*} h
 * @returns {Object} response
 */
const addBookHandler = (request, h) => {
  // Extract the necessary data
  // from the request payload
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Generate a unique ID for
  // the new book using
  // the nanoid library
  const id = nanoid(16);

  // Determine whether the book is finished
  // based on the readPage and pageCount values
  const finished = pageCount === readPage;

  // Set the insertedAt and updatedAt
  // values to the current date and time
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // Create a new book object with all
  // the extracted data, as well
  // as the generated values
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // Check if the name field is undefined,
  // and return a failure response if it is
  if (typeof name === 'undefined') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  // Check if the readPage value is greater than
  // the pageCount value, and return
  // a failure response if it is
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  // Add the new book object to the books array
  books.push(newBook);

  // Check if the new book was successfully added to the books array
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // Return a success response with
  // the book ID if the book
  // was successfully added
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  // Return an error response if
  // the book was not successfully added
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);
  return response;
};

/**
 * Handler to get all books
 * @param {*} request
 * @param {*} h
 * @returns {Object} response
 */
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  // if books is empty, return
  // an empty array of books
  if (books.length === 0) {
    const response = h.response({
      status: 'success',
      data: {
        books: [],
      },
    });

    response.code(200);
    return response;
  }

  let filterBook = books;

  // filter books by name if
  // name is defined in the query
  if (typeof name !== 'undefined') {
    filterBook = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  // filter books by reading status
  // if reading is defined in the query
  if (typeof reading !== 'undefined') {
    filterBook = books.filter((book) => Number(book.reading) === Number(reading));
  }

  // filter books by finished status
  // if finished is defined in the query
  if (typeof finished !== 'undefined') {
    filterBook = books.filter((book) => Number(book.finished) === Number(finished));
  }

  // create an array of objects with
  // id, name, and publisher properties
  const listBook = filterBook.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  // return the filtered list of books
  const response = h.response({
    status: 'success',
    data: {
      books: listBook,
    },
  });

  response.code(200);
  return response;
};

/**
 * Handler to get book by id
 * @param {*} request
 * @param {*} h
 * @returns {Object} response
 */
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Search for the book in the books array by its id
  const book = books.filter((n) => n.id === bookId)[0];

  // If the book is found, return
  // a success response with
  // the book information
  if (typeof book !== 'undefined') {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });

    response.code(200);
    return response;
  }

  // If the book is not found,
  // return a fail response
  // with an error message
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

/**
 * Handler to edit book by id
 * @param {*} request
 * @param {*} h
 * @returns {Object} response
 */
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // get book data from request payload
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  // get current timestamp
  const updatedAt = new Date().toISOString();
  // find index of the book with the given ID
  const index = books.findIndex((book) => book.id === bookId);

  // check if name is undefined
  if (typeof name === 'undefined') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  // check if readPage is greater than pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  // update book data if index is found
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  // return error message if index is not found
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

/**
 * Handler to delete book by id
 * @param {*} request
 * @param {*} h
 * @returns {Object} response
 */
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // find the index of the book to be deleted
  const index = books.findIndex((book) => book.id === bookId);

  // if the book is found
  if (index !== -1) {
    // remove the book from the books array
    books.splice(index, 1);
    // create a success response
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  // if the book is not found,
  // create a fail response
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
