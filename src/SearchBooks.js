import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import escapeRegEx from 'escape-string-regexp'
import sortBy from 'sort-by'
import * as BooksAPI from "./BooksAPI"

class SearchBooks extends Component {
    state = {
        query: '',
        searchBooks: []
    }
    updateQuery = (q) => {
        this.setState({
            query: q
        })
        BooksAPI.search(q, 20).then(searchBooks => {

            this.props.books.forEach(updateBookState)

            function updateBookState(book) {
                if (searchBooks !== undefined || searchBooks !== null) {
                    searchBooks.forEach(b => {
                        (b.id === book.id) ? (b.shelf = book.shelf) : (b)
                        {(b.shelf === undefined) && (b.shelf = 'none')}
                    })
                }
            }

            this.setState({ searchBooks: searchBooks })
        })
    }
    render() {
        const { query, searchBooks } = this.state
        const { onUpdateShelf } = this.props
        let showingBooks

        if (query) {
            const match = new RegExp(escapeRegEx(query), "i")
            showingBooks = searchBooks.filter((book) => match.test(book.title || book.authors))
        } else {
            showingBooks = searchBooks
        }

        showingBooks.sort(sortBy('title', 'authors'))

        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link
                        className="close-search"
                        to="/"
                    >Close
                    </Link>
                    <div className="search-books-input-wrapper">
                        <input
                            type="text"
                            placeholder="Search by title or author"
                            value={query}
                            onChange={(event) => this.updateQuery(event.target.value)}
                        />
                    </div>
                </div>
                {query && (
                    <div className="search-books-results">
                        <ol className="books-grid">
                            {showingBooks.map((book) =>
                                <li key={book.id}>
                                    <div className="book">
                                        <div className="book-top">
                                            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                                            <div className="book-shelf-changer">
                                                <select defaultValue={book.shelf} onChange={(event) => onUpdateShelf(book, event.target.value)}>
                                                    <option value="none" disabled>Move to...</option>
                                                    <option value="currentlyReading">Currently Reading</option>
                                                    <option value="wantToRead">Want to Read</option>
                                                    <option value="read">Read</option>
                                                    <option value="none">None</option>
                                                </select>
                                            </div>
                                            />
                                        </div>
                                        <div className="book-title">{book.title}</div>
                                        <div className="book-authors">{book.authors}</div>
                                    </div>
                                </li>
                            )}
                        </ol>
                    </div>
                )}
            </div>
        )
    }
}

export default SearchBooks