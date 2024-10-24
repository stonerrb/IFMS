
function processFloorData(data) {
    // Parse the JSON string if needed
    const entries = Array.isArray(data) ? data : JSON.parse(data);
  
    // Group by floor ID
    const groupedByFloorId = entries.reduce((acc, entry) => {
      if (!acc[entry.id]) {
        acc[entry.id] = [];
      }
      acc[entry.id].push(entry);
      return acc;
    }, {});
  
    // Get latest version of each floor
    const uniqueFloors = Object.values(groupedByFloorId).map((floors) => {
      return floors.reduce((latest, current) => {
        const latestDate = new Date(latest.lastModified);
        const currentDate = new Date(current.lastModified);
        return currentDate > latestDate ? current : latest;
      });
    });
  
    // Sort by lastModified
    return uniqueFloors.sort(
      (a, b) => new Date(b.lastModified) - new Date(a.lastModified)
    );
  }

module.exports = {
    processFloorData
}