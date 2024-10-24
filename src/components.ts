import {DailyMenu} from './interfaces/Menu';
import {Restaurant} from './interfaces/Restaurant';
import { fetchData } from './functions';
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

export const weeklyMenu = async (restaurantId: string): Promise<void> => {
  try {
    const weeklyMenu: WeeklyMenu = await fetchData(
      `/restaurants/weekly/${restaurantId}/fi`
    );
    const modal = document.getElementById('modal') as HTMLDialogElement | null;
    if (!modal) {
      throw new Error('Modal not found');
    } else {
      const menuContainer = document.getElementById('modal-content') as HTMLDivElement | null;
      const foodContainer = document.createElement('div');

      if (menuContainer) {
        menuContainer.innerHTML = '';
        foodContainer.id = 'weeklyFoodData';

        console.log(weeklyMenu.days);
        if (!(weeklyMenu.days.length === 0)) {
          weeklyMenu.days.map((day) => {
            const date = document.createElement('h2');
            const dateFoodContainer = document.createElement('div');
            dateFoodContainer.classList.add('modalFoodData');
            day.courses.map((data) => {
              const foodName = document.createElement('h3');
              foodName.textContent = data.name;
              const diets = document.createElement('p');
              diets.textContent = 'Allergeenit: ' + data.diets;
              const price = document.createElement('p');
              price.textContent = data.price
                ? 'Hinta: ' + data.price
                : 'Hinta: Ei saatavilla';

              dateFoodContainer.append(foodName, diets, price);
            });

            console.log(day);
            date.textContent = day.date;
            foodContainer.append(date, dateFoodContainer);
            if (menuContainer) {
              menuContainer.appendChild(foodContainer);
            }
          });
        } else {
          const noMenu = document.createElement('h4');
          noMenu.textContent = 'Ei menua saatavilla';
          foodContainer.appendChild(noMenu);
          menuContainer.appendChild(foodContainer);
        }
      }
      modal.showModal();
    }
  } catch (error) {
    console.error('Error fetching weekly menu:', error);
    const modal = document.getElementById('modal') as HTMLDialogElement | null;
    if (modal) {
      modal.innerHTML = errorModal((error as Error).message);
      modal.showModal();
    }
  }
};

export {restaurantRow, restaurantModal};