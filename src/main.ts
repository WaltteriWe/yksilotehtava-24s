import { errorModal, restaurantModal, restaurantRow, weeklyMenu } from './components';
import { fetchData } from './functions';
import { DailyMenu } from './interfaces/Menu';
import { Restaurant } from './interfaces/Restaurant';
import { apiUrl, positionOptions } from './interfaces/Variables';

const modal = document.querySelector('dialog') as HTMLDialogElement;
if (!modal) {
  throw new Error('Modal not found');
}
modal.addEventListener('click', () => {
  modal.close();
});

const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const createTable = (restaurants: Restaurant[]) => {
  const table = document.querySelector('table');
  if (!table) {
    console.log('table not found');
    return;
  }
  table.innerHTML = '';
  restaurants.forEach((restaurant) => {
    const tr = restaurantRow(restaurant);
    table.appendChild(tr);
    tr.addEventListener('click', async () => {
      try {
        // Remove all highlights
        const allHighs = document.querySelectorAll('.highlight');
        allHighs.forEach((high) => {
          high.classList.remove('highlight');
        });
        // Add highlight
        tr.classList.add('highlight');
        // Add restaurant data to modal
        modal.innerHTML = '';

        // Fetch menu
        const menu = await fetchData<DailyMenu>(
          apiUrl + `/restaurants/daily/${restaurant._id}/fi`
        );
        console.log(menu);

        const menuHtml = restaurantModal(restaurant, menu);
        modal.insertAdjacentHTML('beforeend', menuHtml);

        // Create the weekly menu button
        const weeklyMenuBtn = document.createElement('button');
        weeklyMenuBtn.textContent = 'Weekly Menu';
        weeklyMenuBtn.addEventListener('click', async () => {
          try {
            const weeklyHtml = await weeklyMenu(restaurant._id); // Ensure this returns a string
            modal.insertAdjacentHTML('beforeend', weeklyHtml);
          } catch (error) {
            console.error('Error fetching weekly menu:', error);
            modal.innerHTML = errorModal((error as Error).message);
            modal.showModal();
          }
        });

        modal.appendChild(weeklyMenuBtn); // Append the button to the modal
        modal.showModal(); // Show the modal
      } catch (error) {
        modal.innerHTML = errorModal((error as Error).message);
        modal.showModal();
      }
    });
  });
};

const error = (err: GeolocationPositionError) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

const success = async (pos: GeolocationPosition) => {
  try {
    const crd = pos.coords;
    const restaurants = await fetchData<Restaurant[]>(apiUrl + '/restaurants');
    console.log(restaurants);
    restaurants.sort((a: Restaurant, b: Restaurant) => {
      const x1 = crd.latitude;
      const y1 = crd.longitude;
      const x2a = a.location.coordinates[1];
      const y2a = a.location.coordinates[0];
      const distanceA = calculateDistance(x1, y1, x2a, y2a);
      const x2b = b.location.coordinates[1];
      const y2b = b.location.coordinates[0];
      const distanceB = calculateDistance(x1, y1, x2b, y2b);
      return distanceA - distanceB;
    });
    createTable(restaurants);
  } catch (error) {
    modal.innerHTML = errorModal((error as Error).message);
    modal.showModal();
  }
};

// Main logic
document.addEventListener('DOMContentLoaded', () => {
  try {
    navigator.geolocation.getCurrentPosition(success, error, positionOptions);
  } catch (error) {
    console.error('Error in main logic:', error);
    modal.innerHTML = errorModal((error as Error).message);
    modal.showModal();
  }

  const menuContainer = document.getElementById('menu-container');

  if (menuContainer) {
    const weeklyMenuBtn = document.getElementById('weekly-menu');

    if (weeklyMenuBtn) {
      weeklyMenuBtn.addEventListener('click', async () => {
        try {
          await weeklyMenu('restaurant._id'); // Call the function
        } catch (error) {
          console.error('Error fetching weekly menu from container:', error);
        }
      });
    } else {
      console.log('Weekly menu button not found');
    }
  } else {
    console.log('Menu container not found');
  }
});
