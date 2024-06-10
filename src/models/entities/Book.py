class Book():

    def __init__(self, idlibro,nombre=None,isbn=None,cantidad=None,prestado=None) -> None:
        self.idlibro = idlibro
        self.nombre = nombre
        self.isbn = isbn
        self.cantidad = cantidad
        self.prestado = prestado

    def toJson(self): 
        return  {
            'idlibro': self.idlibro,
            'nombre': self.nombre,
            'isbn': self.isbn,
            'cantidad': self.cantidad,
            'prestado': self.prestado
        }