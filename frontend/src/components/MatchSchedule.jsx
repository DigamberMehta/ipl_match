import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FinancialSummary } from "./FinancialSummary";
import { FiltersSection } from "./FiltersSection";
import { MatchCard } from "./MatchCard";

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

  // Load initial states
  useEffect(() => {
    const storedInvestments = localStorage.getItem("matchInvestments");
    const savedBookmarks = localStorage.getItem("bookmarkedMatches");
    
    if (storedInvestments) setMatchInvestments(JSON.parse(storedInvestments));
    if (savedBookmarks) setBookmarkedMatches(JSON.parse(savedBookmarks));
  }, []);

  // Persist changes
  useEffect(() => {
    localStorage.setItem("matchInvestments", JSON.stringify(matchInvestments));
    localStorage.setItem("bookmarkedMatches", JSON.stringify(bookmarkedMatches));
  }, [matchInvestments, bookmarkedMatches]);

  const handleOutcomeChange = (matchId, outcome) => {
    setMatchInvestments(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], outcome },
    }));
  };

  const handleAmountChange = (matchId, amount) => {
    setMatchInvestments(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], amount: parseInt(amount) || 0 },
    }));
  };

  const handleBookmark = (matchId) => {
    setBookmarkedMatches(prev => ({
      ...prev,
      [matchId]: !prev[matchId],
    }));
  };

  const venues = [...new Set(matches.map(match => match.Venue))];
  
  const filteredMatches = matches.filter(match =>
    (teamFilter.length === 0 || teamFilter.includes(match.Home) || teamFilter.includes(match.Away)) &&
    (venueFilter.length === 0 || venueFilter.includes(match.Venue)) &&
    (!showBookmarked || bookmarkedMatches[match.Match])
  );

  const totalProfit = Object.values(matchInvestments).reduce(
    (sum, { outcome, amount }) => (outcome === "Profit" ? sum + (amount || 0) : sum),
    0
  );

  const totalLoss = Object.values(matchInvestments).reduce(
    (sum, { outcome, amount }) => (outcome === "Loss" ? sum + (amount || 0) : sum),
    0
  );

  const netResult = totalProfit - totalLoss;
  const netResultStatus = netResult > 0 ? "Profit" : netResult < 0 ? "Loss" : "Zero";
  const netResultColor = netResult > 0 ? "green" : netResult < 0 ? "red" : "neutral";

  return (
    <Card className="p-6 w-[90%] mx-auto mt-8 shadow-lg">
      <CardContent>
        <h2 className="text-2xl font-bold mb-4 text-center">🏏 IPL 2025 Match Schedule</h2>

        <FinancialSummary
          totalProfit={totalProfit}
          totalLoss={totalLoss}
          netResult={netResult}
          netResultStatus={netResultStatus}
          netResultColor={netResultColor}
        />

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMatches.length > 0 ? (
            filteredMatches.map(match => (
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
            <p className="text-center text-gray-500 py-4">No matches found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}