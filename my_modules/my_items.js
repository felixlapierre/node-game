/*

*/
class Item{
    var name;
    var type;
    var quantity;

function update(){}

function draw(){}

}

/*
  Using a Sword
  Left clicking& hold for a weapon should trigger PULL BACK state
  releasing too early will nullify damage
  relasing during an interval (tbd) with deal x amt of damage relative to timing (2 sec sweet spot??)
  Proper release triggers SWING state which deals damage to an area //TODO: define range of weapon and implement parrying
  After SWING, restore to SHEATHED state
*/

/*
  Using an item
  Left clicking will cause a different effect depending on the TYPE of the item

  key     => will unlock interactable if within range (to open must use right click)
  potion  => will consume, increase HP & invoke removeOne()
*/
