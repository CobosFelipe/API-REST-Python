from flask import Blueprint, jsonify, request

# Entities
from models.entities.Book import Book

# Models
from models.BookModel import BookModel

main = Blueprint('bookBlueprint', __name__)

@main.route('/')
def getBooks():
    try:
        books = BookModel.getBooks()
        return jsonify(books)
    except Exception as ex:
        return jsonify({'message': str(ex)}),500
    
@main.route('/<idlibro>')
def getBook(idlibro):
    try:
        book = BookModel.getBook(idlibro)
        if book != None:
            return jsonify(book)
        else: 
            return jsonify({}), 404
    except Exception as ex:
        return jsonify({'message': str(ex)}),500

@main.route('/add', methods=['POST'])
def addBook():
    try:
        idlibro = ''
        nombre = request.json['nombre']
        isbn = request.json['isbn']
        cantidad = request.json['cantidad']
        prestado = request.json['prestado']

        book = Book(idlibro, nombre, isbn, cantidad, prestado)

        affectedRows = BookModel.addBook(book)

        if affectedRows == 1:
            return jsonify(book.nombre)
        else:
            return jsonify({'message': "Error al insertar datos"}), 500

    except Exception as ex:
        return jsonify({'message': str(ex)}), 500
    
@main.route('/update/<idlibro>', methods=['PUT'])
def updateBook(idlibro):
    try:
        nombre = request.json['nombre']
        isbn = request.json['isbn']
        cantidad = request.json['cantidad']
        prestado = request.json['prestado']

        book = Book(idlibro, nombre, isbn, cantidad, prestado)

        affectedRows = BookModel.updateBook(book)

        if affectedRows == 1:
            return jsonify({'message': "Pelicula actualizada"}), 200
        else:
            return jsonify({'message': "Ninguna pelicula actualizada"}), 500

    except Exception as ex:
        return jsonify({'message': str(ex)}), 500
    
@main.route('/delete/<idlibro>', methods=['DELETE'])
def deleteBook(idlibro):
    try:
        book = Book(idlibro)

        affectedRows = BookModel.deleteBook(book)

        if affectedRows == 1:
            return jsonify(book.idlibro)
        else:
            return jsonify({'message': "Ninguna pelicula eliminada"}), 404

    except Exception as ex:
        return jsonify({'message': str(ex)}), 500
    


