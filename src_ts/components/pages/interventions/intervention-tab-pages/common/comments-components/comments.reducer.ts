import {Reducer} from 'redux';
import {RootAction} from '../../../../../../redux/store';
import {GenericObject} from '../models/globals.types';
import {InterventionComment} from '../types/types';
import {ADD_COMMENT, SET_COMMENTS, UPDATE_COMMENT} from './comments.actions';

export interface CommentsState {
  comments: GenericObject<InterventionComment[]>;
}

const INITIAL_STATE: CommentsState = {
  comments: {}
};

export const commentsData: Reducer<CommentsState, RootAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_COMMENTS:
      return {
        comments: action.data
      };
    case ADD_COMMENT:
      return {
        comments: {
          ...state.comments,
          [action.relatedTo]: [...(state.comments[action.relatedTo] || []), action.data]
        }
      };
    case UPDATE_COMMENT:
      return {
        comments: {
          ...state.comments,
          [action.relatedTo]: updateComment(state.comments[action.relatedTo], action.data)
        }
      };
    default:
      return state;
  }
};

function updateComment(comments: InterventionComment[] = [], comment: InterventionComment): InterventionComment[] {
  const index: number = comments.findIndex(({id}: InterventionComment) => id === comment.id);
  if (index === -1) {
    console.warn("Comment which you want to update doesn't exists");
    return comments;
  }
  const updatedComments: InterventionComment[] = [...comments];
  updatedComments.splice(index, 1, comment);
  return updatedComments;
}
