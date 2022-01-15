# ThunderDB
**StormDB** creator [Tom](https://github.com/TomPrograms) and [GitHub](https://github.com/TomPrograms/stormdb)

This is a modified version of **StormDB**.
I needed something similar to it, but not quite the same, so here is Thunder.

**Not everything is tested - either help out or wait for me to discover bugs.**

**Table of Content**
-
- [ThunderDB](#thunderdb)
  * [Instalation](#instalation)
  * [Usage](#usage)
  * [Database Operations](#databaseoperations)
    + [Core operations](#coreoperations)
      - [.default(defaultValue)](#defaultdefaultvalue)
      - [.value()](#value)
      - [.get(value)](#getvalue)
      - [.set(key, value)](#setkeyvalue)
      - [.rename(newName)](#renamenewname)
      - [.delete()](#delete)
      - [.read()](#read)
      - [.save()](#save)
    + [String operations](#string-operations)
      - [.toLowerCase()](#tolowercase)
      - [.toUpperCase()](#touppercase)
      - [.toString(method, save)](#tostringmethodsave)
      - [.trim()](#trim)
      - [.replace(oldStr, newStr)](#replaceoldstrnewstr)
      - [.reverse(save)](#reversesave)
    + [Number Operations](#numberoperations)
      - [.inc()](#inc)
      - [.dec()](#dec)
      - [.add(number)](#addnumber)
      - [.sub(number)](#subnumber)
      - [.addRandom(max, min)](#addrandommaxmin)
      - [.subRandom(max, min)](#subrandommaxmin)
    + [Array Operations](#arrayoperations)
      - [.push(...value)](#pushvalue)
      - [.pushSet(...value)](#pushsetvalue)
      - [.pull({getList, save})](#pullgetlistsave)
      - [.shift({getList, save})](#shiftgetlistsave)
      - [.unshift(...value)](#unshiftvalue)
      - [.every(func)](#everyfunc)
      - [.some(func)](#somefunc)
      - [.has(value)](#hasvalue)
      - [.map(func, save)](#mapfuncsave)
      - [.sort(func, save)](#sortfuncsave)
      - [.filter(func, save)](#filterfuncsave)
      - [.reduce(func, save)](#reducefuncsave)
      - [.length()](#length)
    + [Object Operations](#objectoperations)
      - [.concat(newValue)](#concatnewvalue)
  * [Async Saving](#asyncsaving)
  * [What and Why](#whatandwhy)
      - [Changes](#changes)
      - [Disguarded ideas](#disguardedideas)
      - [Why?](#why)
- [Links, Credit and License](#linkscreditandlicense)

## Installation
**I'm not posting this to npm, so just copy and paste the files here into your *node_modules*  folder.**

You can also just install StormDB: `npm i stormdb`
Then go into your *node_modules* folder, find *stormdb* and replace the files with the ones here.

## Usage
Similar to **StormDB**, Thunder just adds on top of Storm.

```js
const StormDB = require("stormdb");

//starting the db
const engine = new StormDB.Engine("./data.json");
const db = new StormDB(engine)

//set default db value if db is empty
db.default({ users: [] });

//add new users entry
db.get("users").push({ name: "tom" });

//update username of first user
db.get("users")
  .get(0)
  .get("name")
  .set("jeff");

//add a secret message and reverse it
db.get("users").push("      Secret message! ").trim()
db.get("users").get(1).reverse()

//see how many entries
console.log(db.get("users").length()) //prints out "2"

//save changes to db
db.save();
```

The `data.json` database file is updated to:

```js
{
  "users": [
    {"name":"jeff"},
	"!egassem terceS"
  ]
}
```

## Database Operations
I have divided these operations into **5 groups** for easier management.

### Core operations
---
#### .default(defaultValue)
If there is nothing in the database this will put something in it.

| Parameter  | Type | Optional | Default |
| :-----------: | :----: | :--------: | :-------: |
| defaultValue | Any | I guess? | none |

**Examples:**  
*File is empty, default value was put:*
```js
//before: empty file
DB.default({ users: [] });
//after: { "users": [] }
```
*File was not empty, default value ignored:*
```js
//before: {books : {"Harry Potter" : "very big book"}}
DB.default({ users: [] });
//after: {books : {"Harry Potter" : "very big book"}}
```

---
#### .value()
Return the raw value of a selected property.

**Example:**  
*Getting a value from "name":*
```js
//in db: {"name": "Gam", "age": 19, "hobby": "Video games"}
DB.get("name").value()
//returns "Gam"
```

---
#### .get(value)
This is how you navigate the database aka select property.
You will use this a lot.

| Parameter  | Type | Optional |
| :-----------: | :----: | :--------: |
| value | string | No |

**Examples:**  
*Setting a new value to "name":*
```js
//before: {"name" : "Tom"}
DB.get("name").set("Gam")
//after: {"name": "Gam"}
```
*Getting the value from "name":*
```js
//in db: {"name": "Gam", "age": 19, "hobby": "Video games"}
DB.get("name").value()
//returns "Gam"
```
*Get the second element of an array:*
```js
//before: {"cake": ["Milk Bucket", "Sugar", "Egg", "Wheat"]}
DB.get("name").get(2).value()
//returns "Egg"
```
*Short syntax:*
```js
//before: {"name": "Gam", "details": {"age": 19, "hobby": "Video games"}}
DB.get("details.age").value()
//returns "19"
```

---
#### .set(key, value)
Set a key-value pair on a selected property or change an existing property.

| Parameter  | Type | Optional | Default |
| :-----------: | :----: | :--------: | :-------: |
| key | string | yes | .get() |
| value | string | No | none |

**Examples:**  
*Updating a value:*
```js
//before: {"name" : "Tom"}
DB.get("name").set("Gam")
//after: {"name": "Gam"}
```
*Setting a key-value pair:*
```js
//before: {}
DB.set("key", "value")
//after: {"key": "value"}
```
*Short syntax:*
```js
//before: {"name": "Gam", "details": {"age": 19, "hobby": "Video games"}}
DB.set("details.age", 42)
//after: {"name": "Gam", "details": {"age": 42, "hobby": "Video games"}}
```

---
#### .rename(newName)
Allows you to change the name of a property.

| Parameter  | Type | Optional |
| :-----------: | :----: | :--------: |
| newName | string | No |

**After you change the name of a property the path might become invalid depending on your code.**  
*If **oldName** is the same as **newName**, it will just be ignored.* :)

**Examples:**  
*If this runs more than once it will throw an error, since `.get("a")` becomes invalid the second time.*
```js
//before: {"name" : "Gam"}
DB.get("name").rename("firstName")
//after: {"firstName" : "Gam"}
```

*Best for changing variables, below user makes a new account and transfers their items:*
```js
let oldUserID = "TOM#1234"
let newUserID = "GAM#6498"

//before: {"TOM#1234": ["Hero sword", "Magic chestplate", "Healing potion"]}
DB.get(oldUserID).rename(newUserID)
//after: {"GAM#6498": ["Hero sword", "Magic chestplate", "Healing potion"]}
```

---
#### .delete()
Deletes key-value pair or item in array.

**Examples:**  
*Delete pair:*
```js
// before:  {"name": "Gam", "age": 19, "hobby": "Video games"}
DB.get("age").delete();
// after:  {"name": "Gam", "hobby": "Video games"}
```
*Delete item in array:*
```js
//before: {"cake": ["Milk Bucket", "Sugar", "Egg", "Wheat"]}
DB.get("cake").get(0).delete()
//after: {"cake": ["Sugar", "Egg", "Wheat"]}
```

---
#### .read()
Read/refresh the data from the database.  
StormDB works with a copy of the orignial data - if changes happen to the original db, Storm woudn't know - use this to ensure your data is fresh.  

*In some cases you have multiple users changing something. Run this before making changes, so you don't get data conflicts.*

**Example:**
```js
DB.read()
//db operates with fresh data
```

---
#### .save()
Save changes to the database.  
StormDB works with a copy of the orignial data, so changes have to be manually saved to the actual database file.

**Examples:**
```js
//db operations
DB.save()
```
*Save right after operations:*
```js
//before: {"name" : "Tom"}
DB.get("name").set("Gam").save()
//after: {"name": "Gam"}
```

---

### String operations
---
#### .toLowerCase()
Makes output lowercased.

**Example:**
```js
//in db: {"message": "tHiS iS sO cRaZy!!"}
DB.get("message").toLowerCase().value()
//returns "this is so crazy!!"
```

---
#### .toUpperCase()
Makes output uppercased.

**Example:**
```js
//in db: {"message": "tHiS iS sO cRaZy!!"}
DB.get("message").toLowerCase().value()
//returns "THIS IS SO CRAZY!!"
```

---
#### .toString(method, save)
Converts target property to string.

| Parameter  | Type | Optional | Strict Options | Default |
| :-----------: | :----: | :--------: | :--------------: | :-------: |
| method | string | yes | "json", "join", any | any |
| save | boolean | yes | boolean | false |

- The method parameter is used for choosing a way of conversion to string of arrays. There are 2 preset ways: `json` and `join` or any other string you like. The array will be joined using that string.

- The save parameter determines if the result will be pushed to the database or returned. By default save is false (returns value, dosen't save).

**Examples:**
*Number to string:*
```js
//before: {"age": 19}
let result = DB.get("age").toString()
//after: {"age": 19} <- still number
//result = "19"
```
*Pushing result to database:*
```js
//before: {"age": 19}
DB.get("age").toString(true)
//after: {"age": "19"}
```
*Array to string:*
```js
//in DB: {"cake": ["Milk Bucket", "Sugar", "Egg", "Wheat"]}

//empty method
DB.get("cake").toString() //returns "Milk Bucket,Sugar,Egg,Wheat"

//custom method
DB.get("cake").toString(" <next> ") //returns "Milk Bucket <next> Sugar <next> Egg <next> Wheat"
DB.get("cake").toString(" \n ") //returns "Milk Bucket \n Sugar \n Egg \n Wheat"

//join and json as methods
DB.get("cake").toString("join") //returns "Milk BucketSugarEggWheat"
DB.get("cake").toString("json") //returns ["Milk Bucket", "Sugar", "Egg", "Wheat"]
```
*Object to string:*
```js
//in DB: {user: {"name" : "Gam"}}
DB.get("user").toString() //returns "{name : 'Gam'}"
```

---
#### .trim()
Removes whitespace from both ends of a string.

**Example:**
```js
//in db: {"bio": "       I am the best!       "}
DB.get("message").trim().value()
//returns "I am the best!"
```

---
#### .replace(oldStr, newStr)
Results in a string with some or all matches of a pattern replaced.

| Parameter  | Type | Optional |
| :-----------: | :----: | :--------: |
| oldStr | string or regex | No |
| newStr | string | No |


**Example:**
```js
//before: {"message" : "Welcome to StormDB!"}
DB.get("messgae").replace("StormDB", "ThunderDB")
//after: {"message" : "Welcome to ThunderDB!"}
```

---
#### .reverse(save)
Reverses array or string.  
Try reversing "racecar".

| Parameter  | Type | Optional | Default |
| :-----------: | :----: | :--------: | :-------: |
| save | boolean | yes | false |

**Example:**
```js
//before: {"message" : "Welcome to ThunderDB!"}
DB.get("messgae").reverse(save)
//after: {"message" : "!BDrednuhT ot emocleW"}
```

---
### Number Operations
---
#### .inc()
Increases the target property by one.

**Example:**
```js
//before: {"name": "Gam", "age": 19, "hobby": "Video games"}
DB.get("age").inc()
//after: {"name": "Gam", "age": 20, "hobby": "Video games"}
```

---
#### .dec()
Decreases the target property by one.  

**Example:**
```js
//before: {"name": "Gam", "age": 19, "hobby": "Video games"}
DB.get("age").dec()
//after: {"name": "Gam", "age": 18, "hobby": "Video games"}
```

---
#### .add(number)
Adds a number to target property.

**Example:**
```js
//before: {"inventory" : {"coins" : 500, "sword" : "Legendary Blade"}}
DB.get("inventory").get("coins").add(155)
//after: {"inventory" : {"coins" : 655, "sword" : "Legendary Blade"}}
```

---
#### .sub(number)
Subtracts a number from target property.

**Example:**
```js
//before: {"inventory" : {"coins" : 500, "sword" : "Legendary Blade"}}
DB.get("inventory").get("coins").sub(155)
//after: {"inventory" : {"coins" : 345, "sword" : "Legendary Blade"}}
```

---
#### .addRandom(max, min)
Adds a random amount in (inclusive) range to target property.

| Parameter  | Type | Optional | Default |
| :-----------: | :----: | :--------: | :-------: |
| max | number | no | none |
| min | number | yes | 0 |

**Returns the random value it added!**

**Example:**
```js
//before: {"inventory" : {"coins" : 500, "sword" : "Legendary Blade"}}
let randomAdded = DB.get("inventory").get("coins").addRandom(100, 200)
//after: {"inventory" : {"coins" : 673, "sword" : "Legendary Blade"}}
//randomAdded = 173
```

---
#### .subRandom(max, min)
Subracts a random amount in (inclusive) range from target property.

| Parameter  | Type | Optional | Default |
| :-----------: | :----: | :--------: | :-------: |
| max | number | no | none |
| min | number | yes | 0 |

**Returns the random value it subtracted!**

**Example:**
```js
//before: {"inventory" : {"coins" : 500, "sword" : "Legendary Blade"}}
let randomSub = DB.get("inventory").get("coins").subRandom(100, 200)
//after: {"inventory" : {"coins" : 379, "sword" : "Legendary Blade"}}
//randomSub = 121
```

---
### Array Operations
---
#### .push(...value)
Adds one or more elements to the end of an array.

| Parameter  | Type | Optional | Multible |
| :-----------: | :----: | :--------: | :-------: |
| ...value | any | No | Yes |

**Examples:**
```js
//before: {"potions": ["healing", "swiftness"]}
DB.get("potions").push("strength")
//after: {"potions": ["healing", "swiftness", "strength"]}

//before: {"lotteryNumbers": [6, 26, 42, 20, 53]}
DB.get("lotteryNumbers").push(31, 7, 12)
//after: {"lotteryNumbers": [6, 26, 42, 20, 53, 31, 7, 12]}

//before: {"users": [{"name" : "Gam", "age" : 19}]}
DB.get("lotteryNumbers").push({"name" : "Jhon", "age" : 68})
//after: {"users": [{"name" : "Gam", "age" : 19}, {"name" : "Jhon", "age" : 68}]}
```

---
#### .pushSet(...value)
Adds one or more elements to the end of an array **if they aren't already in the array**.

| Parameter  | Type | Optional | Multible |
| :-----------: | :----: | :--------: | :-------: |
| ...value | any | No | Yes |

- If you are pushing multiple values and one of them is already in the array, only that one will not be pushed.

**Examples:**
```js
//before: {"potions": ["healing", "swiftness"]}
DB.get("potions").push("healing")
//after: {"potions": ["healing", "swiftness"]}

//before: {"lotteryNumbers": [6, 26, 42, 20, 53]}
DB.get("lotteryNumbers").push(31, 42, 20)
//after: {"lotteryNumbers": [6, 26, 42, 20, 53, 31]}
```

---
#### .pull({getList, save})
Removes the last element from an array.

| Parameter  | Type | Optional | Default |
| :-----------: | :----: | :--------: |  :-------: |
| getList | boolean | yes | false |
| save | boolean | yes |  false |

- Setting getList to true will return the pulled value instead of the DB object. You will not be able to call `.save()` if this is true. 
- The save parameter determines if the result will be pushed to the database or returned. By default save is false (returns value, doesn't save).

**Examples:**
```js
//before: {"potions": ["strength", "healing", "swiftness"]}
DB.get("potions").pull({save: true})
//after: {"potions": ["strength", "healing"]}

//before: {"lotteryNumbers": [6, 26, 42, 20, 53]}
let pulledFromList = DB.get("lotteryNumbers").pull({getList: true, save: true})
//after: {"lotteryNumbers": [6, 26, 42, 20]}
//pulledFromList = 53
```

---
#### .shift({getList, save})
Removes the first element from an array.

| Parameter  | Type | Optional | Default |
| :-----------: | :----: | :--------: |  :-------: |
| getList | boolean | yes | false |
| save | boolean | yes |  false |

- Setting getList to true will return the pulled value instead of the DB object. You will not be able to call `.save()` if this is true. 
- The save parameter determines if the result will be pushed to the database or returned. By default save is false (returns value, doesn't save).

**Examples:**
```js
//before: {"potions": ["strength", "healing", "swiftness"]}
DB.get("potions").shift({save: strue})
//after: {"potions": ["healing", "swiftness"]}

//before: {"lotteryNumbers": [6, 26, 42, 20, 53]}
let shifted = DB.get("lotteryNumbers").shift({getList: true, save: true})
//after: {"lotteryNumbers": [26, 42, 20, 53]}
//shifted = 6
```

---
#### .unshift(...value)
Adds one or more elements to the beginning of an array.

| Parameter  | Type | Optional | Multible |
| :-----------: | :----: | :--------: | :-------: |
| ...value | any | No | Yes |

**Examples:**
```js
//before: {"potions": ["healing", "swiftness"]}
DB.get("potions").unshift("strength")
//after: {"potions": ["strength", "healing", "swiftness"]}

//before: {"lotteryNumbers": [6, 26, 42, 20, 53]}
DB.get("lotteryNumbers").unshift(31, 7, 12)
//after: {"lotteryNumbers": [31, 7, 12, 6, 26, 42, 20, 53]}

//before: {"users": [{"name" : "Gam", "age" : 19}]}
DB.get("lotteryNumbers").unshift({"name" : "John", "age" : 68})
//after: {"users": [ {"name" : "John", "age" : 68}, {"name" : "Gam", "age" : 19}]}
```
---
#### .every(func)
Tests whether all elements in the array pass the test implemented by the provided function.

| Parameter  | Type | Optional |
| :-----------: | :----: | :--------: |
| func | function | No |

**Example:**
```js
//in DB: {"playerScores" : [91, 75, 100, 76, 66, 81, ]}
console.log(DB.get("playerScores").every(el => el > 80)) //prints false
console.log(DB.get("playerScores").every(el => el > 50)) //prints true
console.log(DB.get("playerScores").some(el => el < 50)) //prints false
```

---
#### .some(func)
Tests whether at least one element in the array passes the test implemented by the provided function.

| Parameter  | Type | Optional |
| :-----------: | :----: | :--------: |
| func | function | No |

**Example:**
```js
//in DB: {"playerScores" : [91, 75, 100, 76, 66, 81, ]}
console.log(DB.get("playerScores").some(el => el > 80)) //prints true
console.log(DB.get("playerScores").some(el => el > 50)) //prints true
console.log(DB.get("playerScores").some(el => el < 50)) //prints false
```
---
#### .has(value)
Determines whether an array includes a certain value among its entries.

| Parameter  | Type | Optional |
| :-----------: | :----: | :--------: |
| ...value | any | No |

**Example:**
```js
//in DB: {"guildMembers" : ["Tom", "Gam", "Jhon", "Kate"]}
console.log(DB.get("guildMembers").has("Gam")) //prints true
console.log(DB.get("guildMembers").has("Gamrion")) //prints false
```

---
#### .map(func, save)
Creates an array populated with the results of calling a provided function on every element.

| Parameter  | Type | Optional | Default |
| :-----------: | :----: | :--------: |  :-------: |
| func | function | No | none |
| save | boolean | Yes |  false |

**Examples:**
*Mapping to variable*
```js
//in DB: {'numbers': [1,2,3,4,5]}
let mapped = DB.get("numbers").map(x => x ** 2);
//mapped = [1,4,9,16,25]
```
*Mapping and saving*
```js
//before: {'numbers': [1,2,3,4,5]}
DB.get("numbers").map((x => x ** 2), true);
//after: {'numbers': [1,4,9,16,25]}
```

---
#### .sort(func, save)
Sorts the elements of an array.

| Parameter  | Type | Optional | Default |
| :-----------: | :----: | :--------: |  :-------: |
| func | function | No | none |
| save | boolean | Yes |  false |

**Examples:**
*Sorting to variable:*
```js
//in DB: {'userScore': [{"John": 5}, {"Gam": 10}, {"Tom": 6}]}
let sorted = DB.get("userScore").sort((a, b) => b.value - a.value)
//sorted = [{"Gam": 10}, {"Tom": 6}, {"John": 5}]
```
*Sorting and saving:*
```js
//before: {'userScore': [{"John": 5}, {"Gam": 10}, {"Tom": 6}]}
let sortBy = (a, b) => b.value - a.value
DB.get("userScore").sort(sortBy , true)
//after: {'userScore': [{"Gam": 10}, {"Tom": 6}, {"John": 5}]}
```

---
#### .filter(func, save)
Creates an array with all elements that pass the test, given by the provided function.

| Parameter  | Type | Optional | Default |
| :-----------: | :----: | :--------: |  :-------: |
| func | function | No | none |
| save | boolean | Yes |  false |

**Examples:**
*Filtering to variable:*
```js
//in DB: {"lotteryNumbers": [6, 26, 42, 20, 53]}
let filtered = DB.get("lotteryNumbers").filter(i => i >= 40);
//filtered = [42, 53]
```
*Filtering and saving:*
```js
//before: {"lotteryNumbers": [6, 26, 42, 20, 53]}
DB.get("lotteryNumbers").filter((i => i >= 40), true);
//after: {"lotteryNumbers": [42, 53]}
```

---
#### .reduce(func, save)
Executes a "reducer" callback function on each element of the array.  
The first time that the callback is run there is no "return value of the previous calculation".

| Parameter  | Type | Optional | Default |
| :-----------: | :----: | :--------: |  :-------: |
| func | function | No | none |
| save | boolean | Yes |  false |

**Examples:**
*Reducing to variable:*
```js
//in DB: {"gameScores": [30, 15, 40, 25, 50]}
let reduced = DB.get("gameScores").reduce((acc, e) => acc + e)
//reduced = 160
```
*Reducing and saving:*
```js
//before: {"gameScores": [30, 15, 40, 25, 50]}
DB.get("gameScores").reduce(((acc, e) => acc + e), true)
//after: {"gameScores": 160}
```
Now that it's *score* not *score**s***, you can rename the key using *.rename()* :)

---
#### .length()
Returns the number of elements or characters in that array or string.

**Example:**
```js
//in DB: {"name" : "Gamriel", "inventory": ["Great Sword", "Mighty Shield", "Book of Spells"]}

console.log(DB.get("name").length()) //prints 7
console.log(DB.get("inventory").length()) //prints 3
```

---
### Object Operations
---
#### .concat(newValue)
Combine/concatenate the selected property with a new value.

| Parameter  | Type | Optional |
| :-----------: | :----: | :--------: |
| newValue | string, array, object | No |

**Examples:**
*Combining strings:*
```js
//before: {"name" : "Gam"}
DB.get("name").concat("rion")
//after: {"name": "Gamrion"}
```
*Combining arrays:*
```js
//before: {"inventory": ["Great Sword", Holy Shield]}
DB.get("inventory").concat(["Swift Boots", "Ruby Ring", "Health Potion" ])
//after: {"inventory": ["Great Sword", Holy Shield, "Swift Boots", "Ruby Ring", "Health Potion" ]}
```
*Combining objects:*
```js
//before: {"user" : {"name": "Gam"}}
DB.get("user").concat({"age": 19})
//after: {"user" : {"name": "Gam", "age": 19}}
```
*Combining array to string:*
```js
//before: {"lotteryResults" : [33, 50, 42, 4, 12, 9]}
DB.get("lotteryResults").toString(", ", true).concat(" are the winning numbers!")
//after: {"lotteryResults" : "33, 50, 42, 4, 12, 9 are the winning numbers!"}

DB.get("lotteryResults").rename("announcement")
//after {"announcement": "33, 50, 42, 4, 12, 9 are the winning numbers!"}
```

---
## Async Saving
To avoid blocking the event loop when saving the StormDB database it is recommended you enable the async option on the engine. Async isn't necessary when not creating a web server, saving the StormDB database is synchronous by default.

```js
// start async local file engine
const engine = new StormDB.Engine("./data.json", {
  async: true
});
```
Saving becomes a promise.
```js
// asynchronous database save
db.save().then(() => console.log("Finished Saving Database!"));
```

## What and Why

#### Changes

- added `read()`, `inc()`, `dec()`, `add()`, `sub()`, `addRanom()`, `subRandom()`, `rename()`, `toLowerCase()`, `toUpperCase()`, `toString()`, `trim()`, `replace()`, `reverse()`, `pushSet()`, `pull()`, `shift()`, `unshift()`, `every()`, `has()`, `length()` and `concat()`;

- updated `delete()`, `push()`, `map()`, `sort()`, `filter()`, `reduce()`;

- changed file structure, split groups in seperate files for better management;

- removed serialization.

---
#### Discarded ideas

- `greaterThan()`, `lesserThan()`, `notEqualTo()`, `min()` and `max()` - These were supposed to be number methods to search in arrays, but then I remembered that `filter()` does the same job.

- `findIndex()` - I just coudn't imagine how this would be useful.

- `addDate()` and `date()` - They were supposed to add dates to objects in a database, but `DB.set("date", new Date())` did the same work.

- `comment()` - Similar to date, it was supposed to add comments for the developers in the database, but the devs could open the database and insert their comments that way or do `DB.set("comment", "This is a comment.")`.

- `keys()` - It was supposed to return all the keys in the target object, but `Object.keys(DB.value())` would do the same.

- `update()` - It was a cool idea, it was supposed to do something for each element of an array, then I realized this was just `map()`.

---
#### Why?

At first i just needed a database manager that looked nice in code and could refresh at any time.
**StormDB** looked nice but i couldn't refresh it the way i wanted to.  
After a while i tried to make my own solution and that lead to me looking at the source code. I made `read()` and went on with my buisness. After that I started using **StormDB**, but some stuff like adding 1 to a number was just not convenient.  
Already having experience with the code, I decided to put another method in there - `inc()`. After this I began wondering what other way I can imporve it and that lead me to make the number group then the array, string and object groups.  
With so many chances I decided to call it something else - **ThunderDB** and so that's how I ended up writing a documentation for a ThunderDB.

I really hope the original creator doesn't copystrike me or something for publishing this to GitHub, all the links to his **StormDB** are below as well as his page and the original license.

# Links, Credit and License
**StormDB**: [GitHub](https://github.com/TomPrograms/stormdb)
Try it online: <a href="https://tomprograms.github.io/stormdb">Interactive Playground </a>

**Original Author**: [Tom](https://github.com/TomPrograms)
**License**: [MIT](LICENSE)
