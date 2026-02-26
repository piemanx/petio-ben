import { createSlice } from "@reduxjs/toolkit";
import * as types from "../actionTypes";

const initialState = {
  user_roles: {
    permissions: [],
    rules: [],
    seen_clients: [],
    blocked_clients: [],
    id: false,
    username: false,
    owner: false,
    __v: 0,
  },
  logged_in: false,
  servers: false,
  config: "pending",
  activeServer: false,
  popular: {},
  movie_lookup: {},
  series_lookup: {},
  season_lookup: {},
  person_lookup: {},
  search_results: {
    movies: [],
    series: [],
    people: [],
    companies: [],
  },
  actor_movie: {},
  actor_series: {},
  actor_cache: {},
};

const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(types.MB_LOGIN, (state, action) => {
        state.current_user = {
          username: action.username,
          email: action.email,
          thumb: action.thumb,
        };
        state.servers = action.servers;
        state.logged_in = true;
      })
      .addCase(types.MB_USER_ROLES, (state, action) => {
        state.user_roles = action.user;
      })
      .addCase(types.MB_CONFIG_SETUP_START, (state) => {
        state.config = false;
      })
      .addCase(types.MB_CONFIG_LOADED, (state, action) => {
        state.config = action.config;
      })
      .addCase(types.MB_CONFIG_SETUP_END, (state, action) => {
        state.config = action.config;
      })
      .addCase(types.MB_ACTIVE_SERVER, (state, action) => {
        state.activeServer = action.server;
      })
      .addCase(types.POPULAR, (state, action) => {
        state.popular = action.popular;
        state.updated = true;
      })
      .addCase(types.SEARCH, (state, action) => {
        state.search_results = {
          movies: action.movies,
          series: action.series,
          people: action.people,
          companies: action.companies,
        };
      })
      .addCase(types.MOVIE_LOOKUP, (state, action) => {
        let creditCache = {};
        if (action.movie?.credits) {
          Object.keys(action.movie.credits).forEach((key) => {
            Object.keys(action.movie.credits[key]).forEach((skey) => {
              creditCache[action.movie.credits[key][skey].id] =
                action.movie.credits[key][skey];
            });
          });
        }
        state.movie_lookup[action.id] = action.movie;
        state.actor_cache.creditCache = creditCache;
        state.updated = true;
      })
      .addCase(types.PERSON_LOOKUP, (state, action) => {
        state.person_lookup[action.id] = action.person;
        state.updated = true;
      })
      .addCase(types.SERIES_LOOKUP, (state, action) => {
        let creditCacheS = {};
        if (action.series?.credits) {
          Object.keys(action.series.credits).forEach((key) => {
            Object.keys(action.series.credits[key]).forEach((skey) => {
              creditCacheS[action.series.credits[key][skey].id] =
                action.series.credits[key][skey];
            });
          });
        }
        state.series_lookup[action.id] = action.series;
        state.actor_cache.creditCacheS = creditCacheS;
        state.updated = true;
      })
      .addCase(types.SEASON_LOOKUP, (state, action) => {
        state.season_lookup[`${action.series}_s${action.season}`] = action.data;
      })
      .addCase(types.STORE_ACTOR_MOVIE, (state, action) => {
        state.actor_movie[action.id] = {
          cast: action.cast,
          crew: action.crew,
        };
        state.updated = true;
      })
      .addCase(types.STORE_ACTOR_SERIES, (state, action) => {
        state.actor_series[action.id] = {
          cast: action.cast,
          crew: action.crew,
        };
        state.updated = true;
      });
  },
});

export default apiSlice.reducer;
