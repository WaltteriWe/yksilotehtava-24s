import {DailyMenu} from './interfaces/Menu';
import {Restaurant} from './interfaces/Restaurant';
import { WeeklyMenu } from './interfaces/Menu';

const restaurantRow = (restaurant: Restaurant) => {
  const {name, address, company} = restaurant;
  const tr = document.createElement('tr');
  const nameCell = document.createElement('td');
  nameCell.innerText = name;
  const addressCell = document.createElement('td');
  addressCell.innerText = address;
  const companyCell = document.createElement('td');
  companyCell.innerText = company;
  tr.appendChild(nameCell);
  tr.appendChild(addressCell);
  tr.appendChild(companyCell);
  return tr;
};

const restaurantModal = (restaurant: Restaurant, menu: DailyMenu) => {
  const {name, address, city, postalCode, phone, company} = restaurant;
  let html = `<h3>${name}</h3>
    <p>${company}</p>
    <p>${address} ${postalCode} ${city}</p>
    <p>${phone}</p>
    <table>
      <tr>
        <th>Course</th>
        <th>Diet</th>
        <th>Price</th>
      </tr>
    `;
  menu.courses.forEach((course) => {
    const {name, diets, price} = course;
    html += `
          <tr>
            <td>${name}</td>
            <td>${diets ?? ' - '}</td>
            <td>${price ?? ' - '}</td>
          </tr>
          `;
  });
  html += '</table>';
  return html;
};

export const errorModal = (message: string) => {
  const html = `
    <h3>Error</h3>
    <p>${message}</p>
  `;
  return html;
};

const weeklyMenu = (weeklyMenuData: WeeklyMenu) => {
  let html = `
    <table>
      <tr>
        <th>Day</th>
        <th>Course</th>
        <th>Price</th>
        <th>Diet</th>
      </tr>
  `;

  // Iterate over the days array
  weeklyMenuData.days.forEach((day) => {
    const { date, courses } = day;

    if (courses && courses.length > 0) {
      courses.forEach((course) => {
        const { name, price, diets } = course;

        // Add the data to the table
        html += `
          <tr>
            <td>${date}</td>
            <td>${name}</td>
            <td>${price ?? ' - '}</td>
            <td>${diets ?? ' - '}</td>
          </tr>
        `;
      });
    } else {
      html += `
        <tr>
          <td>${date}</td>
          <td colspan="3">No courses available</td>
        </tr>
      `;
    }
  });

  html += '</table>';
  return html;
};


export {restaurantRow, restaurantModal, weeklyMenu};