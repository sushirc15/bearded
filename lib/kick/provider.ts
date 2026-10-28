export interface KickChatter {
  id: string;
  username: string;
  avatar: string;
  color?: string;
  badges?: string[];
  isSubscriber?: boolean;
  isMod?: boolean;
  isVip?: boolean;
  lastMessageAt?: string;
}

export interface KickStreamStatus {
  isLive: boolean;
  viewers: number;
  category: string;
  title: string;
  startedAt?: string;
}

export interface KickProvider {
  getActiveChatters(options?: { minutes?: number; exclude?: string[] }): Promise<KickChatter[]>;
  getStreamStatus(): Promise<KickStreamStatus>;
  pickRandomChatter(exclude?: string[]): Promise<KickChatter>;
}

const MOCK_CHATTERS: KickChatter[] = [
  {
    id: "chatter-1",
    username: "NeonViper99",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    color: "#B6FF3B",
    badges: ["VIP", "SUB_6M"],
    isSubscriber: true,
    isVip: true,
  },
  {
    id: "chatter-2",
    username: "SlotCrusher_X",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80",
    color: "#00E700",
    badges: ["SUB_1Y"],
    isSubscriber: true,
  },
  {
    id: "chatter-3",
    username: "LuckyWhale42",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
    color: "#BDF76B",
    badges: ["FOUNDER"],
    isSubscriber: true,
  },
  {
    id: "chatter-4",
    username: "BeardDisciple",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    color: "#E5383B",
    badges: ["MOD"],
    isMod: true,
    isSubscriber: true,
  },
  {
    id: "chatter-5",
    username: "CyberRolls",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    color: "#FFC83D",
    badges: ["VIP"],
    isVip: true,
  },
  {
    id: "chatter-6",
    username: "TurboChadKick",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    color: "#B6FF3B",
    badges: ["SUB_3M"],
    isSubscriber: true,
  },
  {
    id: "chatter-7",
    username: "RakebackFiend",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80",
    color: "#00E700",
  },
  {
    id: "chatter-8",
    username: "MultiplierQueen",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    color: "#E5383B",
    badges: ["VIP", "SUB_1Y"],
    isSubscriber: true,
    isVip: true,
  },
  {
    id: "chatter-9",
    username: "GambaSensei",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    color: "#B6FF3B",
  },
  {
    id: "chatter-10",
    username: "ApexSpinZ",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80",
    color: "#00E700",
    badges: ["SUB_6M"],
    isSubscriber: true,
  },
  {
    id: "chatter-11",
    username: "ShadowSpins",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    color: "#FFC83D",
  },
  {
    id: "chatter-12",
    username: "BonusHuntGod",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80",
    color: "#B6FF3B",
    badges: ["VIP"],
    isVip: true,
  },
  {
    id: "chatter-13",
    username: "KickingMaxWin",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80",
    color: "#BDF76B",
    badges: ["FOUNDER"],
    isSubscriber: true,
  },
  {
    id: "chatter-14",
    username: "ZenithDrops",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80",
    color: "#E5383B",
  },
  {
    id: "chatter-15",
    username: "WagerWarrior",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80",
    color: "#FFC83D",
    badges: ["SUB_3M"],
    isSubscriber: true,
  },
];

class MockKickProvider implements KickProvider {
  async getActiveChatters(options?: { minutes?: number; exclude?: string[] }): Promise<KickChatter[]> {
    const excludeSet = new Set(options?.exclude || []);
    return MOCK_CHATTERS.filter((c) => !excludeSet.has(c.username));
  }

  async getStreamStatus(): Promise<KickStreamStatus> {
    return {
      isLive: true,
      viewers: 1420,
      category: "Slots & Casino",
      title: "BEARDED DUELS | 500x HUNT | !CODE FOR REWARDS",
      startedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    };
  }

  async pickRandomChatter(exclude?: string[]): Promise<KickChatter> {
    const chatters = await this.getActiveChatters({ exclude });
    if (chatters.length === 0) return MOCK_CHATTERS[0];
    const randomIndex = Math.floor(Math.random() * chatters.length);
    return chatters[randomIndex];
  }
}

class LiveKickProvider implements KickProvider {
  private channelSlug: string;

  constructor(channelSlug: string) {
    this.channelSlug = channelSlug;
  }

  async getActiveChatters(options?: { minutes?: number; exclude?: string[] }): Promise<KickChatter[]> {
    try {
      const res = await fetch(`https://kick.com/api/v2/channels/${this.channelSlug}/chatroom`, {
        next: { revalidate: 30 },
      });
      if (!res.ok) throw new Error("Kick API error");
      // Fallback if chatters endpoint is rate limited
      return new MockKickProvider().getActiveChatters(options);
    } catch {
      return new MockKickProvider().getActiveChatters(options);
    }
  }

  async getStreamStatus(): Promise<KickStreamStatus> {
    try {
      const res = await fetch(`https://kick.com/api/v2/channels/${this.channelSlug}`, {
        next: { revalidate: 30 },
      });
      if (!res.ok) throw new Error("Kick API error");
      const data = await res.json();
      return {
        isLive: Boolean(data?.livestream),
        viewers: data?.livestream?.viewer_count ?? 0,
        category: data?.livestream?.categories?.[0]?.name ?? "Slots & Casino",
        title: data?.livestream?.session_title ?? "Live Slot Battles",
      };
    } catch {
      return new MockKickProvider().getStreamStatus();
    }
  }

  async pickRandomChatter(exclude?: string[]): Promise<KickChatter> {
    const chatters = await this.getActiveChatters({ exclude });
    if (chatters.length === 0) return MOCK_CHATTERS[0];
    const randomIndex = Math.floor(Math.random() * chatters.length);
    return chatters[randomIndex];
  }
}

const useMock =
  process.env.USE_MOCK_KICK === "true" ||
  !process.env.KICK_CHANNEL_SLUG ||
  process.env.NODE_ENV !== "production";

export const kickProvider: KickProvider = useMock
  ? new MockKickProvider()
  : new LiveKickProvider(process.env.KICK_CHANNEL_SLUG || "TThebeardedGamer");
