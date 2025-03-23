import { Card, CardContent } from "@/components/ui/card";

// Team logos object (replace with actual URLs or local assets as needed)
const teamLogos = {
  "Mumbai Indians": "https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Mumbai_Indians_Logo.svg/1200px-Mumbai_Indians_Logo.svg.png",
  "Chennai Super Kings": "https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/800px-Chennai_Super_Kings_Logo.svg.png",
  "Royal Challengers Bengaluru": "https://1000logos.net/wp-content/uploads/2024/03/Royal-Challengers-Bengaluru-Logo.png",
  "Kolkata Knight Riders": "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Kolkata_Knight_Riders_Logo.svg/1200px-Kolkata_Knight_Riders_Logo.svg.png",
  "Sunrisers Hyderabad": "https://upload.wikimedia.org/wikipedia/en/thumb/5/51/Sunrisers_Hyderabad_Logo.svg/520px-Sunrisers_Hyderabad_Logo.svg.png",
  "Delhi Capitals": "https://upload.wikimedia.org/wikipedia/en/thumb/2/2f/Delhi_Capitals.svg/480px-Delhi_Capitals.svg.png",
  "Rajasthan Royals": "https://upload.wikimedia.org/wikipedia/hi/thumb/6/60/Rajasthan_Royals_Logo.svg/600px-Rajasthan_Royals_Logo.svg.png?20180328051431",
  "Punjab Kings": "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Punjab_Kings_Logo.svg/340px-Punjab_Kings_Logo.svg.png",
  "Lucknow Super Giants": "https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/Lucknow_Super_Giants_IPL_Logo.svg/400px-Lucknow_Super_Giants_IPL_Logo.svg.png",
  "Gujarat Titans": "https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Gujarat_Titans_Logo.svg/500px-Gujarat_Titans_Logo.svg.png",
};

// Helper function to format the date
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = 2025; // Hardcoded to 2025 for consistency
    return `${day} ${month} ${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

// MatchCard component
export const MatchCard = ({
  match,              // Match data object { Match, Home, Away, Date, Time, Day, Venue }
  now,                // Current date/time (e.g., new Date())
  investment,         // Investment state { outcome: "Loss" or "Profit", amount: number }
  bookmarked,         // Boolean indicating if match is bookmarked
  handleBookmark,     // Function to toggle bookmark (receives match.Match)
  handleOutcomeChange,// Function to handle outcome change (receives match.Match, value)
  handleAmountChange  // Function to handle amount change (receives match.Match, value)
}) => {
  // Define match duration (4 hours in milliseconds)
  const duration = 4 * 60 * 60 * 1000; // 4 hours

  // Parse match date and set year to 2025
  const matchDate = new Date(match.Date);
  matchDate.setFullYear(2025);
  const matchDateTimeString = `${matchDate.toDateString()} ${match.Time}`;
  const matchDateTime = new Date(matchDateTimeString);
  const matchEndTime = new Date(matchDateTime.getTime() + duration);

  // Determine match status
  let status;
  if (now < matchDateTime) {
    status = "Upcoming";
  } else if (now >= matchDateTime && now <= matchEndTime) {
    status = "Live";
  } else {
    status = "Completed";
  }

  // Check if match is today or has already occurred
  const isTodayMatch =
    matchDateTime.getDate() === now.getDate() &&
    matchDateTime.getMonth() === now.getMonth() &&
    matchDateTime.getFullYear() === now.getFullYear();
  const hasMatchGone = matchDateTime < now;

  return (
    <Card
      className={`py-4 flex flex-col items-center ${
        isTodayMatch ? "border-2 border-blue-500" : ""
      } ${hasMatchGone ? "opacity-50" : ""}`}
      style={{ transition: "opacity 0.3s ease-in-out" }}
    >
      <CardContent className="p-0 w-full flex flex-col items-center relative">
        {/* Status Badge */}
        <span
          className={`absolute top-[-15px] left-0 px-2  text-xs text-white uppercase z-10 ${
            status === "Live" ? "bg-red-600" :
            status === "Upcoming" ? "bg-green-600" :
            "bg-gray-600"
          } rounded-full shadow-md`}
        >
          {status}
        </span>

        {/* Bookmark Button */}
        <button
          onClick={() => handleBookmark(match.Match)}
          className={`absolute top-[-15px] right-1 text-xl ${
            bookmarked ? "text-yellow-500" : "text-gray-400"
          }`}
        >
          {bookmarked ? "★" : "☆"}
        </button>

        {/* Home Team */}
        <div className="flex items-center mb-2">
          {teamLogos[match.Home] && (
            <img
              src={teamLogos[match.Home]}
              alt={`${match.Home} logo`}
              className="w-8 h-8 object-contain"
            />
          )}
          <span className="md:font-semibold md:text-lg text-md text-center">
            {match.Home}
          </span>
        </div>

        {/* VS */}
        <span className="text-gray-700 font-semibold">vs</span>

        {/* Away Team */}
        <div className="flex items-center mt-2">
          {teamLogos[match.Away] && (
            <img
              src={teamLogos[match.Away]}
              alt={`${match.Away} logo`}
              className="w-8 h-8 object-contain"
            />
          )}
          <span className="md:font-semibold md:text-lg text-md text-center">
            {match.Away}
          </span>
        </div>

        {/* Match Details */}
        <p className="text-center text-gray-600 text-sm mt-2 mb-2">
          {formatDate(match.Date)} ({match.Day}) - {match.Time}
        </p>
        <p className="text-center text-gray-600 text-sm">Venue: {match.Venue}</p>

        {/* Investment Section */}
        <div className="mt-2 w-full">
          <label className="block text-gray-700 text-sm font-bold mb-1 text-center">
            Investment Outcome
          </label>
          <div className="flex justify-around mb-2">
            <div>
              <input
                type="radio"
                id={`loss-${match.Match}`}
                name={`investment-${match.Match}`}
                value="Loss"
                checked={investment.outcome === "Loss"}
                onChange={(e) => handleOutcomeChange(match.Match, e.target.value)}
              />
              <label htmlFor={`loss-${match.Match}`} className="ml-2 text-gray-700 text-sm">
                Loss
              </label>
            </div>
            <div>
              <input
                type="radio"
                id={`profit-${match.Match}`}
                name={`investment-${match.Match}`}
                value="Profit"
                checked={investment.outcome === "Profit"}
                onChange={(e) => handleOutcomeChange(match.Match, e.target.value)}
              />
              <label htmlFor={`profit-${match.Match}`} className="ml-2 text-gray-700 text-sm">
                Profit
              </label>
            </div>
          </div>
          {investment.outcome && (
            <div className="w-full flex items-center justify-center">
              <label
                htmlFor={`amount-${match.Match}`}
                className="block text-gray-700 text-sm font-bold mb-1 text-center"
              >
                Amount (Rs):
              </label>
              <input
                type="number"
                id={`amount-${match.Match}`}
                className="shadow appearance-none border rounded w-[60%] py-1 px-2 mr-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={investment.amount || ""}
                onChange={(e) => handleAmountChange(match.Match, e.target.value)}
                placeholder="Enter amount"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};