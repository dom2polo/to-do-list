//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); 
const date = require(__dirname + "/date.js");
const app = express();
const _ = require("lodash"); 

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

mongoose.connect("mongodb+srv://admin-dominic:Hsernaylerpwei15@cluster0.h5d11.mongodb.net/todolistDB", {useNewUrlParser: true}); 

// 1 field: name, string 
const itemsSchema = {
  name: String
}; 

const Item = mongoose.model("Item", itemsSchema); 

// creating new document 
const item1 = new Item ({
  name: "Welcome to your todolist!" 
});

const item2 = new Item ({
  name: "Hit the + button to add a new item." 
});

const item3 = new Item ({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3]; 

const listSchema = {
  name: String,
  items: [itemsSchema] 
}; 

const List = mongoose.model("List", listSchema); 

// Item.insertMany(defaultItems, function(err){
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Successfully saved default items to database");
//   }
// })

app.get("/", function(req, res) {

  const day = date.getDate(); 

  // {} will find us ALL the items 
  Item.find({}, function(err, foundItems){
    if(foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to database");
        }
      }); 
      res.redirect("/"); 
    } else {
        res.render("list", {listTitle: day , newListItems: foundItems});
    }
  });
});

app.get("/:customListName", function(req, res) {

  // access 
  const customListName = _.capitalize(req.params.customListName);

  // check if list already exist 

List.findOne({name: customListName}, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        // create a new list 
        const list = new List ({
          name: customListName,
          items: defaultItems
        }); 
        list.save(); 
        res.redirect("/" + customListName);
      } else {
        // show an existing list 
        res.render("list", {listTitle: foundList.name , newListItems: foundList.items})
      }
    }
  })

  
});


app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list; 

  const item = new Item ({
    name: itemName
  });

  if (listName === date.getDate()) {
    item.save(); 
    res.redirect("/"); 
  } else {
    List.findOne({name: listName}, function(err, foundList) {
      foundList.items.push(item); 
      foundList.save(); 
      res.redirect("/" + listName); 
    });
  }
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox; 
  const listName = req.body.listName; 

  if(listName === date.getDate()) {
    Item.findByIdAndRemove(checkedItemId, function(err){
      // only execute if callback is provided 
      if (!err) {
        console.log("Item successfully removed");
        setTimeout(function() {
          res.redirect("/");
        }, 800); 
      }
    });
  } else {
    List.findOneAndUpdate ({name: listName},{$pull: {items: {_id: checkedItemId}}},function(err, foundList) {
        if (!err) {
          res.redirect("/" + listName); 
        }
      }); 
  }

}); 


app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT; 
if (port == null || port == "") {
  port = 3000; 
}

app.listen(port, function() {
  console.log("Server has started successfully");
});
