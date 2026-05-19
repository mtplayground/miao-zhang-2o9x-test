from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os


class QuietStaticHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        return


def main():
    port = int(os.environ.get("PORT", "8080"))
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print("static-server-ready port=%s quiet_access_logs=true marker=%s" % (port, "ok" * 450), flush=True)
    ThreadingHTTPServer(("0.0.0.0", port), QuietStaticHandler).serve_forever()


if __name__ == "__main__":
    main()
