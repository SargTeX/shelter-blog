# shelter-blog
Node.JS blogging software for the Shelter Project. Focus is on multi-language-content.

Features
========

 * Multiple Languages for everywhere

API Documentation
=================

General Use
-----------

All requests are done in HTTP. All responds are in JSON. GET-Parameters are added to the url, POST-Parameters are send within the body.

Every request is responded either successfully or with an error. Error responds look like this:
```
{status: 'error', errors: ['Some error message', 'Here might be another error message', 'only.some.language.var.code']}
```

Successfull responds look like this:
```
{
	status: 'success',
	data: {
		// some data, like language list, ....
		// this is totally optional and is documented individually
		// per controller, look below
	}
}
```

Post
----

# POST /PostAdd
Creates a new post, translated to a specific language.

## Parameters
	* title (`String`) the title of the post
	* content (`String`) the content of the post, e.g. in german or english
	* languageCode (`String`) the code of the language of the written content and title, e.g. "de" or "en"; must be present in Language-List

## Response (success)
```
{status: 'success'}
```