import { Item } from './items';
/*
Bag is an array with 9 items visible on screen
Selection item index is determined by 'selected' and changes with scroll
Selected item can be used via left click
*/
export class Bag {
  contents: Array<Item>
  selected: number
  constructor() {
    this.contents = [],
    this.selected = 0
  }

  /**
   * Picks up item
   * if item is already in inventory, take item and increase quantity;
   * if inventory is full, tell user and return false; DO NOT TAKE item
   * if item is not in inventory, take item add new item in new slot
   * @param {Item} item The item to be picked up
   * @return {Boolean} A boolean indicating whether the pickup was successful or not
   */
  pickUp(item: Item) {
    for (var i = 0; i<9; i++){
      if(typeof this.contents[i] === 'undefined')
      {
        // no item at index i
        this.contents[i] = item;
        return true;
      }
      else {
        // objects exist at index i
        if (this.contents[i].name===item.name )
        {
          this.contents[i].quantity++;
          return true;
        }
      }
  
    }
    //TODO: display message that inventory is full
    console.log("Cannot pick up item. Inventory is full");
    return false;
  }

  scrollSelect(event){
    // TODO: change scroll sensitivity
 
    if (event.deltaY>0){
      this.selected = (this.selected - (event.deltaY/50)) % 9;
    }
    else{
      this.selected = (this.selected + (event.deltaY/50)) % 9;
    }
    return;
  }

  removeOne(indexOfItem){
    if (this.contents[indexOfItem].quantity==1){
      this.contents[indexOfItem]=undefined;
    }
    else{
      this.contents[indexOfItem].quantity--;
    }
  }
}
