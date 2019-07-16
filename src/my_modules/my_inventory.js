/*
Bag is an array with 9 items visible on screen
Selection item index is determined by 'selected' and changes with scroll
Selected item can be used via left click
*/
class Bag {
  constructor() {
    this.contents = [],
    this.selected = 0
  }
}
function createBag() {
  return new Bag();
}

/*
Picks up item
if item is already in inventory, take item and increase quantity;
if inventory is full, tell user and return false; DO NOT TAKE item
if item is not in inventory, take item add new item in new slot
returns true if item has been picked up
*/
function pickUp(item) {
  for (var i = 0; i<9; i++){
    if(typeof bag.contents[i] === 'undefined')
    {
      // no item at index i
      bag.contents[i] = {
        name: item.name,
        type: item.type,
        use: item.use,
        quantity: 1
      };
      return true;
    }
    else {
      // objects exist at index i
      if (bag.contents[i].name===item.name )
      {
        bag.contents[i].quantity++;
        return true;
      }
    }

  }
  //TODO: display message that inventory is full
  console.log("Cannot pick up item. Inventory is full");
  return false;
}

/*
scrollSelect
Takes scroll input deltaY from wheelEvent
scroll down (pull) => move toward left
scroll up (push) => move toward right

*/
 function scrollSelect(event){
   // TODO: change scroll sensitivity

  if (event.deltaY>0){
    selected = (selected-(deltaY/50))%9;
  }
  else{
    selected = (selected+(deltaY/50))%9;
 }
 return;
}

//Inventory management functions
/*
  Remove from inventory
  Takes selcted item and decrements the quantity from inventory
  if quantity reaches zero, bag slot is cleared
*/

function removeOne(indexOfItem){
  if (bag.contents[indexOfItem].quantity==1){
    bag.contents[indexOfItem]=undefined;
  }
  else{
    bag.contents[indexOfItem].quantity--;
  }


}

module.exports.createBag = createBag;
module.exports.pickUp = pickUp;
module.exports.scrollSelect= scrollSelect;
module.exports.removeOne = removeOne;
