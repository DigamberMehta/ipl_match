export const FiltersSection = ({
    teams,
    venues,
    teamFilter,
    venueFilter,
    showBookmarked,
    setTeamFilter,
    setVenueFilter,
    setShowBookmarked
  }) => {
    return (
      <div className="space-y-6 mb-6">
        <div className="flex justify-end">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showBookmarked}
              onChange={(e) => setShowBookmarked(e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm">Show Bookmarked Matches Only</span>
          </label>
        </div>
  
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Filter by Teams</h3>
            {teamFilter.length > 0 && (
              <button
                onClick={() => setTeamFilter([])}
                className="text-sm text-red-500 hover:underline"
              >
                Clear Teams
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            {teams.map((team) => (
              <label key={team} className="flex items-center space-x-2">
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
                  className="h-4 w-4"
                />
                <span className="text-sm">{team}</span>
              </label>
            ))}
          </div>
        </div>
  
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Filter by Venues</h3>
            {venueFilter.length > 0 && (
              <button
                onClick={() => setVenueFilter([])}
                className="text-sm text-red-500 hover:underline"
              >
                Clear Venues
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            {venues.map((venue) => (
              <label key={venue} className="flex items-center space-x-2">
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
                  className="h-4 w-4"
                />
                <span className="text-sm">{venue}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };