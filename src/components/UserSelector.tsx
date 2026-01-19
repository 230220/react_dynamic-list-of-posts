import React, { useCallback, useEffect, useRef, useState } from 'react';
import { User } from '../types/User';
import cn from 'classnames';

type Props = {
  users: User[] | null;
  selectedUser: User | null;
  onSelectedUser: (user: User | null) => void;
};

export const UserSelector: React.FC<Props> = ({
  users,
  selectedUser,
  onSelectedUser,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null); //клик внутри или снаружи

  const handleButtonClick = () => {
    setIsOpen(prev => !prev);
  }; //нажатие - открыли - закрыли список

  const handleOutside = useCallback(
    (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current && // DOM-элемент dropdown существует
        !dropdownRef.current.contains(event.target as Node) // клик вне dropdown
      ) {
        setIsOpen(false);
      }
    },
    [isOpen],
  );

  useEffect(() => {
    document.addEventListener('click', handleOutside);

    return () => {
      document.removeEventListener('click', handleOutside);
    };
  }, [handleOutside]);
  {
    /*
    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const userId = Number(event.target.value);

      if (!userId) {
        onSelectedUser(null);

        return;
      }

      const user = users?.find(u => u.id === userId) || null;

      onSelectedUser(user);
    };
  */
  }

  const handleUserClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    user: User,
  ) => {
    event.preventDefault();
    onSelectedUser(user);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      data-cy="UserSelector"
      className={cn('dropdown', { 'is-active': isOpen })}
    >
      <div className="dropdown-trigger">
        <button
          type="button"
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={handleButtonClick}
        >
          {selectedUser ? (
            <span>{selectedUser.name}</span>
          ) : (
            <span>Choose a user</span>
          )}

          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {users?.map(user => (
            <a
              key={user.id}
              href={`#user-${user.id}`}
              className={cn('dropdown-item', {
                'is-active': selectedUser?.id === user.id,
              })}
              onClick={event => handleUserClick(event, user)}
            >
              {user.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
