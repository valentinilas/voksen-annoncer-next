export const formatDate = (dateStr) => {
    try {
       
 
      // Parse the date string
      const date = new Date(dateStr);
  
      // Check if the date is valid
      if (isNaN(date)) {
        throw new Error("Invalid date string");
      }
  
      // Format the date to a user-friendly format
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        // hour: 'numeric', 
        // minute: 'numeric', 
      };
  
      const formattedDate = date.toLocaleString('da-DK', options);
      return formattedDate;
  
    } catch (error) {
      console.error("Error formatting date:", error.message);
      return "Invalid date";
    }
  };

