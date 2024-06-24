export const SET_FEEDS = (feeds) => {
    return {
      type: "SET_FEEDS",
      feeds: feeds,
    };
  };
  
  export const SET_FEEDS_NULL = () => {
    return {
      type: "SET_FEEDS_NULL",
      feeds: null,
    };
  };

  export const SET_FILTERED_FEEDS = (feeds) => {
    return {
      type: "SET_FILTERED_FEEDS",
      feeds: feeds,
    };
};

export const DELETE_FEED = (id) => {
  return {
    type: "DELETE_FEED",
    id: id,
  };
};