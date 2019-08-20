export interface Creature {
    x: number;
    y: number;
    angle: number;
    sprites: any;
}

export interface LocalCreatureInfo {
    creature: Creature;
    animations: Map<string, AnimationInfo>;
}

export interface AnimationInfo {
    id: string;
    time: number;
}

export class ClientStorage {
    map: any;
    bag = {
        contents: []
      };
    creatures = new Map<string, LocalCreatureInfo>();
    spritesheet = new Image();
    topleft = {
        x: 0,
        y: 0
    }
    canvas: any;
}