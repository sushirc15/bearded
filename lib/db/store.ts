import fs from "fs";
import path from "path";

export interface SlotInfo {
  id: string;
  name: string;
  provider: string;
  thumbnail?: string;
  rtp?: string;
  volatility?: string;
  accent?: string;
}

export interface BattleState {
  id: string;
  status: "idle" | "rolling" | "slot_ready" | "ready" | "finished";
  houseSlot: SlotInfo | null;
  chatSlot: SlotInfo | null;
  chatterName: string | null;
  chatterAvatar: string | null;
  houseMultiplier: number | null;
  chatMultiplier: number | null;
  winner: "house" | "chat" | null;
  lastAssignedSlot: SlotInfo | null;
  createdAt: string;
}

export interface ScoreState {
  houseWins: number;
  chatWins: number;
}

export interface RollState {
  rollId: string;
  slotId: string;
  slot: SlotInfo;
  startedAt: number;
  durationMs: number;
  jitter: number; // offset within the winning card (-40 to +40 px)
}

export interface BracketEntry {
  slot: string;
  player: string;
}

export interface BracketState {
  id: string;
  size: 4 | 8 | 16;
  status: "active" | "champion_crowned";
  entries: BracketEntry[];
  winners: Record<number, (string | null)[]>; // roundIndex -> array of winners
  champion: string | null;
  createdAt: string;
}

interface DBData {
  score: ScoreState;
  battle: BattleState;
  currentRoll: RollState | null;
  bracket: BracketState;
  battleUndoStack: { battle: BattleState; score: ScoreState }[];
  bracketUndoStack: BracketState[];
}

const DEFAULT_SLOTS = [
  "Gates of Olympus 1000",
  "Wanted Dead or a Wild",
  "Sweet Bonanza 1000",
  "Chaos Crew 2",
  "San Quentin xWays",
  "Mental",
  "Banana Town",
  "Razor Returns",
  "Le Bandit",
  "SixSixSix",
  "Sugar Rush 1000",
  "Dork Unit",
  "Ze Zeus",
  "RIP City",
  "Tombstone RIP",
  "Big Bamboo",
];

const DEFAULT_PLAYERS = [
  "KickViper",
  "SlotKing99",
  "LuckyWhale",
  "BeardBro",
  "CyberApe",
  "ZenithSpin",
  "NeonNinja",
  "AlphaRoll",
  "TurboChad",
  "ShadowKick",
  "HyperDrop",
  "GoldHunter",
  "RakebackGod",
  "BonusFiend",
  "MultiplierMax",
  "GambaTitan",
];

function createDefaultBracket(size: 4 | 8 | 16 = 8): BracketState {
  const entries: BracketEntry[] = [];
  for (let i = 0; i < size; i++) {
    entries.push({
      slot: DEFAULT_SLOTS[i % DEFAULT_SLOTS.length] || `Slot ${i + 1}`,
      player: DEFAULT_PLAYERS[i % DEFAULT_PLAYERS.length] || `Player ${i + 1}`,
    });
  }

  const winners: Record<number, (string | null)[]> = {};
  const totalRounds = Math.log2(size);
  let roundSize = size / 2;

  for (let r = 0; r < totalRounds; r++) {
    winners[r] = new Array(roundSize).fill(null);
    roundSize /= 2;
  }

  return {
    id: `bracket_${Date.now()}`,
    size,
    status: "active",
    entries,
    winners,
    champion: null,
    createdAt: new Date().toISOString(),
  };
}

const DEFAULT_DATA: DBData = {
  score: {
    houseWins: 0,
    chatWins: 0,
  },
  battle: {
    id: `battle_${Date.now()}`,
    status: "idle",
    houseSlot: null,
    chatSlot: null,
    chatterName: null,
    chatterAvatar: null,
    houseMultiplier: null,
    chatMultiplier: null,
    winner: null,
    lastAssignedSlot: null,
    createdAt: new Date().toISOString(),
  },
  currentRoll: null,
  bracket: createDefaultBracket(8),
  battleUndoStack: [],
  bracketUndoStack: [],
};

class InMemoryPersistentDB {
  private data: DBData;
  private filePath: string;

  constructor() {
    this.filePath = process.env.VERCEL
      ? path.join("/tmp", ".data-cache.json")
      : path.join(process.cwd(), ".data-cache.json");
    this.data = this.load();
  }

