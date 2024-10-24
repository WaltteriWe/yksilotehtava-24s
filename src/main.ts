import { errorModal, restaurantModal, restaurantRow, weeklyMenu } from './components';
import { fetchData } from './functions';
import { DailyMenu, WeeklyMenu } from './interfaces/Menu';
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

        // Fetch the daily menu and update modal with daily menu info
        modal.innerHTML = '';
        const dailyMenu = await fetchData<DailyMenu>(`${apiUrl}/restaurants/daily/${restaurant._id}/fi`);
        const dailyMenuHtml = restaurantModal(restaurant, dailyMenu);
        modal.insertAdjacentHTML('beforeend', dailyMenuHtml);

        // Create and add the "Weekly Menu" button to the modal
        const weeklyMenuBtn = document.createElement('button');
        weeklyMenuBtn.textContent = 'Weekly Menu';
        modal.appendChild(weeklyMenuBtn);

        // Attach click event to "Weekly Menu" button
        weeklyMenuBtn.addEventListener('click', async (event) => {
          event.preventDefault();
          event.stopPropagation();
          try {
            // Fetch the weekly menu and update modal with weekly menu info
            const weeklyMenuData = await fetchData<WeeklyMenu>(`${apiUrl}/restaurants/weekly/${restaurant._id}/fi`);
            console.log('Weekly Menu Data:', weeklyMenuData);
            const weeklyMenuHtml = weeklyMenu(weeklyMenuData); // Generate the HTML for weekly menu
            modal.innerHTML = ''; // Clear the modal content
            modal.insertAdjacentHTML('beforeend', weeklyMenuHtml); // Insert the new weekly menu HTML
          } catch (error) {
            console.error('Error fetching weekly menu:', error);
            modal.innerHTML = errorModal((error as Error).message); // Display error if fetch fails
          }
        });

        modal.showModal(); // Show the modal with daily menu and "Weekly Menu" button
      } catch (error) {
        modal.innerHTML = errorModal((error as Error).message);
        modal.showModal();
      }
    });
  });
};

// Geolocation handling and fetching restaurant data
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
});
