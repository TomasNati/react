import React from 'react';
import { type Stories } from './api';
import Check from './check.svg?react';
import { type SortStatus } from './reducer';

interface ItemListProps {
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
  onRemoveClicked: () => void;
  onEditClicked: () => void;
}

export const ItemList = ({ url, title, author, num_comments, points, onRemoveClicked, onEditClicked }: ItemListProps) => {
  return (
    <li className='item'>
      <span style={{ width: '40%' }}><a href={url} target="_blank">{title}</a></span>
      <span style={{ width: '23%' }}><p>{author}</p></span>
      <span style={{ width: '15%' }}><p>{num_comments}</p></span>
      <span style={{ width: '12%' }}><p>{points}</p></span>
      <span style={{ width: '10%' }}>
        <button onClick={onRemoveClicked}>
          <Check height="18px" width="18px" />
        </button>
        <button onClick={onEditClicked}>Edit</button>
      </span>
      <br />
      <br />
    </li>
  )
}

interface ListProps {
  list: Stories[];
  sortStatus: SortStatus[];
  onRemoveClicked: (objectID: number) => void
  onEditClicked: (objectID: number) => void;
  onSort: (field: keyof Stories) => void;
}
export const List = React.memo(({ list, sortStatus, onRemoveClicked, onEditClicked, onSort }: ListProps) => {
  // rest operator on the left, {objectID,...item}, destructure objectID current element in the list, 
  //   assigning the rest of the properties to a new object, 'item'.
  // spread operator on the right, ...item, creates key=value pairs for each operator in item object

  const getColumnHeader = (column: keyof Stories) => {
    const sortInfo = sortStatus.find(({ field }) => field === column)
    return sortInfo?.ascending ? ' ↑' : sortInfo?.ascending === false ? ' ↓' : ''
  }

  return (
    <ul>
      <li className='header'>
        <span style={{ width: '40%' }}><p onClick={() => onSort('title')}>{`Title ${getColumnHeader('title')}`}</p></span>
        <span style={{ width: '23%' }}><p onClick={() => onSort('author')}>{`Authors ${getColumnHeader('author')}`}</p></span>
        <span style={{ width: '15%' }}><p onClick={() => onSort('num_comments')}>{`Number of comments ${getColumnHeader('num_comments')}`}</p></span>
        <span style={{ width: '12%' }}><p onClick={() => onSort('points')}>{`Points ${getColumnHeader('points')}`}</p></span>
        <span style={{ width: '10%' }} />
        <br />
        <br />
      </li>
      {list.map(({ objectID, ...item }) => (
        <ItemList
          onRemoveClicked={() => onRemoveClicked(objectID)}
          onEditClicked={() => onEditClicked(objectID)}
          {...item}
        />
      ))}
    </ul>
  )
})
