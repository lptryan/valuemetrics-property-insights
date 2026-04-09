import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface NeighborhoodData {
  medianPricePerSqft: number;
  avgDaysOnMarket: number;
  activeListings: number;
  priceTrend3Month: number; // percentage
  trendData: { month: string; median: number }[];
}

interface NeighborhoodModuleProps {
  data: NeighborhoodData;
}

const NeighborhoodModule = ({ data }: NeighborhoodModuleProps) => {
  const trendPositive = data.priceTrend3Month >= 0;

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-5">
      <h3 className="text-lg font-bold text-navy">Neighborhood Snapshot</h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat
          label="Median $/SqFt"
          value={`$${data.medianPricePerSqft}`}
        />
        <Stat
          label="Avg Days on Market"
          value={String(data.avgDaysOnMarket)}
        />
        <Stat
          label="Active Listings"
          value={String(data.activeListings)}
        />
        <Stat
          label="3-Month Trend"
          value={`${trendPositive ? "+" : ""}${data.priceTrend3Month}%`}
          valueColor={trendPositive ? "text-emerald-600" : "text-red-500"}
        />
      </div>

      {/* Sparkline */}
      <div className="h-[100px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.trendData}>
            <defs>
              <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(199, 95%, 60%)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(199, 95%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
            <Area
              type="monotone"
              dataKey="median"
              stroke="hsl(199, 95%, 60%)"
              strokeWidth={2}
              fill="url(#sparkFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-mid">12-month median price trend</p>
    </div>
  );
};

const Stat = ({
  label,
  value,
  valueColor = "text-navy",
}: {
  label: string;
  value: string;
  valueColor?: string;
}) => (
  <div>
    <p className="text-xs text-mid mb-1">{label}</p>
    <p
      className={`text-lg font-bold ${valueColor}`}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {value}
    </p>
  </div>
);

export default NeighborhoodModule;
