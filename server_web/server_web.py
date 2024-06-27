import socket
import os
import gzip  # Import the gzip module
from threading import Thread  # Import the Thread class from the threading module

# Function to handle client requests
def handle_client(clientsocket):
    print('#######################')
    print('S-a conectat un client.')

    cerere = ''
    linieDeStart = ''
    while True:
        buf = clientsocket.recv(1024)
        if len(buf) < 1:
            break
        cerere = cerere + buf.decode()
        print('S-a citit mesajul:\n' + cerere)
        pozitie = cerere.find('\r\n')
        if pozitie > -1 and linieDeStart == '':
            linieDeStart = cerere[0:pozitie]
            print('S-a citit linia de start din cerere: ##### ' + linieDeStart + ' #####')
            break

    print('S-a terminat cititrea.')
    if linieDeStart == '':
        clientsocket.close()
        print('S-a terminat comunicarea cu clientul - nu s-a primit niciun mesaj.')
        return

    elementeLineDeStart = linieDeStart.split()
    numeResursaCeruta = elementeLineDeStart[1]
    if numeResursaCeruta == '/':
        numeResursaCeruta = '/index.html'

    numeFisier = '../continut' + numeResursaCeruta

    fisier = None
    try:
        fisier = open(numeFisier, 'rb')
        numeExtensie = numeFisier[numeFisier.rfind('.')+1:]
        tipuriMedia = {
            'html': 'text/html',
            'css': 'text/css',
            'js': 'application/js',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'ico': 'image/x-icon',
            'xml': 'application/xml',
            'json': 'application/json'
        }
        tipMedia = tipuriMedia.get(numeExtensie, 'text/plain')

        clientsocket.sendall(b'HTTP/1.1 200 OK\r\n')
        clientsocket.sendall(b'Content-Type: ' + bytes(tipMedia, 'utf-8') + b'\r\n')
        clientsocket.sendall(b'Server: My PW Server\r\n')

        # citire fisier si trimitere catre client
        content = fisier.read()
        fisier.close()

        # compresare continut si trimitere catre client
        compressed_content = gzip.compress(content)
        clientsocket.sendall(b'Content-Encoding: gzip\r\n')
        clientsocket.sendall(b'Content-Length: ' + bytes(str(len(compressed_content)), 'utf-8') + b'\r\n')
        clientsocket.sendall(b'\r\n')
        clientsocket.sendall(compressed_content)
    except IOError:
        msg = 'Eroare! Resursa ceruta ' + numeResursaCeruta + ' nu a putut fi gasita!'
        print(msg)
        clientsocket.sendall(b'HTTP/1.1 404 Not Found\r\n')
        clientsocket.sendall(b'Content-Type: text/plain\r\n')
        clientsocket.sendall(b'Server: My PW Server\r\n')
        clientsocket.sendall(b'\r\n')
        clientsocket.sendall(bytes(msg, 'utf-8'))

    clientsocket.close()
    print('S-a terminat comunicarea cu clientul.')


serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
serversocket.bind(('', 5678))
serversocket.listen(5)

while True:
    print('#####################################')
    print('Serverul asculta potentiali clienti.')

    clientsocket, address = serversocket.accept()

    # pornire thread pentru a gestiona cererea clientului
    thread = Thread(target=handle_client, args=(clientsocket,))
    thread.start()
