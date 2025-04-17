import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FinancialSummary } from "./FinancialSummary";
import { FiltersSection } from "./FiltersSection";
import { MatchCard } from "./MatchCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const teams = [
  "Mumbai Indians",
  "Chennai Super Kings",
  "Royal Challengers Bengaluru",
  "Kolkata Knight Riders",
  "Sunrisers Hyderabad",
  "Delhi Capitals",
  "Rajasthan Royals",
  "Punjab Kings",
  "Lucknow Super Giants",
  "Gujarat Titans",
];

export default function MatchSchedule({ matches }) {
  const [teamFilter, setTeamFilter] = useState([]);
  const [venueFilter, setVenueFilter] = useState([]);
  const [now] = useState(new Date());
  const [matchInvestments, setMatchInvestments] = useState({});
  const [bookmarkedMatches, setBookmarkedMatches] = useState({});
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [casinoEntries, setCasinoEntries] = useState([]);
  const [isCasinoDialogOpen, setIsCasinoDialogOpen] = useState(false);
  const [newCasinoEntry, setNewCasinoEntry] = useState({ description: "", amount: 0, type: "Profit", date: "" });
  const [editCasinoEntry, setEditCasinoEntry] = useState(null);

  useEffect(() => {
    const storedInvestments = localStorage.getItem("matchInvestments");
    const savedBookmarks = localStorage.getItem("bookmarkedMatches");
    const storedCasinoEntries = localStorage.getItem("casinoEntries");

    if (storedInvestments) setMatchInvestments(JSON.parse(storedInvestments));
    if (savedBookmarks) setBookmarkedMatches(JSON.parse(savedBookmarks));
    if (storedCasinoEntries) setCasinoEntries(JSON.parse(storedCasinoEntries) || []);
  }, []);

  useEffect(() => {
    localStorage.setItem("matchInvestments", JSON.stringify(matchInvestments));
    localStorage.setItem("bookmarkedMatches", JSON.stringify(bookmarkedMatches));
    localStorage.setItem("casinoEntries", JSON.stringify(casinoEntries));
  }, [matchInvestments, bookmarkedMatches, casinoEntries]);

  const handleOutcomeChange = (matchId, outcome) => {
    setMatchInvestments((prev) => ({
      ...prev,
      [matchId]: { ...prev[matchId], outcome },
    }));
  };

  const handleAmountChange = (matchId, amount) => {
    setMatchInvestments((prev) => ({
      ...prev,
      [matchId]: { ...prev[matchId], amount: parseInt(amount) || 0 },
    }));
  };

  const handleBookmark = (matchId) => {
    setBookmarkedMatches((prev) => ({
      ...prev,
      [matchId]: !prev[matchId],
    }));
  };

  const venues = [...new Set(matches.map((match) => match.Venue))];

  const filteredMatches = matches.filter(
    (match) =>
      (teamFilter.length === 0 || teamFilter.includes(match.Home) || teamFilter.includes(match.Away)) &&
      (venueFilter.length === 0 || venueFilter.includes(match.Venue)) &&
      (!showBookmarked || bookmarkedMatches[match.Match])
  );

  const totalMatchProfit = Object.values(matchInvestments).reduce(
    (sum, { outcome, amount }) => (outcome === "Profit" ? sum + (amount || 0) : sum),
    0
  );
  const totalMatchLoss = Object.values(matchInvestments).reduce(
    (sum, { outcome, amount }) => (outcome === "Loss" ? sum + (amount || 0) : sum),
    0
  );
  const netMatchResult = totalMatchProfit - totalMatchLoss;

  const totalCasinoProfit = casinoEntries.reduce((sum, entry) => (entry.type === "Profit" ? sum + (entry.amount || 0) : sum), 0);
  const totalCasinoLoss = casinoEntries.reduce((sum, entry) => (entry.type === "Loss" ? sum + (entry.amount || 0) : sum), 0);
  const netCasinoResult = totalCasinoProfit - totalCasinoLoss;

  const netResult = netMatchResult + netCasinoResult;
  const netResultStatus = netResult > 0 ? "Profit" : netResult < 0 ? "Loss" : "Zero";
  const netResultColor = netResult > 0 ? "text-green-600" : netResult < 0 ? "text-red-600" : "text-gray-600";

  const handleOpenCasinoDialog = () => {
    setIsCasinoDialogOpen(true);
    setEditCasinoEntry(null);
    setNewCasinoEntry({ description: "", amount: 0, type: "Profit", date: "" });
  };

  const handleCloseCasinoDialog = () => {
    setIsCasinoDialogOpen(false);
  };

  const handleCasinoEntryChange = (e) => {
    const { name, value } = e.target;
    setNewCasinoEntry((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseInt(value) || 0 : value,
    }));
  };

  const handleAddCasinoEntry = () => {
    const currentDateTime = new Date().toLocaleString();
    const updatedEntry = { ...newCasinoEntry, date: currentDateTime };
    if (editCasinoEntry) {
      setCasinoEntries((prev) =>
        prev.map((entry) => (entry === editCasinoEntry ? updatedEntry : entry))
      );
    } else {
      setCasinoEntries((prev) => [...prev, updatedEntry]);
    }
    handleCloseCasinoDialog();
  };

  const handleEditCasinoEntry = (entry) => {
    setEditCasinoEntry(entry);
    setNewCasinoEntry({ ...entry });
    setIsCasinoDialogOpen(true);
  };

  const handleDeleteCasinoEntry = (entryToDelete) => {
    setCasinoEntries((prev) => prev.filter((entry) => entry !== entryToDelete));
  };

  return (
    <Card className="md:p-6 w-full md:w-[90%] mx-auto mt-8 shadow-lg rounded-xl">
      <CardContent className="!p-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">🏏 IPL 2025 Match Schedule</h2>
        
        {/* Financial Summary UI */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Financial Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Matches</p>
              <p className="text-lg font-medium text-green-600">Profit: ₹{totalMatchProfit}</p>
              <p className="text-lg font-medium text-red-600">Loss: ₹{totalMatchLoss}</p>
              <p className="text-sm font-semibold mt-2">Net: ₹{netMatchResult}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Casino</p>
              <p className="text-lg font-medium text-green-600">Profit: ₹{totalCasinoProfit}</p>
              <p className="text-lg font-medium text-red-600">Loss: ₹{totalCasinoLoss}</p>
              <p className="text-sm font-semibold mt-2">Net: ₹{netCasinoResult}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Combined</p>
              <p className={`text-2xl font-bold ${netResultColor}`}>
                {netResultStatus}: ₹{Math.abs(netResult)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center mb-6">
          <button
            onClick={handleOpenCasinoDialog}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            Add Casino Entry
          </button>
        </div>

        <FiltersSection
          teams={teams}
          venues={venues}
          teamFilter={teamFilter}
          venueFilter={venueFilter}
          showBookmarked={showBookmarked}
          setTeamFilter={setTeamFilter}
          setVenueFilter={setVenueFilter}
          setShowBookmarked={setShowBookmarked}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((match) => (
              <MatchCard
                key={match.Match}
                match={match}
                now={now}
                investment={matchInvestments[match.Match] || {}}
                bookmarked={bookmarkedMatches[match.Match]}
                handleBookmark={handleBookmark}
                handleOutcomeChange={handleOutcomeChange}
                handleAmountChange={handleAmountChange}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-4 col-span-full">No matches found</p>
          )}
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Casino Entries</h3>
          {casinoEntries.length > 0 ? (
            <ul className="space-y-3">
              {casinoEntries.map((entry, index) => (
                <li key={index} className="flex flex-col bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">{entry.description}</span>
                    <span className={entry.type === "Profit" ? "text-green-600" : "text-red-600"}>
                      {entry.type}: ₹{entry.amount}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Date: {entry.date}</div>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleEditCasinoEntry(entry)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-3 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCasinoEntry(entry)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No casino entries added.</p>
          )}
        </div>

        {/* Dialog UI */}
        <Dialog open={isCasinoDialogOpen} onOpenChange={setIsCasinoDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-800">
                {editCasinoEntry ? "Edit Casino Entry" : "Add Casino Entry"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  name="description"
                  value={newCasinoEntry.description}
                  onChange={handleCasinoEntryChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter description"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={newCasinoEntry.amount}
                  onChange={handleCasinoEntryChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select
                  name="type"
                  value={newCasinoEntry.type}
                  onChange={handleCasinoEntryChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Profit">Profit</option>
                  <option value="Loss">Loss</option>
                </select>
              </div>
            </div>
            <DialogFooter className="flex justify-end space-x-3">
              <button
                onClick={handleCloseCasinoDialog}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCasinoEntry}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                {editCasinoEntry ? "Update Entry" : "Add Entry"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}