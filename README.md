
<!--#echo json="package.json" key="name" underline="=" -->
easydav-jqput-pmb
=================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Simple web form that uses jQuery to PUT file uploads onto my WebDAV server.
<!--/#echo -->


Usage
-----

1. Make a URL space that allows PUT, e.g. a [WebDAV][apache-mod-dav] folder.
   * You should restrict access to that. ([Why?][owasp-pub-upload])
1. Set up a page like `example.html` somewhere (else) on your webserver.
1. Fix the paths in it:
   * URL to this module's CSS
   * URL to this module's JS
   * URL to jQuery (version 3.x recommended)
1. Adjust the style sheet if you like,
   then remove the dummy entries from the uploads list.
1. Configure the other settings to your needs or remove those you don't want.
   Config is explained in HTML comments in the example form.





<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;

  [apache-mod-dav]: https://httpd.apache.org/docs/current/mod/mod_dav.html
  [owasp-pub-upload]: https://www.owasp.org/index.php/Unrestricted_File_Upload

License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
