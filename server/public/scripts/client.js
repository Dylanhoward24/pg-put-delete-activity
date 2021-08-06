$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  // TODO - Add code for edit & delete buttons
  $(document).on('click', '.deleteBtn', handleDelete);
  $(document).on('click', '.updateBtn', handleUpdate);
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

function handleDelete() {
  console.log('in handleDelete');

  let tr = $(this).parents('tr');
  console.log(tr);
  let id = tr.data('id');
  console.log('id', id);

  $.ajax({
      method: 'DELETE',
      url: `/books/${id}`
  }).then((res) => {
    console.log('DELETE /books', res);
    
    // refresh the data
    refreshBooks();
  }).catch((err) => {
    console.log('DELETE /books error', err);
    alert('DELETE /books failed!');
  });
}

function handleUpdate() {
    console.log('in handleUpdate');
    // tr is table row, this will be the table
    // row attached to the id of the delete button
    let tr = $(this).parents('tr');
    console.log('tr', tr);
    // id is now being taken from the data of tr
    // which we established above
    let id = tr.data('id');
    console.log('id', id);
    // now we take the same as above, but do it
    // for the isRead value
    let isRead = tr.data('isRead');
    console.log('isRead value is', isRead);

    $.ajax({
      method: 'PUT',
      url: `/books/${id}`,
      data: {
        isRead: true
      }
    }).then((res) => {
      console.log('PUT /books', res);

      // refresh the data
      refreshBooks();
    }).catch((er) => {
      console.log('PUT /books error', err);
      alert('PUT /books failed!');
    });
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr data-id="${book.id}" data-isRead="${book.isRead}">
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isRead}</td>
        <td>
            <button class="updateBtn">Finished</button>
        </td>
        <td>
            <button class="deleteBtn">Delete</button>
        </td>
      </tr>
    `);
  }
}
