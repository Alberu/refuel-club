import React, { useState } from "react";
import {
  Brain,
  Loader2,
  Sparkles,
  Activity,
  Dumbbell,
  Heart,
  Flame,
  UtensilsCrossed,
  UserRound,
  Leaf,
  ShieldAlert,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

const MENU = [
  {
    id: "med-power-bowl",
    name: "Mediterranean Power Bowl",
    price: 7.95,
    kcal: 480,
    protein: 15,
    carbs: 58,
    fat: 20,
    tags: ["vegetarian", "general"],
    allergens: [],
  },
  {
    id: "protein-chicken-salad",
    name: "Protein Boost Chicken Salad",
    price: 7.5,
    kcal: 430,
    protein: 38,
    carbs: 10,
    fat: 25,
    tags: ["muscle-gain", "general"],
    allergens: [],
  },
  {
    id: "vegan-sweet-potato",
    name: "Vegan Sweet Potato Bowl",
    price: 6.95,
    kcal: 520,
    protein: 18,
    carbs: 60,
    fat: 20,
    tags: ["vegan", "general", "endurance"],
    allergens: [],
  },
  {
    id: "chicken-wrap",
    name: "High-Protein Chicken Wrap",
    price: 6.5,
    kcal: 420,
    protein: 35,
    carbs: 45,
    fat: 12,
    tags: ["muscle-gain", "general"],
    allergens: [],
  },
  {
    id: "salmon-avocado",
    name: "Salmon & Avocado Sandwich",
    price: 8.5,
    kcal: 450,
    protein: 28,
    carbs: 40,
    fat: 18,
    tags: ["general"],
    allergens: ["fish"],
  },
  {
    id: "brown-rice-chicken",
    name: "Brown Rice Chicken Bowl",
    price: 6.95,
    kcal: 520,
    protein: 35,
    carbs: 55,
    fat: 15,
    tags: ["muscle-gain", "endurance", "general"],
    allergens: [],
  },
  {
    id: "quinoa-salmon",
    name: "Quinoa & Salmon Plate",
    price: 9.5,
    kcal: 560,
    protein: 32,
    carbs: 45,
    fat: 22,
    tags: ["general"],
    allergens: ["fish"],
  },
  {
    id: "berry-protein",
    name: "Berry Protein Smoothie",
    price: 7.95,
    kcal: 350,
    protein: 35,
    carbs: 45,
    fat: 4,
    tags: ["muscle-gain", "vegetarian", "endurance"],
    allergens: ["dairy"],
  },
  {
    id: "pb-recovery",
    name: "Peanut Butter Recovery Shake",
    price: 6.5,
    kcal: 430,
    protein: 40,
    carbs: 40,
    fat: 14,
    tags: ["muscle-gain"],
    allergens: ["peanut", "dairy"],
  },
  {
    id: "green-energy",
    name: "Green Energy Smoothie",
    price: 5.95,
    kcal: 300,
    protein: 20,
    carbs: 40,
    fat: 4,
    tags: ["vegetarian", "general"],
    allergens: ["dairy"],
  },
  {
    id: "iced-coffee-protein",
    name: "Iced Coffee Protein Shake",
    price: 6.5,
    kcal: 210,
    protein: 25,
    carbs: 20,
    fat: 3,
    tags: ["general", "caffeine"],
    allergens: ["dairy"],
  },
  {
    id: "espresso-shot",
    name: "Espresso Shot",
    price: 2.0,
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    tags: ["general", "caffeine"],
    allergens: [],
  },
  {
    id: "preworkout-hydration",
    name: "Pre-Workout Hydration",
    price: 2.5,
    kcal: 15,
    protein: 0,
    carbs: 4,
    fat: 0,
    tags: ["endurance"],
    allergens: [],
  },
  {
    id: "matcha-protein-latte",
    name: "Matcha Protein Latte",
    price: 5.95,
    kcal: 180,
    protein: 20,
    carbs: 15,
    fat: 4,
    tags: ["general", "caffeine"],
    allergens: ["dairy"],
  },
];

function scoreItem(input, item) {
  let score = 0;
  const { workout, goal } = input;
  if (workout === "endurance")
    score +=
      map(item.carbs, 0, 70) * 40 + (item.tags.includes("endurance") ? 6 : 0);
  if (workout === "strength")
    score +=
      map(item.protein, 0, 50) * 40 +
      (item.tags.includes("muscle-gain") ? 6 : 0);
  if (workout === "balance" || workout === "flexibility")
    score += balance(item) * 35;
  if (goal === "general") score += balance(item) * 25;
  if (goal === "endurance-goal") score += map(item.carbs, 0, 70) * 22;
  if (goal === "weight-loss")
    score +=
      (1 - map(item.kcal, 150, 650)) * 28 + (1 - map(item.fat, 0, 25)) * 12;
  return { score, reason: reasonLine(workout, goal, item) };
}

function map(x, min, max) {
  const c = Math.max(min, Math.min(max, x));
  return (c - min) / (max - min || 1);
}
function balance(item) {
  const p = item.protein / (item.kcal / 4 || 1);
  const c = item.carbs / (item.kcal / 4 || 1);
  const f = item.fat / (item.kcal / 9 || 1);
  const ideal = { p: 0.3, c: 0.45, f: 0.25 };
  const dist =
    Math.abs(p - ideal.p) + Math.abs(c - ideal.c) + Math.abs(f - ideal.f);
  return 1 - Math.min(1, dist);
}
function reasonLine(workout, goal, item) {
  if (workout === "strength") return "Higher protein for strength sessions";
  if (workout === "endurance") return "Carb support for endurance";
  if (goal === "weight-loss") return "Lower kcal and lighter fats";
  return "Balanced choice for general health";
}

export default function RefuelKioskMVP() {
  const [input, setInput] = useState({
    workout: "endurance",
    goal: "general",
    age: 25,
    dietary: "none",
    allergen: "none",
  });
  const [top3, setTop3] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("form");
  const [selected, setSelected] = useState(null);

  const filtered = (item) => {
    if (
      input.dietary === "vegetarian" &&
      !(item.tags.includes("vegetarian") || item.tags.includes("vegan"))
    )
      return false;
    if (input.dietary === "vegan" && !item.tags.includes("vegan")) return false;
    if (input.allergen !== "none" && item.allergens.includes(input.allergen))
      return false;
    return true;
  };

  const handleOrder = () => {
    setLoading(true);
    setTimeout(() => {
      const ranked = MENU.filter(filtered)
        .map((it) => ({ it, ...scoreItem(input, it) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      setTop3(ranked);
      setSelected(null);
      setLoading(false);
      setPhase("results");
    }, 250);
  };

  const confirm = () => {
    if (!selected) return;
    setPhase("confirmed");
  };

  const reset = () => {
    setPhase("form");
    setSelected(null);
    setTop3(null);
  };

  return (
    <div className="min-h-screen bg-[#F2F5F1] text-[#1D2A22] p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-[#6BBF59]" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Refuel Club
            </h1>
          </div>
        </header>

        {phase === "form" && (
          <div className="rounded-3xl border border-[#CFE3C7] bg-white p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Panel
                title="WORKOUT TYPE"
                icon={<Activity className="w-5 h-5" />}
              >
                <TileGrid
                  value={input.workout}
                  onChange={(v) => setInput({ ...input, workout: v })}
                  options={[
                    {
                      value: "endurance",
                      label: "Endurance",
                      icon: <Activity className="w-5 h-5" />,
                    },
                    {
                      value: "strength",
                      label: "Strength",
                      icon: <Dumbbell className="w-5 h-5" />,
                    },
                    {
                      value: "balance",
                      label: "Balance",
                      icon: <Heart className="w-5 h-5" />,
                    },
                    {
                      value: "flexibility",
                      label: "Flexibility",
                      icon: <Flame className="w-5 h-5" />,
                    },
                  ]}
                />
              </Panel>

              <Panel
                title="NUTRITION GOAL"
                icon={<Heart className="w-5 h-5" />}
              >
                <TileGrid
                  value={input.goal}
                  onChange={(v) => setInput({ ...input, goal: v })}
                  options={[
                    {
                      value: "general",
                      label: "General Health",
                      icon: <Heart className="w-5 h-5" />,
                    },
                    {
                      value: "endurance-goal",
                      label: "Endurance",
                      icon: <Activity className="w-5 h-5" />,
                    },
                    {
                      value: "weight-loss",
                      label: "Weight Loss",
                      icon: <Flame className="w-5 h-5" />,
                    },
                  ]}
                />
              </Panel>

              <Panel title="AGE" icon={<UserRound className="w-5 h-5" />}>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={10}
                    max={80}
                    value={input.age}
                    onChange={(e) =>
                      setInput({ ...input, age: Number(e.target.value) })
                    }
                    className="w-full accent-[#6BBF59]"
                  />
                  <div className="text-xl font-semibold min-w-[64px]">
                    {input.age}
                  </div>
                </div>
              </Panel>

              <Panel title="DIETARY" icon={<Leaf className="w-5 h-5" />}>
                <Select
                  value={input.dietary}
                  onChange={(v) => setInput({ ...input, dietary: v })}
                  options={[
                    { value: "none", label: "None" },
                    { value: "vegetarian", label: "Vegetarian" },
                    { value: "vegan", label: "Vegan" },
                  ]}
                />
                <div className="mt-3 text-xs text-[#6C8D7B]">
                  Allergen filter
                </div>
                <Select
                  value={input.allergen}
                  onChange={(v) => setInput({ ...input, allergen: v })}
                  options={[
                    { value: "none", label: "None" },
                    { value: "peanut", label: "Peanut" },
                    { value: "dairy", label: "Dairy" },
                    { value: "fish", label: "Fish" },
                  ]}
                />
              </Panel>
            </div>

            <button
              onClick={handleOrder}
              className="w-full mt-6 px-6 py-4 rounded-2xl text-xl bg-[#6BBF59] hover:bg-[#5AA84C] transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Brain className="w-5 h-5" />
              )}{" "}
              ORDER
            </button>
          </div>
        )}

        {phase === "results" && (
          <div className="rounded-3xl border border-[#CFE3C7] bg-white p-6">
            <div className="grid md:grid-cols-3 gap-4">
              {top3 &&
                top3.map((r, i) => (
                  <Card
                    key={r.it.id}
                    rank={i + 1}
                    item={r.it}
                    reason={r.reason}
                    selected={selected?.id === r.it.id}
                    onSelect={() => setSelected(r.it)}
                  />
                ))}
            </div>
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={reset}
                className="px-4 py-3 rounded-xl border text-sm flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Back
              </button>
              <button
                disabled={!selected}
                onClick={confirm}
                className="px-6 py-3 rounded-xl text-base bg-[#6BBF59] hover:bg-[#5AA84C] disabled:opacity-50 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm Order
              </button>
            </div>
          </div>
        )}

        {phase === "confirmed" && (
          <div className="rounded-3xl border border-[#CFE3C7] bg-white p-10 text-center">
            <div className="text-3xl font-semibold mb-2">Order placed</div>
            <div className="text-xl">
              You have now ordered{" "}
              <span className="font-bold">{selected?.name}</span>
            </div>
            <button
              onClick={reset}
              className="mt-6 px-6 py-3 rounded-xl text-base bg-[#6BBF59] hover:bg-[#5AA84C]"
            >
              Start new order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Panel({ title, icon, children }) {
  return (
    <div className="rounded-2xl border border-[#E3EDE0] bg-[#F7FBF6] p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[#4F705E] mb-3">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function TileGrid({ value, onChange, options }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3 py-4 rounded-xl border flex items-center justify-center gap-2 text-base ${
            value === o.value
              ? "bg-[#6BBF59] border-[#6BBF59] text-white"
              : "bg-white hover:bg-[#F1F6EF]"
          }`}
        >
          {o.icon}
          <span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      className="w-full border rounded-xl px-3 py-3 bg-white"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Card({ rank, item, reason, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`text-left rounded-xl border ${
        selected ? "border-[#6BBF59] ring-2 ring-[#6BBF59]" : "border-[#E3EDE0]"
      } bg-[#F7FBF6] p-4`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#6BBF59] font-semibold">#{rank}</span>
          <div className="font-medium">{item.name}</div>
        </div>
        <div className="text-sm font-semibold">£{item.price.toFixed(2)}</div>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
        <Metric label="kcal" value={item.kcal} />
        <Metric label="P" value={`${item.protein}g`} />
        <Metric label="C" value={`${item.carbs}g`} />
        <Metric label="F" value={`${item.fat}g`} />
      </div>
      <div className="mt-2 text-sm text-[#51685B] flex items-center gap-2">
        <UtensilsCrossed className="w-4 h-4" />
        {reason}
      </div>
    </button>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg bg-white border p-2 text-center">
      <div className="text-[#6C8D7B] text-[11px]">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
