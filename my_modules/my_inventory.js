var inventory= new Array(9);
var selected=-1;

/*
  Inventory has 9 items visible on screen
  Selection changes with scroll
  Selected item can be used via left click
*/
//TODO: ALL items must have name and type attributes and use function
/*
  Picks up item
  if item is already in inventory, take item and increase quantity;
  if inventory is full, tell user and return; DO NOT TAKE item
  if item is not in inventory, take item add new item in new slot
*/
function pickUp(item){

  if (item.name in inventory){
    inventory[item.name].quantity++;
    return;
  }
  else if (inventory.length ==9){
    //TODO: display message that inventory is full
    console.log("inventory is full");
    return;
  }

    inventory[item.name] = {
      name: item.name,
      type: item.type,
      quantity: 1
    }

}