  private load(): DBData {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        return JSON.parse(raw);
      }
    } catch {
      // Fallback
    }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  private persist(): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), "utf-8");
    } catch {
      // Non-fatal
    }
  }

  // --- Battle & Score Methods ---
  getScore(): ScoreState {
    return { ...this.data.score };
  }

  resetScore(): ScoreState {
    this.pushBattleSnapshot();
    this.data.score = { houseWins: 0, chatWins: 0 };
    this.persist();
    return this.getScore();
  }

  getBattle(): BattleState {
    return { ...this.data.battle };
  }

  getCurrentRoll(): RollState | null {
    return this.data.currentRoll;
  }

  setCurrentRoll(roll: RollState): void {
    this.pushBattleSnapshot();
    this.data.currentRoll = roll;
    this.data.battle.status = "rolling";
    this.data.battle.lastAssignedSlot = roll.slot;
    this.persist();
  }

  finishRoll(slot: SlotInfo): void {
    this.data.battle.status = "slot_ready";
    this.data.battle.lastAssignedSlot = slot;
    this.persist();
  }

  assignSlot(target: "house" | "chat", slot: SlotInfo): BattleState {
    this.pushBattleSnapshot();
    if (target === "house") {
      this.data.battle.houseSlot = slot;
    } else {
      this.data.battle.chatSlot = slot;
    }

    // Check if both sides ready
    if (this.data.battle.houseSlot && this.data.battle.chatSlot && this.data.battle.chatterName) {
      this.data.battle.status = "ready";
    } else {
      this.data.battle.status = "slot_ready";
    }

    this.persist();
    return this.getBattle();
  }

  setChatter(name: string, avatar: string): BattleState {
    this.pushBattleSnapshot();
    this.data.battle.chatterName = name;
    this.data.battle.chatterAvatar = avatar;

    if (this.data.battle.houseSlot && this.data.battle.chatSlot && this.data.battle.chatterName) {
      this.data.battle.status = "ready";
    }

    this.persist();
    return this.getBattle();
  }

  setMultipliers(houseMult?: number | null, chatMult?: number | null): BattleState {
    if (houseMult !== undefined) this.data.battle.houseMultiplier = houseMult;
    if (chatMult !== undefined) this.data.battle.chatMultiplier = chatMult;
    this.persist();
    return this.getBattle();
  }

  declareWinner(winner: "house" | "chat", houseMult?: number, chatMult?: number): { battle: BattleState; score: ScoreState } {
    this.pushBattleSnapshot();
    this.data.battle.winner = winner;
    this.data.battle.status = "finished";
    if (houseMult !== undefined) this.data.battle.houseMultiplier = houseMult;
    if (chatMult !== undefined) this.data.battle.chatMultiplier = chatMult;

    if (winner === "house") {
      this.data.score.houseWins += 1;
    } else {
      this.data.score.chatWins += 1;
    }

    this.persist();
    return { battle: this.getBattle(), score: this.getScore() };
  }

  nextBattle(): BattleState {
    this.pushBattleSnapshot();
    this.data.battle = {
      id: `battle_${Date.now()}`,
      status: "idle",
      houseSlot: null,
      chatSlot: null,
      chatterName: null,
      chatterAvatar: null,
      houseMultiplier: null,
      chatMultiplier: null,
      winner: null,
      lastAssignedSlot: null,
      createdAt: new Date().toISOString(),
    };
    this.data.currentRoll = null;
    this.persist();
    return this.getBattle();
  }

  undoBattle(): { battle: BattleState; score: ScoreState } | null {
    if (this.data.battleUndoStack.length === 0) return null;
    const previous = this.data.battleUndoStack.pop()!;
    this.data.battle = previous.battle;
    this.data.score = previous.score;
    this.persist();
    return { battle: this.getBattle(), score: this.getScore() };
  }

  private pushBattleSnapshot(): void {
    this.data.battleUndoStack.push({
      battle: JSON.parse(JSON.stringify(this.data.battle)),
      score: JSON.parse(JSON.stringify(this.data.score)),
    });
    if (this.data.battleUndoStack.length > 20) {
      this.data.battleUndoStack.shift();
    }
  }

  // --- Bracket Methods ---
  getBracket(): BracketState {
    return JSON.parse(JSON.stringify(this.data.bracket));
  }

  newBracket(size: 4 | 8 | 16 = 8): BracketState {
    this.pushBracketSnapshot();
    this.data.bracket = createDefaultBracket(size);
    this.persist();
    return this.getBracket();
  }

  updateBracketEntry(index: number, slot?: string, player?: string): BracketState {
    this.pushBracketSnapshot();
    if (this.data.bracket.entries[index]) {
      if (slot !== undefined) this.data.bracket.entries[index].slot = slot;
      if (player !== undefined) this.data.bracket.entries[index].player = player;
    }
    this.persist();
    return this.getBracket();
  }

  advanceBracketWinner(roundIndex: number, matchIndex: number, winner: string): BracketState {
    this.pushBracketSnapshot();
    if (!this.data.bracket.winners[roundIndex]) {
      this.data.bracket.winners[roundIndex] = [];
    }

    const previousWinner = this.data.bracket.winners[roundIndex][matchIndex];
    this.data.bracket.winners[roundIndex][matchIndex] = winner;

    // Clear downstream rounds if earlier winner changed
    if (previousWinner && previousWinner !== winner) {
      const totalRounds = Math.log2(this.data.bracket.size);
      let currMatchIndex = Math.floor(matchIndex / 2);

      for (let r = roundIndex + 1; r < totalRounds; r++) {
        if (this.data.bracket.winners[r] && this.data.bracket.winners[r][currMatchIndex] === previousWinner) {
          this.data.bracket.winners[r][currMatchIndex] = null;
        }
        currMatchIndex = Math.floor(currMatchIndex / 2);
      }

      if (this.data.bracket.champion === previousWinner) {
        this.data.bracket.champion = null;
        this.data.bracket.status = "active";
      }
    }

    // Check if this was the championship final
    const totalRounds = Math.log2(this.data.bracket.size);
    if (roundIndex === totalRounds - 1) {
      this.data.bracket.champion = winner;
      this.data.bracket.status = "champion_crowned";
    }

    this.persist();
    return this.getBracket();
  }

  undoBracket(): BracketState | null {
    if (this.data.bracketUndoStack.length === 0) return null;
    const previous = this.data.bracketUndoStack.pop()!;
    this.data.bracket = previous;
    this.persist();
    return this.getBracket();
  }

  private pushBracketSnapshot(): void {
    this.data.bracketUndoStack.push(JSON.parse(JSON.stringify(this.data.bracket)));
    if (this.data.bracketUndoStack.length > 20) {
      this.data.bracketUndoStack.shift();
    }
  }
}

const globalForDB = globalThis as unknown as { dbStore: InMemoryPersistentDB | undefined };
export const dbStore = globalForDB.dbStore ?? new InMemoryPersistentDB();
if (process.env.NODE_ENV !== "production") globalForDB.dbStore = dbStore;
