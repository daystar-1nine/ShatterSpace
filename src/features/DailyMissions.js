export class DailyMissions {
    constructor() {
        this.missions = [];
        this.lastRefresh = localStorage.getItem('stellar_daily_time') || 0;
        this.initializeMissions();
    }

    initializeMissions() {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        
        if (now - this.lastRefresh > oneDay) {
            this.generateNewMissions();
            localStorage.setItem('stellar_daily_time', now);
        } else {
            this.loadMissions();
        }
    }

    generateNewMissions() {
        this.missions = [
            { id: 1, desc: "Destroy 100 Asteroids", target: 100, current: 0, reward: 500 },
            { id: 2, desc: "Survive for 5 minutes", target: 300, current: 0, reward: 1000 },
            { id: 3, desc: "Defeat 3 Bosses", target: 3, current: 0, reward: 2500 }
        ];
        this.saveMissions();
    }

    loadMissions() {
        const saved = localStorage.getItem('stellar_daily_missions');
        if (saved) {
            this.missions = JSON.parse(saved);
        } else {
            this.generateNewMissions();
        }
    }

    saveMissions() {
        localStorage.setItem('stellar_daily_missions', JSON.stringify(this.missions));
    }

    progressMission(id, amount) {
        const mission = this.missions.find(m => m.id === id);
        if (mission && mission.current < mission.target) {
            mission.current = Math.min(mission.target, mission.current + amount);
            this.saveMissions();
            
            if (mission.current === mission.target) {
                return mission.reward;
            }
        }
        return 0;
    }
}
