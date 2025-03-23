import { Badge } from "@/components/ui/badge";

export const FinancialSummary = ({ totalProfit, totalLoss, netResult, netResultStatus, netResultColor }) => {
  return (
    <div className="mb-4 space-y-1 flex justify-around items-center">
      <p className="text-green-500 font-semibold">Total Profit: ₹{totalProfit}</p>
      <p className="text-red-500 font-semibold">Total Loss: ₹{totalLoss}</p>
      <Badge variant={netResultColor}>
        Total: ₹{Math.abs(netResult)} {netResultStatus}
      </Badge>
    </div>
  );
};