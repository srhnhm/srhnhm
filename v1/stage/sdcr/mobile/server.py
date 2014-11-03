import CGIHTTPServer
import BaseHTTPServer

class Handler(CGIHTTPServer.CGIHTTPRequestHandler):
    cgi_directories = ["/server"]

PORT = 8887

httpd = BaseHTTPServer.HTTPServer(("", PORT), Handler)
print "Serving at port", PORT
httpd.serve_forever()
