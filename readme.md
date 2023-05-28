# Authentication using Access and Refresh Token

This is an authentication module for a Backend Web Application. The idea is to have a stand alone application responsible for authentication of a user request of any given backend application via JWTs

The life of JWT tokens is

Access Token - 15 min
Refresh Token - 24 hr

# Setup

1. Download the following project and open in any editor

2. Now create a .env file in the home directory with following variables

```
   MONGO_URI = mongodb+srv://<username>:<password>@cluster0.gspz3ko.mongodb.net/<DATABASE>?retryWrites=true&w=majority

   JWT_SECRET = <secret>

   PORT = <port>
```

3. Replace the value of <username>, <password> <DATABASE> with your username, passwords and database name and also replace <secret> with the secret you want to keep and <port> with the port number by default it is 5000

4. Now run the following code to run the program using terminal
   npm install && npm start

5. You can access the project API's using postman

# API Routes

Run the app in localhost and you can access the following API's :-

1. GET http://localhost:5000/test :- This can be use as the test route to test It returns "working" as response

2. POST http://localhost:5000/api/v1/register :- Send this request with following sample body to register the user

```
    {
        "name":"Abc",
        "email":"abc@gmail.com",
        "password":"secret"
    }
```

It returns the status code 201(CREATED) if the user is created successfully

3. POST http://localhost:5000/api/v1/login :- Send this request with following sample body to login the user

```
    {
        "email":"abc@gmail.com",
        "password":"secret"
    }
```

It lets the user logged in and sends 2 cookies in response that is Access Token and Refresh Token. Also it returns a JSON with user data and status code 200(OK) if the user is logged in successfully

4. GET http://localhost:5000/api/v1/getUser :- Send this request after logging in to get the details of the given user.

5. DELETE http://localhost:5000/api/v1/logout :- Send this request after logging in to logout the user this will unset the cookies and will logout the user
