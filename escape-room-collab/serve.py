from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler


if __name__ == "__main__":
    server = ThreadingHTTPServer(("localhost", 8000), SimpleHTTPRequestHandler)
    print("Open http://localhost:8000")
    server.serve_forever()
