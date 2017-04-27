import R from 'ramda'

import * as types from '../constants/ActionTypes'

const initialState = {
  isLoading: false,
  isLoaded: false,
  selected: [],
  isAllSelected: false,
  count: 0,
  ids: []
}

function filesReducer(state = initialState, action) {
  switch(action.type) {

  case types.FETCH_FILES + '_PENDING':
    return R.merge(state, {
      isLoading: true,
      isLoaded: false
    })
  case types.FETCH_FILES + '_FULFILLED':
    return R.merge(state, {
      isLoading: false,
      isLoaded: true,
      count: action.payload.count,
      ids: action.payload.results.result
    })
  case types.CREATE_FILE + '_FULFILLED':
    return R.merge(state,{
      count: state.count++,
      ids: R.append(action.payload.result.result, state.ids)
    })
  case types.DELETE_FILES + '_FULFILLED':
    return R.merge(state, {
      ids: R.without(action.payload, state.ids)
    })
  case types.CLEAR_FILES:
    return R.merge(state, {
      isLoaded: false,
      ids: []
    })
  case types.TOGGLE_FILE:{
    let index = R.findIndex(R.equals(action.id), state.selected)
    return R.merge(state, {
      selected: index > -1 ? R.remove(index, 1, state.selected) : R.append(action.id, state.selected)
    })
  }
  case types.TOGGLE_ALL_FILES:
    return R.merge(state, {
      selected: state.isAllSelected ? [] : action.ids,
      isAllSelected: !state.isAllSelected
    })
  case types.CLEAR_SELECTED_FILES:
    return R.merge(state , {
      selected: [],
      isAllSelected: false
    })
  default:
    return state
  }

}

export default filesReducer