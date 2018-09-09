/*
Inventory is a CLASS that has 9 items visible on screen
Selection item index is determined by 'selected' and changes with scroll
Selected item can be used via left click
*/
var bag={
    var contents= [],
    var selected=0
  };

  //TODO: ALL items must have name and type attributes and use function
  /*
  Picks up item
  if item is already in inventory, take item and increase quantity;
  if inventory is full, tell user and return; DO NOT TAKE item
  if item is not in inventory, take item add new item in new slot
  */
  pickUp(item){
    for (int i = 0; i<9; i++){
      if(typeof contents[i] === 'undefined')
      {
        // no item at index i
        contents[i] = {
          name: item.name,
          type: item.type,
          use: item.use,
          quantity: 1
        };
        return;
      }
      else {
        // objects exist at index i
        if (contents[i].name===item.name )
        {
          contents[i].quantity++;
          return;
        }
      }

    }
    //TODO: display message that inventory is full
    console.log("Cannot pick up item. Inventory is full");
    return;
  }

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

module.exports.bag= bag;
module.exports.pickUp = pickUp;
module.exports.scrollSelect= scrollSelect;
