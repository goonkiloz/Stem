# `Stem`

Stem is a video sharing platform, modeled after the popular platform Vine. This API has close to the same functionality as most video sharing platforms, such as posting, commenting, liking, disliking, and following. The app was developed with Express and postgres in the backend and react.js as the frontend

## MVP- Feature & Implementation

**Sign-up and Sign-in**
* The server allows the new user to sign up an account using the sign-up link in the Navigation bar when current session of the user is = 'null'. A popup modal is then shown when sign-up link is clicked. All info on the forms are required to be properly filled out in order to create a user, else the server will return errors from the Express backend. The sign-up button is also grey out unless all info are filled out.

**Full CURD of Posts**
* Users should be able to view all posts regardless of the sign-in status.
* Users should be able to upload posts only when signed in.
* Users should be able to update their uploaded posts only when signed in.
* Users should be able to delete their uploaded posts only when signed in.

**Full CURD of Comment**
* Users should be able to view all comments on a post regardless of sign-in status.
* Users should be able to add a comment to a post only when signed in.
* Users should be able to update their comment on a post only when signed in.
* Users should be able to remove their comments from a post when signed in.

**Likes/Dislikes**
* Users should be able to view the likes on a post regarless of signed-in status.
* Users should be able to like a post only when signed in.
* Users should be able to unlike a post only when signed in.

**Followers**
* Users should be able to view all of their followers only when signed in.
* Users should be able to view all of the users they follow only when signed in.
* Users should be able to follow another user only when signed in.

**Progress bar - to be implemented later**
* Users should be able to see the progress bar for a post while the post details or video are loading.


**Categories- to be implemented later**
* Users should be able to see posts by tags or by selected categories.


## Database Schema Design

![db-schema]

[db-schema]: stemdb.png
```

Table Users {
  id integer [primary key]
  FirstName varchar(30)
  LastName varchar(30)
  Email varchar(256)
  UserName varchar(30)
  UserImg filepath
  created_at timestamp
  updated_at timestamp
}

Table Posts {
  id integer [primary key]
  userId integer //[Foreign Key referencing Users.id]
  title varchar(30)
  videoPath filepath
  thumbnail filepath
  description varchar(1000)
  created_at timestamp
  updated_at timestamp
}

Table Comments {
  id integer [primary key]
  userId integer //[Foreign Key referencing Users.id]
  postId integer //[Foreign Key referencing Posts.id]
  comment varchar(100)
  created_at timestamp
  updated_at timestamp
}

Table Likes {
  id integer [primary key]
  userId integer //[Foreign Key referencing Users.id]
  postId integer //[Foreign Key referencing Posts.id]
  created_at timestamp
  updated_at timestamp
}

Table Dislikes {
  id integer [primary key]
  userId integer //[Foreign Key referencing Users.id]
  postId integer //[Foreign Key referencing Posts.id]
  created_at timestamp
  updated_at timestamp
}

Table Views {
  id integer [primary key]
  userId integer //[Foreign Key referencing Users.id]
  postId integer //[Foreign Key referencing Posts.id]
  created_at timestamp
  updated_at timestamp
}

Table Followers {
  id integer [primary key]
  userId integer //[Foreign Key referencing Users.id]
  followerId integer //[Foreign Key referencing Users.id]
  created_at timestamp
  updated_at timestamp
}


Table Following {
  id integer [primary key]
  userId integer //[Foreign Key referencing Users.id]
  followingId integer //[Foreign Key referencing Users.id]
  created_at timestamp
  updated_at timestamp
}

```

