import { Injectable } from '@angular/core';
import { User } from '../auth/interfaces/user.Interface';
export const constants = {
  BASE_URL_USERAPP: 'https://localhost:7186/api/UserApp/',
  BASE_URL_PARTNER: 'https://localhost:7202/api/Partner/',
  BASE_URL_SETTING: 'https://localhost:7171/api/Setting/',
  BASE_URL_LOAN: 'https://localhost:7274/api/Fee/',
  BASE_URL_PAYMENT: 'https://localhost:',
  pageSize: 10,
  pageNumber: 1,
  starRow: 1,
  endRow: 10,
  totalRecords: 0,

  current_User(): User | null {
    const userDataString = localStorage.getItem('currentUser');
    if (userDataString) {
      return JSON.parse(userDataString) as User;
    }
    return null;
  },
};
