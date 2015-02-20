# shelter-blog
Node.JS blogging software for the Shelter Project. Focus is on multi-language-content.

Currently, this is completely **WORK IN PROGRESS**.

Features
========

 * Multiple Languages for everywhere

API Documentation
=================

General Use
-----------

All requests are done in HTTP. All responds are in JSON. GET-Parameters are added to the url, POST-Parameters are send within the body.

Every request is responded either successfully or with an error. Error responds look like this:
```javascript
{
	status: 'error',
	errors: [
		'Some error message',
		'Here might be another error message',
		'only.some.language.var.code'
	]
}
```

Successfull responds look like this:
```javascript
{
	status: 'success',
	data: {
		// some data, like language list, ....
		// this is totally optional and is documented individually
		// per controller, look below
	}
}
```

#### Authentication
After a successfull registration or login attempt, you receive a sessionId from the server. This sessionId can be used to authenticate by appending it to each request: on GET-requests, simply append it to the url; on POST-requests, simply append it to the body.

Example requests:
```
POST /PostAdd
title=Hello&content=IWillSayHelloWithThis&languageCode=en&sessionId=your-session-id

GET /LanguageList?sessionId=your-session-id
```


Language
--------
#### GET /LanguageList
Retrieves a complete list of all languages.

##### Response (success)
```javascript
{
	status: 'success',
	data: {
		languages: [
			{name: 'language.de', code: 'de'},
			{name: 'language.en', code: 'en'},
			//...
		]
	}
}
```



Post
----

#### POST /PostAdd
Creates a new post, translated to a specific language.

##### Parameters
 * title (`String`) the title of the post
 * content (`String`) the content of the post, e.g. in german or english
 * languageId (`ObjectId`) the id of the language (id-of-some-language) in that the title and content are written

##### Response (success)
```javascript
{status: 'success'}
```

##### Errors
 * error.permission.post.canAdd - permission "post.canAdd" is required in order to create a post



#### GET /PostList
Lists all posts currently existing, newest first.

##### Parameters
 * offset (`Number`, optional) "0" to start on the first (newest) message, "9" to start on the tenth aso
 * amount (`Number`, default 20) maximum amount of posts that should be responded
 * parent (`ObjectId`, optional) if given, will only return comments that reply to this post

##### Response (success)
```javascript
{
	status: 'success',
	data: {
		posts: [
			{
				_id: 'some-id-for-this-post',
				title: 'language.variable.for.the.title',
				content: 'language.variable.for.this.content',
				author: 'some-id-of-the-author-of-this-post',
				time: 4189374982374, // timestamp, as milliseconds since 1980 - see UNIX timestamp
				parent: 'some-id-of-the-parent-post', // if this is a comment
				language: 'some-language-id' // if this is a comment and therefore not multilingual
			}
		]
	}
}
```


#### POST /PostTranslate
Translate an existing post.

##### Parameters
 * languageId (`ObjectId`) the id of the language (id-of-some-language) you want to translate this post into
 * postId (`ObjectId`) the id of the post
 * title (`String`) the translation for the title
 * content (`String`) the translation for the content

##### Response (success)
```javascript
{status: 'success'}
```

##### Errors
 * error.permission.post.canTranslate - permission "post.canTranslate" is required and the logged-in user (if any) doesn't have it

User
----

#### POST /UserAdd
Creates a new user account and a session running on that account.

##### Parameters
 * username (`String`) the username the user wants to pick and that has to be unique
 * password (`String`) the chosen password
 * email (`String`) optionally the email adress of the user

##### Response (success)
```javascript
{
	status: 'success',
	data: {
		sessionId: 'some-session-id'
	}
}
```

##### Errors
 * error.user.username.exists - the username is already taken



#### POST /UserLogin
Tries to login the user into that user account and to create a session.

##### Parameters
 * username (`String`) the username
 * password (`String`) the password of the user

##### Response (success)
```javascript
{
	status: 'success',
	data: {
		sessionId: 'some-session-id'
	}
}
```

##### Errors
 * error.userLogin.fail - the attempt to login fail (either user not found, or password incorrect)