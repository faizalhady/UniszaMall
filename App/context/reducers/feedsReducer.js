const feedsReducer = (state = null, action) => {
    switch (action.type) {
      case "SET_FEEDS":
        return {
          ...state,
          feeds: action.feeds,
        };
  
      case "SET_FEEDS_NULL":
        return {
          ...state,
          feeds: null,
        };
        case "SET_FILTERED_FEEDS":
          return {
            ...state,
            filteredFeeds: action.feeds,
          };
          case "DELETE_FEED":
            return {
              ...state,
              filteredFeeds: state.filteredFeeds.filter(feed => feed._id !== action.id),
            };
     
  
      default:
        return state;
    }
  };
  
  export default feedsReducer;