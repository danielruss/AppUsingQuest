# Example embedding Quest into a Web application

Quest was designed to work within a web application. In particular, it is a a client-side javascript library with flexiblity to interact server-side resources that you provide.

Since this is a toy example, we don't have any backend resources. The method `storeResponse` in bigstudy.js receives a response object from Quest and can handle it as needed. I put each property in the FakeDB object, in a real study you should safely store the data in a database (GCP Cloud Firestore is a good example, but whatever you like). The object is passed into quest via an object passed to the render method.
