import { TimeCounter } from "../Utils/TimeCounter";

export interface Health {
    getCurrentHealth(): number
    isVulnerable(): boolean
    takeDamage(amount: number): void
}

const onHitInvulnerabilityDuration = 1000;

export class FiniteHealth implements Health {
    private currentHealth: number;
    private vulnerable: boolean = true;

    constructor(private maxHealth: number) {
        this.currentHealth = this.maxHealth;
    }

    getCurrentHealth() {
        return this.currentHealth;
    }

    isVulnerable() {
        return this.vulnerable;
    }

    takeDamage(amount: number) {
        this.currentHealth -= amount;
        this.vulnerable = false;
        new TimeCounter(onHitInvulnerabilityDuration, () => {
            this.vulnerable = true;
        })
    }
}

const INFINITE_HEALTH = 9999;

export class InfiniteHealth implements Health {
    getCurrentHealth() { return INFINITE_HEALTH }
    isVulnerable() { return true }
    takeDamage(amount: number) { }
}