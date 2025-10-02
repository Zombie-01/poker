import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTablePlayers } from "../hooks/useSupabase";
import { useAppContext } from "../context/AppContext";
import {
  MessageCircle,
  Settings,
  LogOut,
  Volume2,
  Zap,
  Users,
} from "lucide-react";
import { supabase } from "../lib/supabase";

// Improved PokerTable component
// - Better responsive layout and seat positioning
// - Action timer with visual countdown
// - Bet presets (1/2 pot, pot, all-in)
// - Local hand evaluation (simple but robust: checks ranks, pairs, straights, flushes, full house, four-of-kind)
// - Optimistic UI updates for pot / chips when performing actions
// - Clear disabled states when it's not the player's turn

type Player = any;

const RANK_ORDER: Record<string, number> = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

// helper: generate all 5-card combinations from given cards
function combinations<T>(arr: T[], k: number) {
  const res: T[][] = [];
  const comb: T[] = [];
  function backtrack(start: number) {
    if (comb.length === k) {
      res.push([...comb]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      comb.push(arr[i]);
      backtrack(i + 1);
      comb.pop();
    }
  }
  backtrack(0);
  return res;
}

// Evaluate a 5-card poker hand and return a comparable tuple [rankCategory, tieBreakers...]
// rankCategory: 8 = straight flush, 7 = four, 6 = full house, 5 = flush, 4 = straight, 3 = trips, 2 = two pair, 1 = pair, 0 = high card
function evaluateFive(cards: { rank: string; suit: string }[]) {
  const vals = cards.map((c) => RANK_ORDER[c.rank]).sort((a, b) => b - a);
  const suits = cards.map((c) => c.suit);
  const counts: Record<number, number> = {};
  vals.forEach((v) => (counts[v] = (counts[v] || 0) + 1));
  const countsArr = Object.entries(counts)
    .map(([v, c]) => ({ v: Number(v), c }))
    .sort((a, b) => {
      if (b.c !== a.c) return b.c - a.c; // by count desc
      return b.v - a.v; // then by value desc
    });

  const isFlush = suits.every((s) => s === suits[0]);

  // handle wheel straight (A-2-3-4-5)
  const distinctVals = Array.from(new Set(vals)).sort((a, b) => b - a);
  let isStraight = false;
  let highStraight = 0;
  if (distinctVals.length === 5) {
    const max = distinctVals[0];
    const min = distinctVals[4];
    if (max - min === 4) {
      isStraight = true;
      highStraight = max;
    } else if (String(distinctVals) === String([14, 5, 4, 3, 2])) {
      // wheel
      isStraight = true;
      highStraight = 5;
    }
  }

  // straight flush
  if (isFlush && isStraight) {
    return [8, highStraight, ...vals];
  }
  // four of a kind
  if (countsArr[0].c === 4) {
    return [7, countsArr[0].v, countsArr[1].v];
  }
  // full house
  if (countsArr[0].c === 3 && countsArr[1].c === 2) {
    return [6, countsArr[0].v, countsArr[1].v];
  }
  // flush
  if (isFlush) {
    return [5, ...vals];
  }
  // straight
  if (isStraight) {
    return [4, highStraight, ...vals];
  }
  // three of a kind
  if (countsArr[0].c === 3) {
    return [3, countsArr[0].v, ...vals.filter((v) => v !== countsArr[0].v)];
  }
  // two pair
  if (countsArr[0].c === 2 && countsArr[1] && countsArr[1].c === 2) {
    const kicker = countsArr.find((x) => x.c === 1)!.v;
    return [2, countsArr[0].v, countsArr[1].v, kicker];
  }
  // one pair
  if (countsArr[0].c === 2) {
    return [1, countsArr[0].v, ...vals.filter((v) => v !== countsArr[0].v)];
  }
  // high card
  return [0, ...vals];
}

function compareHandTuples(a: number[], b: number[]) {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const av = a[i] || 0;
    const bv = b[i] || 0;
    if (av !== bv) return av - bv;
  }
  return 0;
}

function bestHandFromSeven(cards: { rank: string; suit: string }[]) {
  // cards length should be between 5 and 7
  const combs = combinations(cards, 5);
  let best: number[] | null = null;
  let bestCombo: { rank: string; suit: string }[] = [];
  for (const c of combs) {
    const tup = evaluateFive(c);
    if (!best || compareHandTuples(tup, best) > 0) {
      best = tup;
      bestCombo = c;
    }
  }
  return { tuple: best!, combo: bestCombo };
}

