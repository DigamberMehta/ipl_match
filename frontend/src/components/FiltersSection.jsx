export const FiltersSection = ({
  teams,
  venues,
  teamFilter,
  venueFilter,
  showBookmarked,
  setTeamFilter,
  setVenueFilter,
  setShowBookmarked,
}) => {
  return (
    <div className="space-y-6 mb-6">
      {/* Show Bookmarked Checkbox */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showBookmarked}
            onChange={(e) => setShowBookmarked(e.target.checked)}
            className="h-5 w-5 accent-blue-500"
          />
          <span className="text-sm font-medium">Show Bookmarked Matches Only</span>
        </label>
      </div>

      {/* Team Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg">Filter by Teams</h3>
          {teamFilter.length > 0 && (
            <button
              onClick={() => setTeamFilter([])}
              className="text-sm text-red-500 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
          {teams.map((team) => (
            <label key={team} className="flex items-start space-x-2 w-full">
              <input
                type="checkbox"
                checked={teamFilter.includes(team)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTeamFilter([...teamFilter, team]);
                  } else {
                    setTeamFilter(teamFilter.filter((t) => t !== team));
                  }
                }}
                className="h-5 w-5 accent-blue-500 flex-shrink-0"
              />
              <span className="text-sm break-words min-w-0">{team}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Venue Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg">Filter by Venues</h3>
          {venueFilter.length > 0 && (
            <button
              onClick={() => setVenueFilter([])}
              className="text-sm text-red-500 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
          {venues.map((venue) => (
            <label key={venue} className="flex items-start space-x-2 w-full">
              <input
                type="checkbox"
                checked={venueFilter.includes(venue)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setVenueFilter([...venueFilter, venue]);
                  } else {
                    setVenueFilter(venueFilter.filter((v) => v !== venue));
                  }
                }}
                className="h-5 w-5 accent-blue-500 flex-shrink-0"
              />
              <span className="text-sm break-words min-w-0">{venue}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
