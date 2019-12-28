export interface Health {
    getCurrentHealth(): number
    takeDamage(amount: number): void
}

export class FiniteHealth implements Health {
    private currentHealth: number;

    constructor(private maxHealth: number) {
        this.currentHealth = maxHealth;
    }

    getCurrentHealth() {
        return this.currentHealth;
    }

    takeDamage(amount: number) {
        this.currentHealth -= amount;
    }

}

const INFINITE_HEALTH = 9999;

export class InfiniteHealth implements Health {
    getCurrentHealth() { return INFINITE_HEALTH }
    takeDamage(amount: number) { }
}