// New: best hand selection for player depending on variant
function bestHandForPlayer(
  holeCards: { rank: string; suit: string }[],
  community: { rank: string; suit: string }[],
  variant: string
) {
  // Hold'em: any best 5 from combined (works with up to 7)
  if (!variant || variant === "holdem") {
    const combined = [...holeCards, ...community];
    // if combined < 5, can't evaluate
    if (combined.length < 5) return null;
    return bestHandFromSeven(combined);
  }

  // Omaha variants: must use exactly 2 hole cards + exactly 3 community cards
  if (variant.startsWith("omaha")) {
    if (community.length < 3 || holeCards.length < 2) return null;
    const holePairs = combinations(holeCards, 2);
    const commTriples = combinations(community, 3);
    let bestTuple: number[] | null = null;
    let bestCombo: { rank: string; suit: string }[] = [];
    for (const hp of holePairs) {
      for (const ct of commTriples) {
        const five = [...hp, ...ct];
        const tup = evaluateFive(five);
        if (!bestTuple || compareHandTuples(tup, bestTuple) > 0) {
          bestTuple = tup;
          bestCombo = five;
        }
      }
    }
    if (!bestTuple) return null;
    return { tuple: bestTuple, combo: bestCombo };
  }

  // default fallback to holdem behaviour
  const combined = [...holeCards, ...community];
  if (combined.length < 5) return null;
  return bestHandFromSeven(combined);
}

