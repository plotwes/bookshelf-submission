const { nanoid } = require('nanoid');
const books = require('./books');
 
const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
   
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = (pageCount === readPage);
   
    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
          });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
          });
        response.code(400);
        return response;
    }

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;
   
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
    response.code(201);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
  
    if (books.length === 0) {
      const emptyResponse = {
        status: 'success',
        data: {
          books: [],
        },
      };
      return h.response(emptyResponse).code(200);
    }

    let filteredBooks = books;

    if (typeof name !== 'undefined') {
      filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (typeof reading !== 'undefined') {
      filteredBooks = filteredBooks.filter((book) => Number(book.reading) === Number(reading));
    }

    if (typeof finished !== 'undefined') {
      filteredBooks = filteredBooks.filter((book) => Number(book.finished) === Number(finished));
    }

    const formattedBooks = filteredBooks.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    const successResponse = {
      status: 'success',
      data: {
        books: formattedBooks,
      },
    };
  
    return h.response(successResponse).code(200);
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
   
    const book = books.filter((book) => book.id === bookId)[0];
   
   if (book !== undefined) {
    const response = h.response({
        status: 'success',
        data: {
            book,
        },
    });
    response.code(200);
    return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
   
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
          });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
          });
        response.code(400);
        return response;
    }
    
    const index = books.findIndex((book) => book.id === bookId);
   
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
        updatedAt
      };
   
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }
   
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
   
    const index = books.findIndex((book) => book.id === bookId);
   
    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }
   
   const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler, };