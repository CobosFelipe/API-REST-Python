from database.db import getConnection
from .entities.Book import Book

class BookModel():

    @classmethod
    def getBooks(self):
        try:
            connection = getConnection()
            books = []

            with connection.cursor() as cursor:
                cursor.execute("SELECT idlibro, nombre, isbn, cantidad, prestado FROM libros ORDER BY idlibro ASC")
                resultSet=cursor.fetchall()

                for row in resultSet:
                    book=Book(row[0],row[1],row[2],row[3],row[4])
                    books.append(book.toJson())

            connection.close()
            return books
        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def getBook(self,idlibro):
        try:
            connection = getConnection()

            with connection.cursor() as cursor:
                cursor.execute("SELECT idlibro, nombre, isbn, cantidad, prestado FROM libros WHERE idlibro= %s", (idlibro,))
                row=cursor.fetchone()

                book = None
                if row != None:
                    book=Book(row[0],row[1],row[2],row[3],row[4])
                    book = book.toJson()
                    return book
                
                connection.close()
            
        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def addBook(self,book):
        try:
            connection = getConnection()
            
            with connection.cursor() as cursor:
                
                cursor.execute("""INSERT INTO libros (nombre, isbn, cantidad, prestado)
                               VALUES (%s,%s,%s,%s)""",(book.nombre, book.isbn, book.cantidad, book.prestado))
                
                affectedRows = cursor.rowcount
                connection.commit()

            connection.close()
            return affectedRows
        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def updateBook(self,book):
        try:
            connection = getConnection()
            
            with connection.cursor() as cursor:
                
                cursor.execute("""UPDATE libros SET nombre = %s, isbn = %s, cantidad = %s, prestado = %s
                               WHERE idlibro = %s""", (book.nombre, book.isbn, book.cantidad, book.prestado, book.idlibro))
                
                affectedRows = cursor.rowcount
                connection.commit()

            connection.close()
            return affectedRows
        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def deleteBook(self,book):
        try:
            connection = getConnection()
            
            with connection.cursor() as cursor:

                cursor.execute("DELETE FROM libros WHERE idlibro = %s", (book.idlibro,))
                
                affectedRows = cursor.rowcount
                connection.commit()

            connection.close()
            return affectedRows
        except Exception as ex:
            raise Exception(ex)