const PokerTable: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useAppContext();
  const { players, loading, updatePlayerAction } = useTablePlayers(id || null);
  const [pot, setPot] = useState<number>(0);
  const [blinds, setBlinds] = useState({ small: 5, big: 10 });
  const [handId, setHandId] = useState("Hand #48 237 923");
  const [currentBet, setCurrentBet] = useState(0);
  const [showActions, setShowActions] = useState(true);
  const [communityCards, setCommunityCards] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
  ]);
  const [betAmount, setBetAmount] = useState(40);
  const [gamePhase, setGamePhase] = useState<
    "preflop" | "flop" | "turn" | "river" | "showdown"
  >("preflop");
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [actionTimer, setActionTimer] = useState<number>(18);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [localPlayers, setLocalPlayers] = useState<Player[]>([]);

  // NEW: deck + dealing state
  const [deck, setDeck] = useState<string[]>([]);
  const [isDealt, setIsDealt] = useState(false);

  // map players into fixed seats
  const maxSeats = tableInfo?.max_players || 6;
  const tablePositions = useMemo(() => {
    return Array.from({ length: maxSeats }, (_, index) => {
      const p = players.find((pl: Player) => pl.position === index);
      if (p) return p;
      return {
        id: `empty-${index}`,
        username: "Empty",
        chips: 0,
        cards: [],
        position: index,
        status: "empty",
        user_id: "",
        table_id: id || "",
        joined_at: "",
      } as Player;
    });
  }, [players, tableInfo, id]);

  // fetch table info: keep using supabase client from hook import (global)
  useEffect(() => {
    let cancelled = false;
    async function fetchTable() {
      if (!id) return;
      try {
        // assume `supabase` is globally available in your app like original file used it
        const { data, error } = await supabase
          .from("poker_tables")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        if (cancelled) return;
        setTableInfo(data);
        setPot(data.pot || 0);
        setBlinds({ small: data.stakes_small, big: data.stakes_big });
      } catch (err) {
        console.error("fetch table error", err);
        // if we can't fetch the table (connectivity), leave gracefully
        if (!cancelled) {
          handleLeaveTable().catch(() => {
            /* swallow */
          });
        }
      }
    }
    fetchTable();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // keep a local copy of players to perform optimistic updates / timers
  useEffect(() => {
    setLocalPlayers(players || []);
    const me = players.find((p: Player) => p.user_id === state.user?.id);
    setIsMyTurn(Boolean(me && me.is_turn));
    // update betAmount sensible default
    setBetAmount((prev) => Math.max(prev, blinds.big));
  }, [players, state.user, blinds]);

  // Connectivity guard: ping periodically and leave if server unreachable; also leave on offline event
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const ping = async () => {
      try {
        const { data, error } = await supabase
          .from("poker_tables")
          .select("id")
          .eq("id", id)
          .single();
        if (error || !data) throw error || new Error("no-table");
      } catch (err) {
        console.error("Table ping failed, leaving table", err);
        if (!cancelled) {
          try {
            await handleLeaveTable();
          } catch (_) {}
        }
      }
    };
    const iv = setInterval(ping, 20000);
    // call once immediately
    ping().catch(() => {});
    const offlineHandler = () => {
      handleLeaveTable().catch(() => {});
    };
    window.addEventListener("offline", offlineHandler);
    return () => {
      cancelled = true;
      clearInterval(iv);
      window.removeEventListener("offline", offlineHandler);
    };
  }, [id]);

  // action timer: start when it's my turn
  useEffect(() => {
    let timer: any = null;
    if (isMyTurn) {
      setActionTimer(18);
      timer = setInterval(() => {
        setActionTimer((t) => {
          if (t <= 1) {
            clearInterval(timer);
            // auto-fold when timer expires (optimistic)
            handleAction("fold");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMyTurn]);

  const formatCurrency = (v: number) => `$${v.toLocaleString()}`;

  const getCardSymbol = (card: string) => {
    if (!card) return "";
    const suit = card.slice(-1);
    const suitSymbols: Record<string, string> = {
      H: "♥",
      D: "♦",
      C: "♣",
      S: "♠",
    };
    return suitSymbols[suit] || "";
  };

  // simplified parser: expects card like "AH" "10D" "QS"
  const parseCard = (c: string) => {
    if (!c) return null;
    const suit = c.slice(-1);
    const rank = c.slice(0, -1);
    return { rank, suit };
  };

  // NEW: return label + isRed flag for styling (e.g. "9♥", "J♦")
  const formatCardLabel = (card?: string | null) => {
    if (!card) return { label: "--", isRed: false };
    const rank = card.slice(0, -1);
    const suit = card.slice(-1);
    const suitSymbols: Record<string, string> = {
      H: "♥",
      D: "♦",
      C: "♣",
      S: "♠",
    };
    const symbol = suitSymbols[suit] || suit;
    const isRed = suit === "H" || suit === "D";
    return { label: `${rank}${symbol}`, isRed };
  };

  // derive variant and hole card count
  const variant = (tableInfo?.game_type || "holdem").toLowerCase();
  const holeCount = variant === "omaha6" ? 6 : variant === "omaha4" ? 4 : 2;

  // NEW: deal hole cards for a new hand according to variant (2 for holdem, 4/6 for omaha)
  const dealHoleCards = () => {
    const d = shuffle(buildDeck());
    // deal only to active seats
    const updated = tablePositions.map((seat: Player) => {
      if (seat.status === "empty") return { ...seat };
      // only deal to seats that represent players (joined)
      const cards: string[] = [];
      for (let i = 0; i < holeCount; i++) {
        cards.push(d.shift()!);
      }
      return {
        ...seat,
        cards,
        folded: false,
        show_cards: seat.user_id === state.user?.id,
      }; // show your own immediately
    });
    // set first community cards to empty
    setLocalPlayers(updated);
    setDeck(d);
    setCommunityCards(["", "", "", "", ""]);
    setIsDealt(true);
    setGamePhase("preflop");
    // reset bet/pot if desired (keep optimistic behaviour; adjust as needed)
    setCurrentBet(0);
    // set pot to tableInfo pot if exists else keep current
    setPot(tableInfo?.pot || 0);
  };

  // NEW: advance phase -> flop/turn/river/showdown
  const advancePhase = () => {
    if (!isDealt) return;
    const d = deck.slice();
    if (gamePhase === "preflop") {
      // deal flop: burn 1 then 3
      if (d.length < 4) return;
      d.shift();
      const flop = [d.shift()!, d.shift()!, d.shift()!];
      setCommunityCards((prev) => {
        const next = [...prev];
        next[0] = flop[0];
        next[1] = flop[1];
        next[2] = flop[2];
        return next;
      });
      setGamePhase("flop");
    } else if (gamePhase === "flop") {
      // turn: burn 1 then 1
      if (d.length < 2) return;
      d.shift();
      const t = d.shift()!;
      setCommunityCards((prev) => {
        const next = [...prev];
        next[3] = t;
        return next;
      });
      setGamePhase("turn");
    } else if (gamePhase === "turn") {
      // river: burn 1 then 1
      if (d.length < 2) return;
      d.shift();
      const r = d.shift()!;
      setCommunityCards((prev) => {
        const next = [...prev];
        next[4] = r;
        return next;
      });
      setGamePhase("river");
    } else if (gamePhase === "river") {
      // showdown: reveal all player cards and compute winners
      setLocalPlayers((prev) => prev.map((p) => ({ ...p, show_cards: true })));
      setGamePhase("showdown");
    }
    setDeck(d);
  };

  // Compute showdown winners locally (if community + player cards present)
  const computeWinners = () => {
    try {
      const activePlayers = localPlayers.filter(
        (p: Player) =>
          p.status !== "empty" && !p.folded && p.cards && p.cards.length > 0
      );
      if (activePlayers.length === 0) return null;
      const comm = communityCards.map(parseCard).filter(Boolean) as any[];
      if (comm.length < 3) return null; // not enough to evaluate
      const localVariant = (tableInfo?.game_type || "holdem").toLowerCase();

      const evaluated = activePlayers
        .map((p: Player) => {
          const hole = (p.cards || []).map(parseCard).filter(Boolean) as any[];
          const best = bestHandForPlayer(hole, comm, localVariant);
          return { player: p, best };
        })
        .filter((e) => e.best); // filter out those we couldn't evaluate

      if (evaluated.length === 0) return null;

      evaluated.sort(
        (a, b) => compareHandTuples(a.best.tuple, b.best.tuple) * -1
      );
      const top = evaluated[0].best.tuple;
      const winners = evaluated
        .filter((e) => compareHandTuples(e.best.tuple, top) === 0)
        .map((e) => e.player);
      return { winners, evaluated };
    } catch (err) {
      console.error("compute winners err", err);
      return null;
    }
  };

  const handleLeaveTable = async () => {
    if (!state.user || !id) return;
    try {
      const { error } = await supabase
        .from("table_players")
        .delete()
        .eq("table_id", id)
        .eq("user_id", state.user.id);
      if (error) throw error;
      navigate("/tables");
    } catch (error) {
      console.error("Error leaving table:", error);
    }
  };

  const optimisticUpdateChips = (userId: string, delta: number) => {
    setLocalPlayers((prev) =>
      prev.map((p) =>
        p.user_id === userId
          ? { ...p, chips: Math.max(0, (p.chips || 0) + delta) }
          : p
      )
    );
  };

  const handleAction = async (action: string, amount?: number) => {
    if (!state.user || !id) return;
    // Client-side validation
    if (!isMyTurn && action !== "fold") return; // only allow fold even when not turn? we auto-fold on timeout

    const currentPlayer = localPlayers.find(
      (p) => p.user_id === state.user?.id
    );
    if (!currentPlayer) return;

    try {
      // optimistic: apply to UI immediately
      if (action === "fold") {
        setLocalPlayers((prev) =>
          prev.map((p) =>
            p.user_id === state.user?.id ? { ...p, folded: true } : p
          )
        );
      } else if (action === "call") {
        const toCall = Math.max(
          0,
          currentBet - (currentPlayer.current_bet || 0)
        );
        optimisticUpdateChips(state.user.id, -toCall);
        setPot((prev) => prev + toCall);
      } else if (action === "check") {
        // no chips change
      } else if (action === "raise") {
        const raiseTo = amount || betAmount;
        const delta = raiseTo - (currentPlayer.current_bet || 0);
        optimisticUpdateChips(state.user.id, -delta);
        setPot((prev) => prev + delta);
        setCurrentBet(Math.max(currentBet, raiseTo));
      }

      // send to backend via provided hook
      await updatePlayerAction(state.user.id, action, amount || 0);
    } catch (err) {
      console.error("action err", err);
    }
  };

  // UI helpers
  const seatPositions = (seatCount: number) => {
    if (seatCount <= 6) {
      return [
        { top: "6%", left: "50%", transform: "translate(-50%, -50%)" },
        { top: "22%", left: "10%", transform: "translate(-50%, -50%)" },
        { top: "62%", left: "10%", transform: "translate(-50%, -50%)" },
        { top: "88%", left: "50%", transform: "translate(-50%, -50%)" },
        { top: "62%", left: "90%", transform: "translate(-50%, -50%)" },
        { top: "22%", left: "90%", transform: "translate(-50%, -50%)" },
      ];
    }
    // fallback for 9
    return [];
  };

  // use local dealt players if a hand is dealt, otherwise show table positions
  const seats = isDealt ? localPlayers : tablePositions;

  const winners = computeWinners();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary relative overflow-hidden pb-20 text-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-secondary/40 backdrop-blur">
        <div className="flex items-center space-x-4">
          <div className="text-xs">
            <span className="font-mono text-white">{handId}</span>
            <div className="text-gray-400">
              {tableInfo?.name || "No table name"}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-green-400">RNG</span>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <Users className="w-4 h-4 text-accent" />
            <span className="text-accent">
              {players.length}/{maxSeats}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {state.user && (
              <button
                onClick={handleLeaveTable}
                className="bg-red-600 px-3 py-1 rounded text-white">
                Гарах
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 p-4">
        <div className="relative mx-auto max-w-3xl aspect-square">
          <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-700 to-green-900 rounded-full border-4 border-green-600/50 shadow-2xl ">
            {/* Pot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="bg-black/60 backdrop-blur rounded-2xl px-6 py-4 border border-green-400/30">
                <p className="text-green-400 font-bold text-2xl">
                  {formatCurrency(pot)}
                </p>
                <p className="text-green-300 text-xs">
                  {(variant || "holdem").toUpperCase()} •{" "}
                  {formatCurrency(blinds.small)}/{formatCurrency(blinds.big)}
                </p>
              </div>
            </div>

            {/* Community cards */}
            <div className="absolute top-32 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
              {communityCards.map((c, i) => {
                const { label, isRed } = formatCardLabel(c);
                return (
                  <div
                    key={i}
                    className={`w-8 h-12 rounded-md border shadow-sm flex items-center justify-center font-bold ${
                      c ? "bg-white" : "bg-green-700/30"
                    } ${c ? "text-black" : "text-white"}`}>
                    {c ? (
                      <span className={`${isRed ? "text-red-500" : ""}`}>
                        {label}
                      </span>
                    ) : (
                      "--"
                    )}
                  </div>
                );
              })}
            </div>

            {/* Seats */}
            {seats.map((player: Player, idx: number) => {
              const pos = seatPositions(maxSeats)[idx] || {
                top: `${10 + idx * 12}%`,
                left: `${20 + (idx % 3) * 30}%`,
              };
              const isMe = player.user_id === state.user?.id;

              return (
                <div
                  key={player.id}
                  className="absolute"
                  style={{ ...(pos as any) }}>
                  <div
                    className={`w-36 text-center ${
                      player.status === "empty" ? "opacity-50" : ""
                    }`}>
                    <div
                      className={`bg-secondary rounded-lg p-2 border ${
                        isMe ? "ring-2 ring-accent" : "border-gray-700"
                      }`}>
                      {player.status !== "empty" ? (
                        <>
                          <div className="text-xs font-semibold truncate text-white">
                            {player.username}
                          </div>
                          <div className="text-xs text-accent">
                            {formatCurrency(player.chips || 0)}
                          </div>

                          <div className="mt-2 flex justify-center gap-1">
                            {/* Render the correct number of hole cards depending on variant */}
                            {Array.from({ length: holeCount }).map((_, i) => {
                              const cc = (player.cards || [])[i];
                              const show = Boolean(player.show_cards || isMe);
                              if (!show) {
                                return (
                                  <div
                                    key={i}
                                    className={`w-6 h-8 rounded-md border flex items-center justify-center text-xs font-bold bg-gray-700/30 text-white`}>
                                    🂠
                                  </div>
                                );
                              }
                              const { label, isRed } = formatCardLabel(cc);
                              return (
                                <div
                                  key={i}
                                  className={`w-6 h-8 rounded-md border flex items-center justify-center text-xs font-bold bg-white text-black`}>
                                  <span
                                    className={`${
                                      isRed ? "text-red-500" : ""
                                    }`}>
                                    {label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {player.is_turn && (
                            <div className="mt-2 text-xs text-yellow-300">
                              Ээлж
                            </div>
                          )}
                          {player.folded && (
                            <div className="mt-1 text-xs text-gray-400">
                              Folded
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="py-4">
                          <div className="w-8 h-8 border-2 border-dashed rounded-full mx-auto mb-2" />
                          <div className="text-xs text-gray-400">Empty</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Controls */}
      {showActions && state.user && (
        <div className="fixed bottom-6 left-4 right-4 md:left-20 md:right-20 bg-secondary rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-gray-400">
              <div>
                Blinds: {formatCurrency(blinds.small)}/
                {formatCurrency(blinds.big)}
              </div>
              <div>Phase: {gamePhase.toUpperCase()}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-300">
                Timer: <span className="font-bold">{actionTimer}s</span>
              </div>
              <div className="text-xs text-accent">
                {isMyTurn ? "Your turn" : "Waiting"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-7">
              <input
                type="range"
                min={blinds.big}
                max={
                  localPlayers.find((p) => p.user_id === state.user?.id)
                    ?.chips || 1000
                }
                value={betAmount}
                onChange={(e) => setBetAmount(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <button
                  onClick={() =>
                    setBetAmount(Math.max(blinds.big, Math.floor(pot / 2)))
                  }
                  className="px-2 py-1 rounded bg-gray-800">
                  1/2 pot
                </button>
                <button
                  onClick={() => setBetAmount(Math.max(blinds.big, pot))}
                  className="px-2 py-1 rounded bg-gray-800">
                  Pot
                </button>
                <button
                  onClick={() =>
                    setBetAmount(
                      localPlayers.find((p) => p.user_id === state.user?.id)
                        ?.chips || 0
                    )
                  }
                  className="px-2 py-1 rounded bg-gray-800">
                  All-in
                </button>
              </div>
            </div>

            <div className="col-span-5 grid grid-cols-3 gap-2">
              <button
                disabled={!isMyTurn}
                onClick={() => handleAction("fold")}
                className="col-span-1 py-3 rounded-lg bg-gray-700 text-white">
                Fold
              </button>
              <button
                disabled={!isMyTurn}
                onClick={() => handleAction("check")}
                className="col-span-1 py-3 rounded-lg bg-gray-700 text-white">
                Check
              </button>
              <button
                disabled={!isMyTurn}
                onClick={() => handleAction("call", betAmount)}
                className="col-span-1 py-3 rounded-lg bg-accent text-white">
                Call {formatCurrency(betAmount)}
              </button>

              <button
                disabled={!isMyTurn}
                onClick={() => handleAction("bet", betAmount)}
                className="col-span-2 py-3 rounded-lg bg-accent/90 text-white">
                Bet/Raise {formatCurrency(betAmount)}
              </button>
              <button
                onClick={() => setShowActions((s) => !s)}
                className="col-span-1 py-3 rounded-lg bg-gray-700 text-white">
                Hide
              </button>

              {/* NEW: Deal / Next Phase / Showdown controls */}
              <button
                onClick={dealHoleCards}
                className="col-span-1 mt-2 py-2 rounded-lg bg-green-600 text-white">
                Deal
              </button>
              <button
                onClick={advancePhase}
                disabled={!isDealt || gamePhase === "showdown"}
                className="col-span-1 mt-2 py-2 rounded-lg bg-yellow-600 text-white">
                Next Phase
              </button>
              <button
                onClick={() => {
                  setLocalPlayers((prev) =>
                    prev.map((p) => ({ ...p, show_cards: true }))
                  );
                  setGamePhase("showdown");
                }}
                className="col-span-1 mt-2 py-2 rounded-lg bg-blue-600 text-white">
                Showdown
              </button>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            <div>Chat and table actions here</div>
            {winners && winners.winners && (
              <div className="mt-2 text-green-300">
                Winner(s):{" "}
                {winners.winners.map((w: any) => w.username).join(", ")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// NEW: shuffle helper to randomize an array
const shuffle = (arr: string[]) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// NEW: buildDeck helper to create a new deck of cards
const buildDeck = () => {
  const suits = ["H", "D", "C", "S"];
  const ranks = Object.keys(RANK_ORDER);
  const deck: string[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push(`${rank}${suit}`);
    }
  }
  return deck;
};

export default PokerTable;
